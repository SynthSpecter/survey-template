/*
 * FR : L'empreinte transforme chaque réponse en un signal visuel stable, sans prétendre noter l'utilisateur.
 * EN: The fingerprint turns each response into a stable visual signal without claiming to score the user.
 */

export function hashAnswer(answer) {
  const normalized = Array.isArray(answer)
    ? JSON.stringify([...answer].sort())
    : JSON.stringify(answer ?? null);
  let hash = 2166136261;

  for (let index = 0; index < normalized.length; index += 1) {
    hash ^= normalized.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function createFingerprintValues(questions, answers) {
  return questions.map((question) => {
    const hash = hashAnswer(answers[question.id]);
    return 0.32 + (hash % 64) / 100;
  });
}

export class SignalChart {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.values = [];
    this.resizeObserver = new ResizeObserver(() => this.render());
    this.resizeObserver.observe(canvas.parentElement);
  }

  update(questions, answers) {
    this.values = createFingerprintValues(questions, answers);
    this.render();
  }

  render() {
    const bounds = this.canvas.getBoundingClientRect();

    if (bounds.width < 1 || bounds.height < 1 || this.values.length === 0) {
      return;
    }

    const width = Math.round(bounds.width);
    const height = Math.round(bounds.height);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const context = this.context;
    const colors = readColors();
    const plot = { left: 30, right: width - 20, top: 24, bottom: height - 34 };
    const baseline = plot.bottom;
    const slotWidth = (plot.right - plot.left) / this.values.length;

    this.canvas.width = Math.round(width * pixelRatio);
    this.canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    // FR : Les repères horizontaux donnent une structure calme au signal synthwave.
    // EN: Horizontal guides give the synthwave signal a calm structure.
    context.save();
    context.strokeStyle = colors.border;
    context.lineWidth = 1;

    for (let line = 0; line < 4; line += 1) {
      const y = plot.top + ((plot.bottom - plot.top) * line) / 3;
      context.beginPath();
      context.moveTo(plot.left, Math.round(y) + 0.5);
      context.lineTo(plot.right, Math.round(y) + 0.5);
      context.stroke();
    }

    const points = this.values.map((value, index) => ({
      x: plot.left + slotWidth * index + slotWidth / 2,
      y: baseline - value * (baseline - plot.top)
    }));

    points.forEach((point, index) => {
      const color = colors.palette[index % colors.palette.length];
      const barWidth = Math.min(34, slotWidth * 0.42);
      context.fillStyle = color;
      context.globalAlpha = 0.28;
      context.fillRect(point.x - barWidth / 2, point.y, barWidth, baseline - point.y);
      context.globalAlpha = 1;
    });

    context.strokeStyle = colors.cyan;
    context.lineWidth = 3;
    context.lineJoin = 'round';
    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.stroke();

    points.forEach((point, index) => {
      context.fillStyle = colors.surface;
      context.strokeStyle = colors.palette[index % colors.palette.length];
      context.lineWidth = 3;
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = colors.muted;
      context.font = '11px system-ui, sans-serif';
      context.textAlign = 'center';
      context.fillText(String(index + 1).padStart(2, '0'), point.x, height - 12);
    });
    context.restore();
  }

  destroy() {
    this.resizeObserver.disconnect();
  }
}

function readColors() {
  const styles = getComputedStyle(document.documentElement);
  const read = (name) => styles.getPropertyValue(name).trim();

  return {
    surface: read('--color-surface'),
    border: read('--color-border'),
    muted: read('--color-text-muted'),
    cyan: read('--color-cyan'),
    palette: [
      read('--color-cyan'),
      read('--color-pink'),
      read('--color-amber'),
      read('--color-green'),
      read('--color-violet'),
      read('--color-red')
    ]
  };
}
