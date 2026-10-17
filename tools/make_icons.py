#!/usr/bin/env python3
"""Draw the PWA icons with Pillow (original, code-drawn): an arched gate with a glowing seam of light, no extra ornaments.
Output: icon-192.png, icon-512.png, icon-maskable-512.png. Geometry matches src/ui/logo.svg."""
import math
from PIL import Image, ImageDraw, ImageFilter, ImageChops
BG, VI, ICE, WHITE = (3, 2, 7), (160, 123, 255), (92, 200, 255), (230, 245, 255)

def arch(): # outer gate outline, 64-unit canvas
    pts = [(14, 56), (14, 28)] + [(32 + 18 * math.cos(math.radians(a)), 28 + 18 * math.sin(math.radians(a))) for a in range(180, 361, 6)] + [(50, 28), (50, 56)]
    return pts
def inner():
    return [(20, 56), (20, 29)] + [(32 + 12 * math.cos(math.radians(a)), 29 + 12 * math.sin(math.radians(a))) for a in range(180, 361, 6)] + [(44, 29), (44, 56)]

def render(size, scale=1.0, SS=3):
    n = size * SS
    u = n / 64 * scale; o = n * (1 - scale) / 2
    P = lambda p: (o + p[0] * u, o + p[1] * u)
    W = lambda w: max(1, round(w * u))
    # background: soft violet bloom behind the gate
    bg = Image.new("RGB", (n, n), BG)
    bloom = Image.new("RGB", (n, n), (0, 0, 0))
    ImageDraw.Draw(bloom).ellipse([P((6, 6)), P((58, 62))], fill=(58, 30, 130))
    bg = ImageChops.add(bg, bloom.filter(ImageFilter.GaussianBlur(n * .11)))
    # light cast on the floor in front of the gate
    floor = Image.new("RGB", (n, n), (0, 0, 0))
    ImageDraw.Draw(floor).polygon([P((32, 55)), P((10, 63)), P((54, 63))], fill=(40, 90, 130))
    bg = ImageChops.add(bg, floor.filter(ImageFilter.GaussianBlur(n * .02)))
    glow = Image.new("RGB", (n, n), (0, 0, 0)); gd = ImageDraw.Draw(glow)
    sharp = Image.new("RGB", (n, n), (0, 0, 0)); sd = ImageDraw.Draw(sharp)
    for d, wd in ((gd, 5), (sd, 2.6)):
        d.line([P(p) for p in arch()], fill=VI, width=W(wd), joint="curve")
    for d, wd in ((gd, 3), (sd, 1.2)):
        dim = tuple(int(c * .55) for c in ICE)
        d.line([P(p) for p in inner()], fill=dim, width=W(wd), joint="curve")
    # glowing seam of light, widest at the base
    for d, w0 in ((gd, 6), (sd, 2.2)):
        d.line([P((32, 11)), P((32, 56))], fill=ICE if d is gd else WHITE, width=W(w0))
    img = ImageChops.add(bg, glow.filter(ImageFilter.GaussianBlur(n * .018)))
    img = ImageChops.add(img, sharp)
    return img.resize((size, size), Image.LANCZOS)

render(192).save("icon-192.png")
render(512).save("icon-512.png")
render(512, .68).save("icon-maskable-512.png")  # content inside the maskable safe zone
