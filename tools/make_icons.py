#!/usr/bin/env python3
"""Draw the PWA icons (same geometry as src/ui/logo.svg) with Pillow. Output: icon-192.png, icon-512.png, icon-maskable-512.png."""
from PIL import Image, ImageDraw
BG, VI, ICE = (3, 2, 7), (160, 123, 255), (92, 200, 255)
def draw(size, scale=1.0, SS=4):
    n = size * SS
    im = Image.new("RGB", (n, n), BG)
    d = ImageDraw.Draw(im)
    u = n / 64 * scale
    o = n * (1 - scale) / 2
    P = lambda x, y: (o + x * u, o + y * u)
    d.rectangle([*P(14, 9), *P(50, 55)], outline=VI, width=max(1, round(3 * u)))
    dim = tuple(int(c * .7 + b * .3) for c, b in zip(VI, BG))
    for a, b in [((14, 9), (32, 21)), ((50, 9), (32, 21)), ((14, 55), (32, 43)), ((50, 55), (32, 43))]:
        d.line([P(*a), P(*b)], fill=dim, width=max(1, round(2 * u)))
    d.line([P(32, 9), P(32, 55)], fill=ICE, width=max(1, round(2.5 * u)))
    for a, b in [((8, 4), (8, 12)), ((4, 8), (12, 8)), ((56, 60), (56, 52)), ((60, 56), (52, 56))]:
        d.line([P(*a), P(*b)], fill=ICE, width=max(1, round(2 * u)))
    return im.resize((size, size), Image.LANCZOS)
draw(192).save("icon-192.png")
draw(512).save("icon-512.png")
draw(512, .62).save("icon-maskable-512.png")  # content inside the maskable safe zone
