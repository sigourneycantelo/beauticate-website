#!/usr/bin/env python3
"""Prepare uploaded camera/press originals for an article directory.

Bakes in EXIF rotation, converts to JPEG, caps the long edge and compresses to
a web-sane size, writing each file under the slot name the MDX expects.

    python3 scripts/prep-article-images.py <dir> --map IMG_7182.jpeg=hero.jpg ...

Two things it exists to prevent, both of which have bitten this repo before:
phone shots whose EXIF orientation flag is stripped in transit, leaving
portraits stored as sideways landscapes; and featured_image files over 2MB,
which fail scripts/check-editorial-integrity.mjs.
"""
import argparse, pathlib, sys
from PIL import Image, ImageOps

# Landscape heroes run full bleed; body and card images never need more.
LONG_EDGE = {'hero': 2400, 'featured': 1600, 'body': 1800}
QUALITY, TARGET_KB = 82, 1600


def kind(name):
    if name.startswith('hero'):
        return 'hero'
    return 'featured' if name.startswith('featured') else 'body'


def prep(src: pathlib.Path, dest: pathlib.Path) -> str:
    im = ImageOps.exif_transpose(Image.open(src))   # rotation into the pixels
    if im.mode != 'RGB':
        im = im.convert('RGB')
    limit = LONG_EDGE[kind(dest.name)]
    if max(im.size) > limit:
        im.thumbnail((limit, limit), Image.LANCZOS)
    q = QUALITY
    while True:
        im.save(dest, 'JPEG', quality=q, optimize=True, progressive=True)
        if dest.stat().st_size <= TARGET_KB * 1024 or q <= 60:
            break
        q -= 6
    w, h = im.size
    shape = 'portrait' if h > w else 'landscape'
    return f'{dest.name:<38} {w}x{h} {shape:<9} {dest.stat().st_size/1024:6.0f} KB  q{q}'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('directory', type=pathlib.Path)
    ap.add_argument('--map', nargs='+', required=True, metavar='SRC=DEST')
    args = ap.parse_args()

    pairs = []
    for entry in args.map:
        if '=' not in entry:
            sys.exit(f'--map entries must be SRC=DEST, got: {entry}')
        src, dest = entry.split('=', 1)
        src_path = args.directory / src
        if not src_path.exists():
            sys.exit(f'missing source: {src_path}')
        pairs.append((src_path, args.directory / dest))

    for src, dest in pairs:
        print(prep(src, dest))
    print(f'\n{len(pairs)} written. Delete the unused originals before committing.')


if __name__ == '__main__':
    main()
