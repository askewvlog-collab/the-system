#!/usr/bin/env python3
"""Print the hash for a secret-rank key (same FNV-1a as the app). Usage: python3 tools/hashkey.py WORD
Paste the number into SECRET_HASH in src/prestige/secret.js. The word itself is never stored in the app."""
import sys
h = 2166136261
for c in sys.argv[1].strip().upper():
    h ^= ord(c)
    h = (h * 16777619) & 0xFFFFFFFF
print(h)
