# Picta — Assistive Camera for Color Vision Deficiency

[![Live Demo](https://img.shields.io/badge/demo-picta.novu.works-0f172a?style=flat-square)](https://picta.novu.works)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![WebRTC](https://img.shields.io/badge/WebRTC-getUserMedia-333333?style=flat-square&logo=webrtc)
![Accessibility](https://img.shields.io/badge/a11y-assistive%20tech-2563eb?style=flat-square)

**Picta** is a browser-based assistive camera that helps people with **Color Vision Deficiency (CVD)** (Protanopia, Deuteranopia, Tritanopia, and Achromatopsia) tell colors apart and identify them in real time, on any phone or laptop, with nothing to install.

> **▶ Live demo:** **[picta.novu.works](https://picta.novu.works)** · Part of the [NovuWorks portfolio](https://novu.works)

---

## Why it matters

About **1 in 12 men and 1 in 200 women** have some form of color vision deficiency. Everyday jobs like reading charts, matching clothes, checking produce, or reading status lights can be frustrating. Picta puts a color-correcting lens and a talking color picker in the browser.

## Features

### 🎥 Live camera pipeline
- Real-time viewfinder via `navigator.mediaDevices.getUserMedia`, with **front/rear lens switching**
- **Photo upload** fallback when no camera is available
- Built-in **Ishihara-style test plate** generator for instant self-checks

### 🎨 Daltonization & simulation filters
| Mode | Purpose |
| --- | --- |
| **Protanopia boost** | Moves lost red (L-cone) information into channels the user can see |
| **Deuteranopia boost** | Moves lost green (M-cone) information across red/blue |
| **Tritanopia boost** | Rebalances the blue–yellow axis |
| **High-contrast edges** | Boosts luminance borders for low vision and Achromatopsia |
| **CVD simulation** | Shows people with typical color vision what a CVD user sees |

### 💧 Tap-to-inspect eyedropper
- Tap any point on the video or image to sample that pixel
- Finds the **nearest named color** using weighted Euclidean distance over a perceptual palette
- Shows the name, **HEX**, **RGB**, and a tone description, then **reads it aloud** (Web Speech API)

### 📸 Snapshots & history
- Shutter sound, haptic feedback, and flash animation
- Applied filters are **baked into the saved image**
- Local history gallery with a badge counter and download support

## Tech Stack

- **Core:** Vanilla JavaScript (ES6+, IIFE module, no framework), HTML5 Canvas
- **Imaging:** SVG filter primitives (`feColorMatrix`, `feComponentTransfer`) for GPU-accelerated color transforms
- **Web APIs:** WebRTC, Web Audio, Web Speech (`SpeechSynthesis`), Vibration, `localStorage`
- **UI:** Mobile-first Material-inspired design with Framework7 and Bootstrap foundations

## Getting Started

The camera needs a secure context, so serve over `localhost` or HTTPS:

```bash
git clone https://github.com/eresfavolosx/Picta.git
cd Picta
python3 -m http.server 8080
# open http://localhost:8080 and allow camera access
```

**Browser support:** Current Safari (iOS/macOS), Chrome, Edge, and Firefox. Speech output uses the device's installed voices.

## Project Structure

```text
Picta/
├── index.html            # App shell: viewfinder, filter bar, inspector
├── Pages/
│   ├── History-Tab.html  # Saved snapshots
│   └── Settings-Tab.html # Preferences
└── Assets/
    ├── CSS/style.css     # App design system
    └── JS/script.js      # Camera, filters, eyedropper, history (~700 LOC)
```

## Project History

- **2016:** Original prototype built.
- **2026:** Rebuilt as a full assistive CVD camera. See [CHANGELOG.md](CHANGELOG.md).

## Author

**Fabián Vélez Vicente**: [novu.works](https://novu.works) · [GitHub @eresfavolosx](https://github.com/eresfavolosx)
