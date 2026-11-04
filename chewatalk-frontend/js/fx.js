// Visual + audio effects: confetti, XP floaters, toast, custom cursor, tilt, reveal-on-scroll, sound blips.
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Confetti ─────────────────────────────── */
const canvas = document.getElementById('fx');
const ctx = canvas.getContext('2d');
const COLORS = ['#ed442b', '#203ddd', '#c6ef3b', '#ff5fa2', '#ffb347', '#1c1c19', '#f2eddf'];
let parts = [], raf = 0;

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', resize); resize();

function tick() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 40);
  for (const p of parts) {
    p.vy += 0.32; p.vx *= 0.985; p.vy *= 0.985;
    p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.globalAlpha = Math.min(1, p.life / 30);
    ctx.fillStyle = p.c;
    if (p.shape === 0) ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
    else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.s / 3, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(0, -p.s / 2); ctx.lineTo(p.s / 2, p.s / 2); ctx.lineTo(-p.s / 2, p.s / 2); ctx.fill(); }
    ctx.restore();
  }
  raf = parts.length ? requestAnimationFrame(tick) : 0;
}

export function burst(x, y, n = 40, spread = 1) {
  if (reduceMotion) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, sp = (3 + Math.random() * 8) * spread;
    parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6, rot: Math.random() * 6, vr: (Math.random() - .5) * .4,
      s: 7 + Math.random() * 9, c: COLORS[i % COLORS.length], shape: i % 3, life: 90 + Math.random() * 50 });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}
export function rain(n = 140) {
  if (reduceMotion) return;
  for (let i = 0; i < n; i++) {
    parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .5, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4,
      rot: Math.random() * 6, vr: (Math.random() - .5) * .3, s: 8 + Math.random() * 10, c: COLORS[i % COLORS.length], shape: i % 3, life: 260 });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}
export function burstFrom(el, n) {
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, n);
}

/* ── XP floater + toast ───────────────────── */
export function floatText(el, text) {
  const r = el.getBoundingClientRect();
  const f = document.createElement('div');
  f.className = 'xp-float'; f.textContent = text;
  f.style.left = r.left + r.width / 2 + 'px'; f.style.top = r.top + 'px';
  document.body.append(f);
  setTimeout(() => f.remove(), 1200);
}
let toastTimer;
export function toast(msg) {
  const t = document.querySelector('.toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ── Sound (WebAudio blips, off by default) ─ */
let actx = null;
export const sound = { on: false };
export function blip(kind) {
  if (!sound.on) return;
  try {
    actx ||= new (window.AudioContext || window.webkitAudioContext)();
    const notes = { good: [660, 990], bad: [220, 160], flip: [520], win: [523, 659, 784, 1046], tap: [880] }[kind] || [440];
    notes.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * 0.08;
      o.type = kind === 'bad' ? 'sawtooth' : 'triangle'; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 0.2);
    });
  } catch { /* audio unavailable */ }
}

/* ── Custom cursor (fine pointers only) ───── */
export function initCursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || reduceMotion) return;
  const dot = document.querySelector('.cursor-dot'), ring = document.querySelector('.cursor-ring');
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  document.documentElement.classList.add('has-cursor');
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    document.body.classList.add('cursor-on');
    dot.style.transform = `translate(${x}px,${y}px)`;
    ring.classList.toggle('hover', !!e.target.closest('a,button,[role=button],input,summary'));
  });
  addEventListener('pointerdown', () => ring.classList.add('press'));
  addEventListener('pointerup', () => ring.classList.remove('press'));
  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on'));
  (function loop() { rx += (x - rx) * .2; ry += (y - ry) * .2; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
}

/* ── Pointer tilt for poster cards ────────── */
export function tilt(el, target = el, max = 8) {
  if (reduceMotion || !matchMedia('(hover: hover)').matches) return;
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    target.style.setProperty('--ry', `${px * max}deg`); target.style.setProperty('--rx', `${-py * max}deg`);
  });
  el.addEventListener('pointerleave', () => { target.style.setProperty('--ry', '0deg'); target.style.setProperty('--rx', '0deg'); });
}

/* ── Reveal on scroll ─────────────────────── */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .12 }) : null;
export function reveal(root) {
  root.querySelectorAll('.reveal,.cat-row').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 8) * 60}ms`;
    io ? io.observe(el) : el.classList.add('in');
  });
}
