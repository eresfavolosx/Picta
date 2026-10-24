# Picta: Assistive Camera & Color Vision Deficiency Engine

**Picta** is an assistive web application designed to empower individuals with Color Vision Deficiency (CVD) — including Protanopia, Deuteranopia, Tritanopia, and Achromatopsia — to perceive, distinguish, and identify colors in real-time through their mobile and desktop cameras.

---

## Key Features

1. **Real-Time Live Viewfinder & WebRTC Pipeline:**
   - Seamless live video streaming via `navigator.mediaDevices.getUserMedia` with rear/front camera lens switching.
   - Fallback photo upload and built-in authentic **Ishihara Plate (#74 / #12)** generator for instant testing.

2. **Mathematical Daltonization & CVD Filters:**
   - **Protanopia Boost (Red-Weakness Correction):** Calculates the missing L-cone error vector and shifts the energy into amber and blue channels, making red and green objects distinctly separate.
   - **Deuteranopia Boost (Green-Weakness Correction):** Re-projects missing M-cone frequencies across red and blue spectral regions.
   - **Tritanopia Boost (Blue-Weakness Correction):** Rebalances blue-yellow spectrum.
   - **High-Contrast Edge Sharpening:** Amplifies micro-contrasts and luminance borders for low-vision and Achromatopsia.
   - **CVD Simulation Modes:** Real-time Brettel/Viénot transformations for normal-vision designers, researchers, and family members to perceive what color-blind individuals see.

3. **Interactive Pixel Eyedropper & Voice Announcer:**
   - Tap anywhere on the live video stream or uploaded image to sample that pixel.
   - Calculates the closest named color from a human-calibrated perceptual palette using weighted Euclidean distance.
   - Displays exact color name, HEX code, RGB values, and tonal description.
   - Built-in Text-to-Speech (TTS) pronunciation.

4. **Snapshot Gallery & Local Storage (History):**
   - Haptic feedback and visual shutter flash.
   - Bakes applied Daltonization matrices directly onto the captured canvas.
   - Download snapshots or organize saved history locally.

---

## Technology Stack

- **Frontend:** Vanilla JavaScript (ES6+), HTML5 Canvas API, SVG Filter Primitives (`feColorMatrix`, `feComponentTransfer`)
- **Web APIs:** WebRTC `getUserMedia`, Web Audio API, Web Speech API (`SpeechSynthesis`), Vibration API
- **Design System:** Mobile-first Material Design with responsive glassmorphism

---

## Author

- **Fabián Vélez Vicente** ([@eresfavolosx](https://github.com/eresfavolosx))
