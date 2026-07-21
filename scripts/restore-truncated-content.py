#!/usr/bin/env python3
"""
Restore missing body content from WP scrapes into truncated MDX articles.

Reads data/audit-restore-list.json and for each article:
1. Loads the WP scraped markdown from .firecrawl/wp/{slug}.json
2. Extracts the editorial body text (strips nav, breadcrumbs, related posts)
3. Replaces the MDX body while preserving frontmatter
4. Reports what changed

Usage:
  python3 scripts/restore-truncated-content.py [--dry-run] [--limit N] [--slug SLUG]
"""

import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_restore_list():
    with open(os.path.join(ROOT, 'data', 'audit-restore-list.json')) as f:
        return json.load(f)


def extract_wp_body(wp_json):
    """Extract clean editorial body from WP scraped markdown."""
    md = wp_json.get('markdown', '')
    lines = md.split('\n')

    # Find the title heading (# Title)
    title_idx = 0
    for i, line in enumerate(lines):
        if line.startswith('# '):
            title_idx = i
            break

    # Body starts after the title
    body_lines = lines[title_idx + 1:]

    # Remove leading breadcrumb/nav links
    while body_lines and (body_lines[0].strip() == '' or
                          body_lines[0].strip().startswith('[') and
                          len(body_lines[0]) < 80):
        body_lines.pop(0)

    body = '\n'.join(body_lines)

    # Remove common WP artifacts
    body = re.split(r'###?\s*Related Posts', body)[0]
    body = re.split(r'###?\s*You May Also Like', body)[0]
    body = re.split(r'###?\s*RELATED', body)[0]
    body = body.replace('\nSave\n', '\n')

    # Remove breadcrumb links at the top
    body = re.sub(r'^\[[\w\s&]+\]\(https://www\.beauticate\.com/[^)]*\)\s*\n*', '', body)

    # Remove "Previous" / "Next" navigation
    body = re.sub(r'^(Previous|Next)\s*$', '', body, flags=re.MULTILINE)

    # Convert WP image URLs to local paths where possible
    # Keep wp-content URLs as-is (they still serve from the old CDN)

    # Clean up excessive blank lines
    body = re.sub(r'\n{4,}', '\n\n\n', body)

    return body.strip()


def get_frontmatter(mdx_content):
    """Extract frontmatter from MDX file."""
    parts = mdx_content.split('---', 2)
    if len(parts) >= 3:
        return '---' + parts[1] + '---'
    return ''


def get_existing_body(mdx_content):
    """Get existing body content after frontmatter."""
    parts = mdx_content.split('---', 2)
    if len(parts) >= 3:
        return parts[2].strip()
    return mdx_content


def merge_bodies(existing_body, wp_body, slug):
    """Merge WP body into existing MDX, preserving any MDX-specific components."""
    # Preserve any existing MDX components (YouTubeEmbed, ShopGrid, etc.)
    mdx_components = []
    for line in existing_body.split('\n'):
        stripped = line.strip()
        if stripped.startswith('<') and any(comp in stripped for comp in
                ['YouTubeEmbed', 'ShopGrid', 'ShopItem', 'Portrait', 'InlineImage']):
            mdx_components.append(stripped)

    # If existing body is very short (just credits or shop section),
    # replace entirely with WP body
    # But append any MDX components that were there
    result = wp_body

    if mdx_components:
        result = result + '\n\n' + '\n\n'.join(mdx_components)

    return result


def process_article(article, dry_run=False):
    """Process a single article, returning (slug, action, details)."""
    slug = article['slug']
    mdx_path = os.path.join(ROOT, article['mdx_path'])
    wp_path = os.path.join(ROOT, '.firecrawl', 'wp', f'{slug}.json')

    if not os.path.exists(wp_path):
        return slug, 'SKIP', 'No WP scrape'

    if not os.path.exists(mdx_path):
        return slug, 'SKIP', 'No MDX file'

    with open(wp_path) as f:
        wp_data = json.load(f)

    with open(mdx_path, encoding='utf-8') as f:
        mdx_content = f.read()

    wp_body = extract_wp_body(wp_data)
    if len(wp_body.split()) < 50:
        return slug, 'SKIP', f'WP body too short ({len(wp_body.split())} words)'

    frontmatter = get_frontmatter(mdx_content)
    existing_body = get_existing_body(mdx_content)
    new_body = merge_bodies(existing_body, wp_body, slug)

    if not dry_run:
        with open(mdx_path, 'w', encoding='utf-8') as f:
            f.write(frontmatter + '\n' + new_body + '\n')

    old_wc = len(existing_body.split())
    new_wc = len(new_body.split())

    return slug, 'RESTORED', f'{old_wc} -> {new_wc} words'


def main():
    dry_run = '--dry-run' in sys.argv
    limit = None
    target_slug = None

    for i, arg in enumerate(sys.argv):
        if arg == '--limit' and i + 1 < len(sys.argv):
            limit = int(sys.argv[i + 1])
        if arg == '--slug' and i + 1 < len(sys.argv):
            target_slug = sys.argv[i + 1]

    articles = load_restore_list()

    if target_slug:
        articles = [a for a in articles if a['slug'] == target_slug]

    if limit:
        articles = articles[:limit]

    mode = 'DRY RUN' if dry_run else 'LIVE'
    print(f'=== Content Restoration ({mode}) ===')
    print(f'Processing {len(articles)} articles\n')

    restored = 0
    skipped = 0

    for article in articles:
        slug, action, details = process_article(article, dry_run)
        icon = '+' if action == 'RESTORED' else '-'
        print(f'  [{icon}] {slug}: {details}')
        if action == 'RESTORED':
            restored += 1
        else:
            skipped += 1

    print(f'\nDone: {restored} restored, {skipped} skipped')


if __name__ == '__main__':
    main()
