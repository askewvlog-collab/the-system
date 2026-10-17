#!/usr/bin/env python3
"""Bundle src/ into one standalone index.html (no network, no dependencies)."""
import pathlib, json, urllib.parse
R = pathlib.Path(__file__).parent
S = R / "src"
# Load order matters: const declarations run at load. core first, boot last.
ORDER = ["core/state.js", "core/save.js", "core/backup.js", "ranks/ranks.js", "ranks/rewards.js", "quests/quests.js",
         "gates/gates.js", "gates/keys.js", "gates/special.js", "gates/fx.js", "prestige/secret.js", "prestige/prestige.js", "exercises/exercises.js", "summaries/summaries.js", "tutorial/tutorial.js", "ui/ui.js", "ui/settings.js", "main.js"]
read = lambda p: (S / p).read_text(encoding="utf-8")
logo = read("ui/logo.svg").strip()
icon = "data:image/svg+xml," + urllib.parse.quote(logo)
js = "const LOGO=" + json.dumps(logo) + ";\n" + "".join(read(f) for f in ORDER)
html = f"""<!DOCTYPE html>
<!-- The System | Fitness Tracker. Copyright (C) 2026 ASKEW. GPL-3.0-or-later, see LICENSE. -->
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>The System | Fitness Tracker</title>
<meta name="description" content="The System | Fitness Tracker: an offline fitness quest game. No accounts, no network.">
<meta name="theme-color" content="#030207">
<link rel="icon" href="{icon}">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-192.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="The System">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<style>
{read("ui/styles.css")}{read("ui/flame.css")}{read("exercises/exercises.css")}{read("tutorial/tutorial.css")}{read("gates/keys.css")}{read("gates/fx.css")}{read("prestige/prestige.css")}</style></head><body>
{read("ui/template.html").rstrip()}
<script>
{js}</script></body></html>
"""
(R / "index.html").write_text(html, encoding="utf-8")
import hashlib
(R / "sw.js").write_text((R / "pwa" / "sw.template.js").read_text(encoding="utf-8").replace("__VERSION__", hashlib.sha1(html.encode("utf-8")).hexdigest()[:10]), encoding="utf-8")
print("index.html", len(html), "bytes")

# Test runner page: the same app plus tests/tests.js, with localStorage stubbed so no real save is touched.
guard = '<script>window.__noFx=true;Object.defineProperty(window,"localStorage",{value:{getItem(){return null},setItem(){},removeItem(){}}})</script>'
runner = html.replace("<head>", "<head>" + guard, 1).replace("</body>", "<pre id=\"tr\"></pre><script>\n" + (R / "tests" / "tests.js").read_text(encoding="utf-8") + "</script></body>")
(R / "tests" / "runner.html").write_text(runner, encoding="utf-8")
print("tests/runner.html")

# Dev page: same app plus a test panel (tools/dev.js) and its own save key. Gitignored; never part of the release.
dev = html.replace("<head>", '<head><script>window.__SAVEKEY="gate1dev"</script>', 1).replace("</body>", "<script>\n" + (R / "tools" / "dev.js").read_text(encoding="utf-8") + "</script></body>")
(R / "dev.html").write_text(dev, encoding="utf-8")
print("dev.html")
