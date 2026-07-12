#!/usr/bin/env python3
"""
Full-site WP vs Vercel audit via Firecrawl.

Phase 1: Scrape all pre-migration articles from both WordPress and Vercel.
Phase 2: Compare and generate findings report.

Usage:
  python3 scripts/audit-full-site.py scrape [--start N] [--limit N]
  python3 scripts/audit-full-site.py compare
"""

import json, os, re, subprocess, sys, time, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(ROOT, 'data', 'audit-urls.json')
WP_DIR = os.path.join(ROOT, '.firecrawl', 'wp')
VERCEL_DIR = os.path.join(ROOT, '.firecrawl', 'vercel')
REPORT_FILE = os.path.join(ROOT, 'data', 'audit-report.json')
REPORT_MD = os.path.join(ROOT, 'data', 'audit-report.md')

os.makedirs(WP_DIR, exist_ok=True)
os.makedirs(VERCEL_DIR, exist_ok=True)


def load_articles():
    with open(DATA_FILE) as f:
        return json.load(f)


def scrape_batch(urls, output_dir, batch_label):
    """Scrape a list of (url, slug) tuples, saving each as slug.json."""
    to_scrape = []
    for url, slug in urls:
        out_path = os.path.join(output_dir, f'{slug}.json')
        if os.path.exists(out_path):
            continue
        to_scrape.append((url, slug, out_path))

    if not to_scrape:
        return 0

    # Firecrawl CLI handles concurrency (5 parallel), pass all URLs at once
    # but cap at 50 per invocation to avoid CLI arg limits
    scraped = 0
    for chunk_start in range(0, len(to_scrape), 50):
        chunk = to_scrape[chunk_start:chunk_start + 50]
        url_list = [item[0] for item in chunk]

        print(f'  {batch_label}: scraping {len(chunk)} URLs '
              f'({chunk_start+1}-{chunk_start+len(chunk)} of {len(to_scrape)})...')

        cmd = ['firecrawl', 'scrape'] + url_list + [
            '--only-main-content',
            '--format', 'markdown,links',
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, cwd=ROOT,
                                timeout=600)

        # Firecrawl saves multi-URL results to .firecrawl/ with auto-generated names
        # We need to find and rename them
        # The files are saved as .firecrawl/{domain}-{path}.json
        for url, slug, out_path in chunk:
            # Find the firecrawl output file for this URL
            # Pattern: .firecrawl/www-beauticate-com-{path}.json or similar
            found = find_firecrawl_output(url, slug)
            if found:
                os.rename(found, out_path)
                scraped += 1
            else:
                # Try direct single scrape as fallback
                single_cmd = ['firecrawl', 'scrape', url,
                              '--only-main-content',
                              '--format', 'markdown,links',
                              '-o', out_path]
                subprocess.run(single_cmd, capture_output=True, text=True,
                               cwd=ROOT, timeout=120)
                if os.path.exists(out_path):
                    scraped += 1

        # Brief pause between chunks
        if chunk_start + 50 < len(to_scrape):
            time.sleep(2)

    return scraped


def find_firecrawl_output(url, slug):
    """Find the auto-generated firecrawl output file for a given URL."""
    fc_dir = os.path.join(ROOT, '.firecrawl')
    # Firecrawl generates filenames from the URL path
    # e.g. www-beauticate-com-interviews-creatives-slug.json
    # or beauticate-website-vercel-app-interviews-creatives-slug.json

    # Try to find by slug in filename
    for f in os.listdir(fc_dir):
        if not f.endswith('.json'):
            continue
        if slug in f and os.path.isfile(os.path.join(fc_dir, f)):
            return os.path.join(fc_dir, f)

    return None


def do_scrape(start=0, limit=None):
    articles = load_articles()
    if limit:
        articles = articles[start:start + limit]
    else:
        articles = articles[start:]

    total = len(articles)
    print(f'Scraping {total} articles (WP + Vercel)...')
    print(f'Estimated credits: {total * 2}')
    print()

    # Scrape WP
    wp_pairs = [(a['wp_url'], a['slug']) for a in articles]
    wp_done = scrape_batch(wp_pairs, WP_DIR, 'WP')
    print(f'  WP: {wp_done} new scrapes')

    # Scrape Vercel
    vercel_pairs = [(a['vercel_url'], a['slug']) for a in articles]
    vercel_done = scrape_batch(vercel_pairs, VERCEL_DIR, 'Vercel')
    print(f'  Vercel: {vercel_done} new scrapes')

    # Count totals
    wp_total = len([f for f in os.listdir(WP_DIR) if f.endswith('.json')])
    vercel_total = len([f for f in os.listdir(VERCEL_DIR) if f.endswith('.json')])
    print(f'\nProgress: WP {wp_total}/{len(load_articles())} | '
          f'Vercel {vercel_total}/{len(load_articles())}')


def load_scraped(directory, slug):
    """Load a scraped JSON file, return dict or None."""
    path = os.path.join(directory, f'{slug}.json')
    if not os.path.exists(path):
        return None
    try:
        with open(path) as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return None


def extract_images(markdown):
    """Extract image URLs from markdown."""
    # Markdown images: ![alt](url)
    imgs = re.findall(r'!\[[^\]]*\]\(([^)]+)\)', markdown)
    # HTML img tags
    imgs += re.findall(r'<img[^>]+src="([^"]+)"', markdown)
    return imgs


def extract_youtube(markdown):
    """Extract YouTube video IDs from markdown/HTML."""
    ids = re.findall(r'(?:youtube\.com/(?:embed/|watch\?v=)|youtu\.be/)([a-zA-Z0-9_-]{11})', markdown)
    return list(set(ids))


def strip_nav(markdown):
    """Strip navigation/header/footer content from scraped markdown."""
    lines = markdown.split('\n')
    # Find first heading or substantial paragraph
    body_start = 0
    for i, line in enumerate(lines):
        if line.startswith('# ') or (len(line) > 100 and not line.startswith('[')):
            body_start = i
            break
    return '\n'.join(lines[body_start:])


def word_count(text):
    """Count words in text, stripping markdown/HTML."""
    clean = re.sub(r'<[^>]+>', ' ', text)
    clean = re.sub(r'!\[[^\]]*\]\([^)]*\)', ' ', clean)
    clean = re.sub(r'\[[^\]]*\]\([^)]*\)', ' ', clean)
    clean = re.sub(r'[#*_`]', '', clean)
    return len(clean.split())


def do_compare():
    articles = load_articles()
    findings = []

    wp_count = 0
    vercel_count = 0
    compared = 0

    for a in articles:
        slug = a['slug']
        wp = load_scraped(WP_DIR, slug)
        vercel = load_scraped(VERCEL_DIR, slug)

        if wp:
            wp_count += 1
        if vercel:
            vercel_count += 1

        if not wp or not vercel:
            continue

        compared += 1
        wp_md = wp.get('markdown', '')
        vercel_md = vercel.get('markdown', '')

        issues = []

        # 1. Missing YouTube embeds
        wp_yt = extract_youtube(wp_md)
        vercel_yt = extract_youtube(vercel_md)
        missing_yt = [vid for vid in wp_yt if vid not in vercel_yt]
        if missing_yt:
            issues.append({
                'type': 'MISSING_YOUTUBE',
                'detail': f'YouTube IDs on WP but not Vercel: {missing_yt}',
                'wp_ids': wp_yt,
                'vercel_ids': vercel_yt,
            })

        # 2. Missing images
        wp_imgs = extract_images(wp_md)
        wp_body_imgs = [img for img in wp_imgs
                        if 'wp-content/uploads' in img
                        and 'favicon' not in img
                        and 'logo' not in img.lower()
                        and 'cropped-' not in img]
        vercel_imgs = extract_images(vercel_md)

        if len(wp_body_imgs) > len(vercel_imgs) + 1:
            issues.append({
                'type': 'MISSING_IMAGES',
                'detail': f'WP has {len(wp_body_imgs)} body images, Vercel has {len(vercel_imgs)}',
                'wp_count': len(wp_body_imgs),
                'vercel_count': len(vercel_imgs),
            })

        # 3. Text truncation
        wp_words = word_count(strip_nav(wp_md))
        vercel_words = word_count(strip_nav(vercel_md))
        if wp_words > 50 and vercel_words < wp_words * 0.5:
            issues.append({
                'type': 'TEXT_TRUNCATION',
                'detail': f'WP has {wp_words} words, Vercel has {vercel_words} '
                          f'({vercel_words/wp_words*100:.0f}%)',
                'wp_words': wp_words,
                'vercel_words': vercel_words,
            })

        # 4. Broken images on Vercel (404 refs)
        broken = [img for img in vercel_imgs
                  if '/content/' in img and not img.startswith('http')]
        if broken:
            # Check if files exist
            missing_files = []
            for img in broken:
                # Convert URL path to filesystem path
                fs_path = os.path.join(ROOT, 'public', img.lstrip('/'))
                if not os.path.exists(fs_path):
                    missing_files.append(img)
            if missing_files:
                issues.append({
                    'type': 'BROKEN_IMAGES',
                    'detail': f'{len(missing_files)} broken image refs on Vercel',
                    'images': missing_files,
                })

        # 5. Hero image mismatch
        wp_meta_img = wp.get('metadata', {}).get('ogImage', '')
        if isinstance(wp_meta_img, list):
            wp_meta_img = wp_meta_img[0] if wp_meta_img else ''

        if issues:
            findings.append({
                'slug': slug,
                'category': a['category'],
                'subcategory': a.get('subcategory'),
                'date': a['date'],
                'wp_url': a['wp_url'],
                'vercel_url': a['vercel_url'],
                'issues': issues,
            })

    # Sort by severity (most issues first)
    findings.sort(key=lambda f: len(f['issues']), reverse=True)

    # Save JSON report
    report = {
        'generated': time.strftime('%Y-%m-%d %H:%M'),
        'total_articles': len(articles),
        'wp_scraped': wp_count,
        'vercel_scraped': vercel_count,
        'compared': compared,
        'articles_with_issues': len(findings),
        'findings': findings,
    }
    with open(REPORT_FILE, 'w') as f:
        json.dump(report, f, indent=2)

    # Generate markdown report
    issue_counts = {}
    for finding in findings:
        for issue in finding['issues']:
            t = issue['type']
            issue_counts[t] = issue_counts.get(t, 0) + 1

    md_lines = [
        '# Full Site Audit: WP vs Vercel',
        '',
        f'Generated: {report["generated"]}',
        '',
        '## Summary',
        '',
        f'- Total pre-migration articles: {report["total_articles"]}',
        f'- WordPress pages scraped: {report["wp_scraped"]}',
        f'- Vercel pages scraped: {report["vercel_scraped"]}',
        f'- Compared: {report["compared"]}',
        f'- **Articles with issues: {report["articles_with_issues"]}**',
        '',
        '## Issue breakdown',
        '',
    ]
    for issue_type, count in sorted(issue_counts.items(), key=lambda x: -x[1]):
        md_lines.append(f'- **{issue_type}**: {count} articles')

    md_lines += ['', '## Findings', '']
    for finding in findings:
        slug = finding['slug']
        md_lines.append(f'### {slug}')
        md_lines.append(f'- Category: {finding["category"]}/{finding.get("subcategory", "")}')
        md_lines.append(f'- Date: {finding["date"]}')
        md_lines.append(f'- WP: {finding["wp_url"]}')
        md_lines.append(f'- Vercel: {finding["vercel_url"]}')
        for issue in finding['issues']:
            md_lines.append(f'- **{issue["type"]}**: {issue["detail"]}')
        md_lines.append('')

    with open(REPORT_MD, 'w') as f:
        f.write('\n'.join(md_lines))

    print(f'Compared {compared} articles')
    print(f'Articles with issues: {len(findings)}')
    print(f'\nIssue breakdown:')
    for issue_type, count in sorted(issue_counts.items(), key=lambda x: -x[1]):
        print(f'  {issue_type}: {count}')
    print(f'\nReports saved to:')
    print(f'  {REPORT_FILE}')
    print(f'  {REPORT_MD}')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'help'

    if cmd == 'scrape':
        start = 0
        limit = None
        for i, arg in enumerate(sys.argv):
            if arg == '--start' and i + 1 < len(sys.argv):
                start = int(sys.argv[i + 1])
            if arg == '--limit' and i + 1 < len(sys.argv):
                limit = int(sys.argv[i + 1])
        do_scrape(start, limit)

    elif cmd == 'compare':
        do_compare()

    else:
        print('Usage:')
        print('  python3 scripts/audit-full-site.py scrape [--start N] [--limit N]')
        print('  python3 scripts/audit-full-site.py compare')
