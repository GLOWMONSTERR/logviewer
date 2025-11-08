(function () {
  const canvas = document.getElementById('aurora-canvas');
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.hero-aurora');
  const paletteList = document.getElementById('aurora-colors');
  const shuffleButton = document.getElementById('aurora-shuffle');
  const toggleButton = document.getElementById('aurora-toggle');

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let animationFrame;
  let running = true;
  let palette = generatePalette();
  let blooms = createBlooms(palette);

  function resizeCanvas() {
    if (!hero) {
      return;
    }
    const rect = hero.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }

  function generatePalette() {
    const baseHue = Math.random() * 360;
    const offsets = [0, 40, 65, 120].map(offset => (baseHue + offset + Math.random() * 10) % 360);
    return offsets.map((hue, idx) => {
      const saturation = 70 + Math.random() * 20;
      const lightness = 60 + Math.random() * 10;
      const alpha = idx === 0 ? 0.75 : 0.6 + Math.random() * 0.3;
      return `hsla(${hue.toFixed(0)}, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%, ${alpha.toFixed(2)})`;
    });
  }

  function createBlooms(colors) {
    const { width, height } = canvas;
    return colors.map((color, index) => {
      const radius = (Math.max(width, height) / 2.6) * (1 + Math.random() * 0.4);
      const speed = 0.0004 + Math.random() * 0.0006;
      return {
        color,
        radius,
        angle: Math.random() * Math.PI * 2,
        offset: index / colors.length,
        speed,
      };
    });
  }

  function updateBlooms(delta) {
    blooms.forEach(bloom => {
      bloom.angle += bloom.speed * delta;
    });
  }

  function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(13, 15, 22, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    blooms.forEach(bloom => {
      const cx = canvas.width / 2 + Math.cos(bloom.angle + bloom.offset) * canvas.width * 0.18;
      const cy = canvas.height / 2 + Math.sin(bloom.angle + bloom.offset) * canvas.height * 0.2;
      const gradient = ctx.createRadialGradient(cx, cy, bloom.radius * 0.1, cx, cy, bloom.radius);
      gradient.addColorStop(0, bloom.color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, bloom.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function populatePalette(colors) {
    if (!paletteList) {
      return;
    }
    paletteList.innerHTML = '';
    colors.forEach(color => {
      const li = document.createElement('li');
      li.className = 'palette-chip';

      const swatch = document.createElement('span');
      swatch.className = 'chip-swatch';
      swatch.style.background = color;

      const code = document.createElement('span');
      code.className = 'chip-code';
      code.textContent = toReadableColor(color);

      li.appendChild(swatch);
      li.appendChild(code);
      paletteList.appendChild(li);
    });
  }

  function toReadableColor(color) {
    const match = /hsla\(([^)]+)\)/.exec(color);
    if (!match) {
      return color;
    }
    const [h, s, l] = match[1].split(',').map(part => part.trim());
    return `hsl(${h}, ${s}, ${l})`;
  }

  let lastTimestamp = performance.now();
  function frame(timestamp) {
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    if (running) {
      updateBlooms(delta);
    }
    drawScene();
    animationFrame = requestAnimationFrame(frame);
  }

  function restart() {
    cancelAnimationFrame(animationFrame);
    blooms = createBlooms(palette);
    populatePalette(palette);
    lastTimestamp = performance.now();
    running = true;
    if (toggleButton) {
      toggleButton.textContent = 'Pause Motion';
    }
    animationFrame = requestAnimationFrame(frame);
  }

  function toggleAnimation() {
    running = !running;
    if (running) {
      if (toggleButton) {
        toggleButton.textContent = 'Pause Motion';
      }
      lastTimestamp = performance.now();
    } else {
      if (toggleButton) {
        toggleButton.textContent = 'Resume Motion';
      }
    }
  }

  function shuffle() {
    palette = generatePalette();
    restart();
  }

  resizeCanvas();
  populatePalette(palette);
  if (toggleButton) {
    toggleButton.textContent = 'Pause Motion';
  }
  animationFrame = requestAnimationFrame(frame);

  window.addEventListener('resize', () => {
    resizeCanvas();
    blooms = createBlooms(palette);
  });

  if (shuffleButton) {
    shuffleButton.addEventListener('click', event => {
      event.preventDefault();
      shuffle();
    });
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', event => {
      event.preventDefault();
      toggleAnimation();
    });
  }
})();
