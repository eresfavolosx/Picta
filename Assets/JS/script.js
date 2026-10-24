/**
 * Picta: Assistive Camera & Color Vision Deficiency Engine
 * 
 * Features:
 * - Real-time WebRTC camera feed with facing mode selection
 * - Hardware-accelerated Daltonization matrices (Protanopia, Deuteranopia, Tritanopia)
 * - CVD Simulation modes (Brettel/Viénot) & Achromatopsia edge enhancement
 * - Real-time pixel eyedropper with nearest named color classification
 * - Speech synthesis color announcement
 * - Canvas-based snapshot capture & LocalStorage gallery
 * - Built-in Ishihara color test plate generator for immediate evaluation
 */

(function () {
  'use strict';

  // --- Color Dictionary for Eyedropper Classification ---
  const COLOR_PALETTE = [
    { name: 'Pure White', hex: '#ffffff', r: 255, g: 255, b: 255, category: 'White' },
    { name: 'Snow White', hex: '#fbfbfb', r: 250, g: 250, b: 250, category: 'White' },
    { name: 'Light Ivory', hex: '#fffff0', r: 255, g: 255, b: 240, category: 'White' },
    { name: 'Jet Black', hex: '#0a0a0a', r: 10, g: 10, b: 10, category: 'Black' },
    { name: 'Deep Charcoal', hex: '#262626', r: 38, g: 38, b: 38, category: 'Gray' },
    { name: 'Slate Gray', hex: '#708090', r: 112, g: 128, b: 144, category: 'Gray' },
    { name: 'Medium Gray', hex: '#808080', r: 128, g: 128, b: 128, category: 'Gray' },
    { name: 'Silver Gray', hex: '#c0c0c0', r: 192, g: 192, b: 192, category: 'Gray' },
    { name: 'Bright Crimson Red', hex: '#dc143c', r: 220, g: 20, b: 60, category: 'Red' },
    { name: 'Vibrant Red', hex: '#ff0000', r: 255, g: 0, b: 0, category: 'Red' },
    { name: 'Deep Scarlet', hex: '#b71c1c', r: 183, g: 28, b: 28, category: 'Red' },
    { name: 'Ruby Red', hex: '#9b111e', r: 155, g: 17, b: 30, category: 'Red' },
    { name: 'Brick Red', hex: '#cb4154', r: 203, g: 65, b: 84, category: 'Red' },
    { name: 'Maroon', hex: '#800000', r: 128, g: 0, b: 0, category: 'Red' },
    { name: 'Burgundy', hex: '#800020', r: 128, g: 0, b: 32, category: 'Red' },
    { name: 'Coral Red', hex: '#ff4040', r: 255, g: 64, b: 64, category: 'Red' },
    { name: 'Salmon Pink', hex: '#fa8072', r: 250, g: 128, b: 114, category: 'Pink' },
    { name: 'Rose Pink', hex: '#ff66cc', r: 255, g: 102, b: 204, category: 'Pink' },
    { name: 'Hot Pink', hex: '#ff1493', r: 255, g: 20, b: 147, category: 'Pink' },
    { name: 'Blush Pink', hex: '#ffb6c1', r: 255, g: 182, b: 193, category: 'Pink' },
    { name: 'Bright Orange', hex: '#ff6600', r: 255, g: 102, b: 0, category: 'Orange' },
    { name: 'Tangerine', hex: '#ff8200', r: 255, g: 130, b: 0, category: 'Orange' },
    { name: 'Sunset Amber', hex: '#ffbf00', r: 255, g: 191, b: 0, category: 'Orange' },
    { name: 'Warm Peach', hex: '#ffcba4', r: 255, g: 203, b: 164, category: 'Orange' },
    { name: 'Golden Yellow', hex: '#ffd700', r: 255, g: 215, b: 0, category: 'Yellow' },
    { name: 'Lemon Yellow', hex: '#fff44f', r: 255, g: 244, b: 79, category: 'Yellow' },
    { name: 'Canary Yellow', hex: '#ffef00', r: 255, g: 239, b: 0, category: 'Yellow' },
    { name: 'Chartreuse Lime', hex: '#7fff00', r: 127, g: 255, b: 0, category: 'Green' },
    { name: 'Lime Green', hex: '#32cd32', r: 50, g: 205, b: 50, category: 'Green' },
    { name: 'Emerald Green', hex: '#00c957', r: 0, g: 201, b: 87, category: 'Green' },
    { name: 'Forest Green', hex: '#228b22', r: 34, g: 139, b: 34, category: 'Green' },
    { name: 'Dark Pine Green', hex: '#004d40', r: 0, g: 77, b: 64, category: 'Green' },
    { name: 'Olive Green', hex: '#808000', r: 128, g: 128, b: 0, category: 'Green' },
    { name: 'Moss Green', hex: '#8a9a5b', r: 138, g: 154, b: 91, category: 'Green' },
    { name: 'Mint Green', hex: '#98ff98', r: 152, g: 255, b: 152, category: 'Green' },
    { name: 'Seafoam Green', hex: '#2e8b57', r: 46, g: 139, b: 87, category: 'Green' },
    { name: 'Teal Blue', hex: '#008080', r: 0, g: 128, b: 128, category: 'Teal' },
    { name: 'Aquamarine', hex: '#7fffd4', r: 127, g: 255, b: 212, category: 'Teal' },
    { name: 'Vibrant Cyan', hex: '#00ffff', r: 0, g: 255, b: 255, category: 'Cyan' },
    { name: 'Sky Blue', hex: '#87ceeb', r: 135, g: 206, b: 235, category: 'Blue' },
    { name: 'Dodger Blue', hex: '#1e90ff', r: 30, g: 144, b: 255, category: 'Blue' },
    { name: 'Cobalt Blue', hex: '#0047ab', r: 0, g: 71, b: 171, category: 'Blue' },
    { name: 'Royal Blue', hex: '#4169e1', r: 65, g: 105, b: 225, category: 'Blue' },
    { name: 'Deep Navy Blue', hex: '#000080', r: 0, g: 0, b: 128, category: 'Blue' },
    { name: 'Midnight Blue', hex: '#191970', r: 25, g: 25, b: 112, category: 'Blue' },
    { name: 'Indigo', hex: '#4b0082', r: 75, g: 0, b: 130, category: 'Purple' },
    { name: 'Vibrant Purple', hex: '#800080', r: 128, g: 0, b: 128, category: 'Purple' },
    { name: 'Amethyst Violet', hex: '#9966cc', r: 153, g: 102, b: 204, category: 'Purple' },
    { name: 'Lavender', hex: '#e6e6fa', r: 230, g: 230, b: 250, category: 'Purple' },
    { name: 'Plum Purple', hex: '#dda0dd', r: 221, g: 160, b: 221, category: 'Purple' },
    { name: 'Magenta / Fuchsia', hex: '#ff00ff', r: 255, g: 0, b: 255, category: 'Magenta' },
    { name: 'Warm Chocolate Brown', hex: '#7b3f00', r: 123, g: 63, b: 0, category: 'Brown' },
    { name: 'Coffee Brown', hex: '#4b3621', r: 75, g: 54, b: 33, category: 'Brown' },
    { name: 'Chestnut Brown', hex: '#954535', r: 149, g: 69, b: 53, category: 'Brown' },
    { name: 'Caramel Tan', hex: '#d2b48c', r: 210, g: 180, b: 140, category: 'Brown' },
    { name: 'Desert Sand / Beige', hex: '#f5f5dc', r: 245, g: 245, b: 220, category: 'Beige' },
    { name: 'Khaki Gold', hex: '#c3b091', r: 195, g: 176, b: 145, category: 'Beige' }
  ];

  // --- Application State ---
  const state = {
    cameraStream: null,
    facingMode: 'environment', // 'environment' (back) or 'user' (selfie)
    currentFilter: 'normal',
    isSpeechEnabled: true,
    activeSource: 'camera', // 'camera' or 'canvas'
    lastSampledColor: null,
    reticlePos: { x: 0.5, y: 0.5 }, // normalized 0..1
    isAnalyzing: false
  };

  // --- DOM Elements ---
  const video = document.getElementById('camera-feed');
  const fallbackCanvas = document.getElementById('fallback-canvas');
  const hiddenCanvas = document.getElementById('hidden-capture-canvas');
  const viewport = document.getElementById('viewport');
  const reticle = document.getElementById('color-reticle');
  const reticleSwatch = document.getElementById('reticle-swatch');
  const cardSwatch = document.getElementById('card-swatch-circle');
  const cardName = document.getElementById('card-color-name');
  const cardHex = document.getElementById('card-hex');
  const cardRgb = document.getElementById('card-rgb');
  const cardDesc = document.getElementById('card-desc');
  const cameraStatusOverlay = document.getElementById('camera-status-overlay');
  const btnShutter = document.getElementById('btn-shutter');
  const btnCameraFlip = document.getElementById('btn-camera-flip');
  const btnTtsToggle = document.getElementById('btn-tts-toggle');
  const ttsIcon = document.getElementById('tts-icon');
  const btnSpeakColor = document.getElementById('btn-speak-color');
  const btnSampleImage = document.getElementById('btn-sample-image');
  const fileUploadInput = document.getElementById('file-upload-input');
  const btnRetryCamera = document.getElementById('btn-retry-camera');
  const filterCarousel = document.getElementById('filter-carousel');
  const toastContainer = document.getElementById('toast-container');
  const historyCounter = document.getElementById('history-counter');
  const cameraFlash = document.getElementById('camera-flash');

  // --- Web Audio Context for Shutter Feedback ---
  let audioCtx = null;
  function playShutterSound() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch (e) {
      // Audio autoplay restrictions or unsupported
    }
  }

  // --- Toast Notification Utility ---
  function showToast(message, duration = 2800) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'picta-toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 20);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // --- Human Perceptual Color Matching ---
  function findClosestColor(r, g, b) {
    let closest = COLOR_PALETTE[0];
    let minDistance = Infinity;

    for (let i = 0; i < COLOR_PALETTE.length; i++) {
      const p = COLOR_PALETTE[i];
      // Weighted Euclidean distance approximation for human visual sensitivity (redmean)
      const rmean = (r + p.r) / 2;
      const dr = r - p.r;
      const dg = g - p.g;
      const db = b - p.b;
      const dist = Math.sqrt(
        (2 + rmean / 256) * dr * dr +
        4.0 * dg * dg +
        (2 + (255 - rmean) / 256) * db * db
      );

      if (dist < minDistance) {
        minDistance = dist;
        closest = p;
      }
    }

    // Calculate HSL metrics for descriptive nuance
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h /= 6;
    }

    const hueDeg = Math.round(h * 360);
    const satPct = Math.round(s * 100);
    const lumPct = Math.round(l * 100);

    let toneDesc = 'Balanced';
    if (satPct > 70) toneDesc = 'Vivid / High Saturation';
    else if (satPct < 25) toneDesc = 'Muted / Neutral Tone';
    else toneDesc = 'Moderate Vibrancy';

    if (lumPct > 80) toneDesc += ' · Bright Highlight';
    else if (lumPct < 25) toneDesc += ' · Deep Shadow';

    return {
      name: closest.name,
      category: closest.category,
      hex: rgbToHex(r, g, b),
      r, g, b,
      hue: hueDeg,
      saturation: satPct,
      luminance: lumPct,
      description: `${closest.category} (${toneDesc})`
    };
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  }

  // --- Voice Announcement ---
  function speakColor(text) {
    if (!state.isSpeechEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  // --- Update Color Inspector UI ---
  function updateInspector(color, shouldAnnounce = false) {
    state.lastSampledColor = color;
    const rgbStr = `rgb(${color.r}, ${color.g}, ${color.b})`;

    if (reticleSwatch) reticleSwatch.style.setProperty('background-color', rgbStr, 'important');
    if (cardSwatch) cardSwatch.style.setProperty('background-color', rgbStr, 'important');
    if (cardName) cardName.textContent = color.name;
    if (cardHex) cardHex.textContent = color.hex;
    if (cardRgb) cardRgb.textContent = rgbStr;
    if (cardDesc) cardDesc.textContent = color.description;

    if (shouldAnnounce) {
      speakColor(color.name);
    }
  }

  // --- Sample Pixel Color from Active Feed ---
  function samplePixelAt(normX, normY, announce = false) {
    state.reticlePos.x = normX;
    state.reticlePos.y = normY;

    // Reposition the reticle DOM element
    if (reticle) {
      reticle.style.left = `${normX * 100}%`;
      reticle.style.top = `${normY * 100}%`;
    }

    let r = 128, g = 128, b = 128;

    if (state.activeSource === 'camera' && video.videoWidth > 0) {
      const canvas = hiddenCanvas;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const px = Math.min(canvas.width - 1, Math.max(0, Math.floor(normX * canvas.width)));
      const py = Math.min(canvas.height - 1, Math.max(0, Math.floor(normY * canvas.height)));
      const pixel = ctx.getImageData(px, py, 1, 1).data;
      r = pixel[0];
      g = pixel[1];
      b = pixel[2];
    } else if (state.activeSource === 'canvas' && fallbackCanvas.width > 0) {
      const ctx = fallbackCanvas.getContext('2d', { willReadFrequently: true });
      const px = Math.min(fallbackCanvas.width - 1, Math.max(0, Math.floor(normX * fallbackCanvas.width)));
      const py = Math.min(fallbackCanvas.height - 1, Math.max(0, Math.floor(normY * fallbackCanvas.height)));
      const pixel = ctx.getImageData(px, py, 1, 1).data;
      r = pixel[0];
      g = pixel[1];
      b = pixel[2];
    }

    const color = findClosestColor(r, g, b);
    updateInspector(color, announce);
  }

  // --- Camera Management ---
  async function startCamera() {
    stopCamera();
    try {
      const constraints = {
        video: {
          facingMode: { ideal: state.facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      state.cameraStream = stream;
      state.activeSource = 'camera';

      video.srcObject = stream;
      video.style.display = 'block';
      fallbackCanvas.style.display = 'none';
      if (cameraStatusOverlay) cameraStatusOverlay.style.display = 'none';

      video.onloadedmetadata = () => {
        video.play();
        showToast('Camera live: ' + (state.facingMode === 'environment' ? 'Rear Lens' : 'Front Lens'));
        // Initial sample center
        setTimeout(() => samplePixelAt(0.5, 0.5, false), 300);
      };
    } catch (err) {
      console.warn('Camera stream could not be started:', err);
      state.activeSource = 'canvas';
      video.style.display = 'none';
      fallbackCanvas.style.display = 'block';
      if (cameraStatusOverlay) {
        cameraStatusOverlay.style.display = 'flex';
      }
      // Load fallback test plate
      drawIshiharaTestPlate();
      showToast('Camera unavailable — loaded Ishihara color test plate', 3500);
    }
  }

  function stopCamera() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(track => track.stop());
      state.cameraStream = null;
    }
  }

  // --- Built-in Ishihara Plate Generator ---
  // Generates a 600x600 authentic Ishihara-style plate with number "74" or "12"
  function drawIshiharaTestPlate() {
    state.activeSource = 'canvas';
    video.style.display = 'none';
    fallbackCanvas.style.display = 'block';

    const canvas = fallbackCanvas;
    canvas.width = 700;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');

    // Soft neutral background
    ctx.fillStyle = '#181b22';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = 350;
    const centerY = 350;
    const radius = 300;

    // Draw circular boundary mask
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#eae7dc';
    ctx.fill();

    // Ishihara background dots (Green/Teal/Olive palette)
    const bgColors = [
      '#7ba05b', '#8fbc8f', '#6b8e23', '#556b2f',
      '#9ab973', '#738678', '#5e7153', '#87a96b'
    ];

    // Number "74" dots (Orange/Red/Salmon palette)
    const numColors = [
      '#d9534f', '#e67e22', '#d35400', '#c0392b',
      '#e74c3c', '#ff7675', '#e17055', '#d63031'
    ];

    // Helper to test if a point is within standard "74" glyphs
    function isInsideNumber(x, y) {
      // Offset relative to center
      const dx = x - centerX;
      const dy = y - centerY;

      // Glyph '7': Left digit around dx in [-150, -20]
      // Top horizontal bar: dx in [-140, -30], dy in [-160, -110]
      if (dx >= -140 && dx <= -30 && dy >= -160 && dy <= -110) return true;
      // Slanted diagonal: y from -110 to 140, x connects (-30, -110) to (-110, 140)
      const t7 = (dy - (-110)) / 250;
      if (t7 >= 0 && t7 <= 1) {
        const expectedX = -30 - t7 * 80;
        if (Math.abs(dx - expectedX) <= 30) return true;
      }

      // Glyph '4': Right digit around dx in [20, 150]
      // Left vertical stem: dx in [30, 70], dy in [-160, 20]
      if (dx >= 30 && dx <= 70 && dy >= -160 && dy <= 20) return true;
      // Horizontal crossbar: dx in [30, 150], dy in [-10, 30]
      if (dx >= 30 && dx <= 150 && dy >= -10 && dy <= 30) return true;
      // Right long vertical stem: dx in [105, 145], dy in [-160, 150]
      if (dx >= 105 && dx <= 145 && dy >= -160 && dy <= 150) return true;

      return false;
    }

    // Seeded random dots distribution
    let seed = 42;
    function pseudoRandom() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }

    for (let i = 0; i < 1400; i++) {
      const ang = pseudoRandom() * Math.PI * 2;
      const dist = Math.sqrt(pseudoRandom()) * (radius - 12);
      const dotX = centerX + Math.cos(ang) * dist;
      const dotY = centerY + Math.sin(ang) * dist;
      const dotRadius = 4 + pseudoRandom() * 9;

      const isNum = isInsideNumber(dotX, dotY);
      const palette = isNum ? numColors : bgColors;
      const color = palette[Math.floor(pseudoRandom() * palette.length)];

      ctx.beginPath();
      ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    ctx.restore();

    // Sample number center point
    setTimeout(() => samplePixelAt(0.35, 0.45, false), 150);
  }

  // --- Filter Application ---
  function applyFilter(filterId) {
    state.currentFilter = filterId;
    const filterVal = filterId === 'normal' ? 'none' : `url(#filter-${filterId})`;

    if (video) video.style.filter = filterVal;
    if (fallbackCanvas) fallbackCanvas.style.filter = filterVal;

    // Update active pill UI
    if (filterCarousel) {
      filterCarousel.querySelectorAll('.filter-pill').forEach(pill => {
        if (pill.dataset.filter === filterId) {
          pill.classList.add('active');
          pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
          pill.classList.remove('active');
        }
      });
    }

    showToast(`Filter: ${filterId.replace(/-/g, ' ').toUpperCase()}`);
    // Refresh inspector reading
    samplePixelAt(state.reticlePos.x, state.reticlePos.y, false);
  }

  // --- Shutter Snapshot Processing ---
  function captureSnapshot() {
    playShutterSound();
    if (navigator.vibrate) navigator.vibrate([40, 20, 60]);

    // Flash animation
    if (cameraFlash) {
      cameraFlash.classList.add('flash-active');
      setTimeout(() => cameraFlash.classList.remove('flash-active'), 250);
    }

    const canvas = hiddenCanvas;
    let sourceWidth = 640;
    let sourceHeight = 480;

    if (state.activeSource === 'camera' && video.videoWidth > 0) {
      sourceWidth = video.videoWidth;
      sourceHeight = video.videoHeight;
    } else if (state.activeSource === 'canvas' && fallbackCanvas.width > 0) {
      sourceWidth = fallbackCanvas.width;
      sourceHeight = fallbackCanvas.height;
    }

    canvas.width = sourceWidth;
    canvas.height = sourceHeight;
    const ctx = canvas.getContext('2d');

    // Apply current filter before baking snapshot into canvas
    ctx.filter = state.currentFilter === 'normal' ? 'none' : `url(#filter-${state.currentFilter})`;

    if (state.activeSource === 'camera') {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(fallbackCanvas, 0, 0, canvas.width, canvas.height);
    }

    // Reset filter on context
    ctx.filter = 'none';

    // Encode to compressed data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    // Save to localStorage
    const snapshotItem = {
      id: 'snap_' + Date.now(),
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dataUrl: dataUrl,
      filterId: state.currentFilter,
      filterLabel: state.currentFilter.replace(/-/g, ' ').toUpperCase(),
      colorSample: state.lastSampledColor || { name: 'Unknown', hex: '#808080' }
    };

    saveSnapshot(snapshotItem);
    showToast('Snapshot saved to History!');
  }

  function getSavedSnapshots() {
    try {
      const data = localStorage.getItem('picta_snapshots');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveSnapshot(item) {
    try {
      const list = getSavedSnapshots();
      list.unshift(item); // prepend
      // Keep up to 25 snapshots to avoid exceeding storage
      if (list.length > 25) list.pop();
      localStorage.setItem('picta_snapshots', JSON.stringify(list));
      updateHistoryBadge();
    } catch (e) {
      console.warn('Could not save snapshot to localStorage:', e);
      showToast('Storage full — check History tab to clear space');
    }
  }

  function updateHistoryBadge() {
    if (!historyCounter) return;
    const count = getSavedSnapshots().length;
    if (count > 0) {
      historyCounter.textContent = count;
      historyCounter.style.display = 'inline-flex';
    } else {
      historyCounter.style.display = 'none';
    }
  }

  // --- Viewport Interaction (Tap / Click to Sample Color) ---
  function handleViewportTap(e) {
    const rect = viewport.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const normX = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const normY = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));

    samplePixelAt(normX, normY, true); // announce with voice on direct tap!
  }

  // --- File Upload Processing ---
  function handleFileUpload(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        stopCamera();
        state.activeSource = 'canvas';
        video.style.display = 'none';
        fallbackCanvas.style.display = 'block';
        if (cameraStatusOverlay) cameraStatusOverlay.style.display = 'none';

        fallbackCanvas.width = img.width;
        fallbackCanvas.height = img.height;
        const ctx = fallbackCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        showToast(`Loaded ${file.name}`);
        samplePixelAt(0.5, 0.5, true);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  // --- Setup Event Listeners ---
  function initEvents() {
    // Shutter button
    if (btnShutter) {
      btnShutter.addEventListener('click', captureSnapshot);
    }

    // Camera flip button
    if (btnCameraFlip) {
      btnCameraFlip.addEventListener('click', () => {
        state.facingMode = state.facingMode === 'environment' ? 'user' : 'environment';
        startCamera();
      });
    }

    // TTS speech toggle
    if (btnTtsToggle) {
      btnTtsToggle.addEventListener('click', () => {
        state.isSpeechEnabled = !state.isSpeechEnabled;
        if (ttsIcon) {
          ttsIcon.textContent = state.isSpeechEnabled ? 'volume_up' : 'volume_off';
        }
        showToast(state.isSpeechEnabled ? 'Voice announcement enabled' : 'Voice muted');
      });
    }

    // Speak color button on card
    if (btnSpeakColor) {
      btnSpeakColor.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.lastSampledColor) {
          speakColor(state.lastSampledColor.name);
        }
      });
    }

    // Sample test plate button
    if (btnSampleImage) {
      btnSampleImage.addEventListener('click', () => {
        stopCamera();
        drawIshiharaTestPlate();
        showToast('Loaded Ishihara Test Plate #74');
      });
    }

    // Retry camera button
    if (btnRetryCamera) {
      btnRetryCamera.addEventListener('click', () => {
        startCamera();
      });
    }

    // File input change
    if (fileUploadInput) {
      fileUploadInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFileUpload(e.target.files[0]);
        }
      });
    }

    // Filter pill buttons
    if (filterCarousel) {
      filterCarousel.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill');
        if (pill && pill.dataset.filter) {
          applyFilter(pill.dataset.filter);
        }
      });
    }

    // Tap on viewport
    if (viewport) {
      viewport.addEventListener('click', handleViewportTap);
      // Support touch drag
      viewport.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length === 1) {
          const rect = viewport.getBoundingClientRect();
          const normX = Math.min(1, Math.max(0, (e.touches[0].clientX - rect.left) / rect.width));
          const normY = Math.min(1, Math.max(0, (e.touches[0].clientY - rect.top) / rect.height));
          samplePixelAt(normX, normY, false);
        }
      }, { passive: true });
    }
  }

  // --- Bootstrap Application ---
  function init() {
    initEvents();
    updateHistoryBadge();
    startCamera();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
