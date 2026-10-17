# 1337 Tétouan — Monolith Countdown (Promo 2026)

Minimalist, intense, and cinematic dark countdown for **1337 Tétouan Integration Week (Promotion 2026)**.

---

## 🎯 Visual Architecture

- **100% Self-Contained & Offline-Ready** :
  - **`index.html`** is completely packed into a single standalone file.
  - **Zero online/external dependencies** : No external Google Fonts, no CDN links, and no remote requests. Works reliably without an internet connection on TVs, Raspberry Pis, and cluster machines.
- **Background Void** : Pure deep black (**`#000000`**).
- **Subtle White Binary Stream** : Ghosted digital binary rain (`0`s and `1`s) cascading in soft white at low opacity (8% – 20%), providing an elegant technical atmosphere without visual noise. Pre-populated across the entire viewport from the first frame.
- **Monolith Countdown (Center)** :
  - High-contrast **pure white** (**`#ffffff`**) using official 1337 vector typography.
  - Numbers-only minimalism (Days, Hours, Minutes, Seconds) with matching geometric colons.
  - Seamless vertical sliding animation on second transitions.
- **Headline Framing** :
  - **`BE READY`** rendered on the left using bespoke **square 1337 vector typography** (`1337_B.svg`, `1337_E.svg`, `1337_R.svg`, `1337_A.svg`, `1337_D.svg`, `1337_Y.svg`), perfectly matching the cut angles and geometry of the numbers.
  - **`1337` Morphing Tumbler** rendered on the right directly above the seconds, using the exact spacing, slot proportions, and vector paths from the official 1337 SVG (`viewBox="0 0 76 20"`). Cycles every 5 seconds between `1337` and `2026`.
- **Auto-Hiding Controls** :
  - Settings and fullscreen buttons smoothly disappear after 2 seconds of inactivity, along with the mouse cursor, for a completely clean TV/cluster display.

---

## 📁 File Structure

```text
├── index.html              # 100% self-contained, packed standalone countdown (zero external dependencies)
├── style.css               # Modular CSS source
├── script.js               # Modular JS source
├── favicon.svg             # 1337 vector favicon
├── assets/
│   └── 1337_Typography/    # Master 1337 vector typography (0-9 and letters B, E, R, A, D, Y)
└── README.md
```

---

## ⚡ How to Run Locally

Open `index.html` directly in any web browser (no local web server or internet connection required):

```bash
open index.html
```

Or on Linux / TV:
```bash
xdg-open index.html
```
