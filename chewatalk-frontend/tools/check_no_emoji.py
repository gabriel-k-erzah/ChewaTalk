"""Fails if any site file contains a character that phones may draw as an emoji.

ChewaTalk uses no emoji anywhere: icons are drawn as SVG or CSS shapes.
This covers every code point with the Unicode "Emoji" property outside plain
digits, '#' and '*', plus variation selector-16 and zero-width joiners.

Run before deploying:  python3 tools/check_no_emoji.py
"""
import pathlib, sys

# Code point ranges with the Unicode Emoji property (Unicode 15.1), excluding 0-9, #, *.
RANGES = [
    (0x00A9, 0x00A9), (0x00AE, 0x00AE), (0x203C, 0x203C), (0x2049, 0x2049), (0x2122, 0x2122),
    (0x2139, 0x2139), (0x2194, 0x2199), (0x21A9, 0x21AA), (0x231A, 0x231B), (0x2328, 0x2328),
    (0x23CF, 0x23CF), (0x23E9, 0x23F3), (0x23F8, 0x23FA), (0x24C2, 0x24C2), (0x25AA, 0x25AB),
    (0x25B6, 0x25B6), (0x25C0, 0x25C0), (0x25FB, 0x25FE), (0x2600, 0x27BF), (0x2934, 0x2935),
    (0x2B05, 0x2B07), (0x2B1B, 0x2B1C), (0x2B50, 0x2B50), (0x2B55, 0x2B55), (0x3030, 0x3030),
    (0x303D, 0x303D), (0x3297, 0x3297), (0x3299, 0x3299), (0x1F000, 0x1FAFF),
    (0xFE0F, 0xFE0F), (0x200D, 0x200D),
]
SITE = pathlib.Path(__file__).resolve().parent.parent
FILES = [p for p in SITE.rglob('*') if p.suffix in {'.html', '.css', '.js', '.json', '.txt', '.xml'} and '.wrangler' not in p.parts]

bad = 0
for f in FILES:
    for n, line in enumerate(f.read_text(encoding='utf-8').splitlines(), 1):
        for ch in line:
            cp = ord(ch)
            if any(a <= cp <= b for a, b in RANGES):
                bad += 1
                print(f"{f.relative_to(SITE)}:{n}: U+{cp:04X} {ch!r}  {line.strip()[:90]}")
print(f"{len(FILES)} files checked, {bad} emoji-capable characters found")
sys.exit(1 if bad else 0)
