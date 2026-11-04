// Pets: every so often Goggles gallops along the bottom of the screen and Nkwazi
// flies across with a fish. Click one as it passes to get a "Zikomo!".
// Off when the user prefers reduced motion; can be toggled from the HUD.
import { burst, blip, reduceMotion } from './fx.js';

const BR = '#3a2320', INK = '#1c1c19';
const E = `stroke="${BR}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"`;
const D = `stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"`;

// Side view, facing right. Legs are separate groups so they can gallop.
const leg = (x, y, fill, cls) => `<g transform="translate(${x} ${y})"><g class="leg ${cls}"><path ${D} fill="${fill}" d="M-6 0 L6 0 L6 26 Q14 26 13 33 L-3 33 Q-7 33 -6 27Z"/></g></g>`;

export function dogRunnerSVG() {
  let fleece = '';
  for (let x = 146; x <= 172; x += 6) for (let y = 8; y <= 20; y += 6) if ((x - 159) ** 2 / 200 + (y - 22) ** 2 / 210 < 1) fleece += `<circle cx="${x}" cy="${y}" r="2.8" fill="#d9954a"/>`;
  return `<svg class="runner dog-runner" viewBox="0 0 210 124" aria-hidden="true">
  <g class="gallop">
    <g class="tail"><path ${D} fill="#3b2b22" d="M54 52 C42 42 38 28 46 18 C52 28 56 38 62 46Z"/></g>
    ${leg(66, 74, '#a8682f', 'bl')}${leg(128, 74, '#a8682f', 'fl')}
    <path ${D} fill="#c98a4b" d="M50 60 C50 44 72 40 100 40 C124 40 140 46 144 60 C146 76 128 84 100 84 C70 84 50 78 50 60Z"/>
    <path fill="#3b2b22" d="M53 56 C56 45 74 42 100 42 C118 42 130 45 136 52 C118 57 88 60 53 60Z"/>
    ${leg(78, 76, '#c98a4b', 'br')}${leg(138, 76, '#c98a4b', 'fr')}
    <path ${D} fill="#ed442b" d="M134 46 C140 52 146 58 150 64 L142 68 C138 62 132 56 128 50Z"/>
    <g class="scarf"><path ${D} fill="#ed442b" d="M134 50 C120 36 100 24 78 26 C88 32 96 36 98 42 C90 42 84 46 80 50 C98 48 116 52 132 58Z"/><path fill="none" stroke="#ffb3a6" stroke-width="2.5" stroke-linecap="round" d="M120 44 C108 36 98 32 90 31"/></g>
    <path ${D} fill="#c98a4b" d="M140 30 C140 16 154 8 166 10 C176 12 180 22 180 30 L198 34 C204 36 204 48 196 50 L176 56 C162 62 148 58 142 48Z"/>
    <path ${D} fill="#e0a865" d="M172 48 L198 50 L194 60 L190 55 L186 62 L182 55 L176 60Z"/>
    <path ${D} fill="#ff7d93" d="M184 56 C184 66 194 66 192 56Z"/>
    <ellipse cx="199" cy="40" rx="6" ry="5" fill="${INK}"/>
    <g class="flap"><path ${D} fill="#7a4a22" d="M146 30 C140 42 142 54 150 56 C156 48 154 38 152 30Z"/></g>
    <path ${D} fill="#b8752f" d="M142 28 C142 12 154 4 166 6 C176 8 182 16 180 26 C168 22 154 24 142 28Z"/>${fleece}
    <path ${D} fill="#2a2522" d="M146 26 L156 25 L156 33 L146 34Z"/>
    <circle cx="165" cy="29" r="9" fill="#bfe3f2" fill-opacity=".5" stroke="#c9ccd2" stroke-width="5"/><circle cx="165" cy="29" r="11.5" fill="none" stroke="${INK}" stroke-width="2.5"/>
    <circle cx="166" cy="30" r="3.6" fill="${INK}"/><path stroke="#fff" stroke-width="2.5" stroke-linecap="round" d="M159 25 l4 -4"/>
  </g></svg>`;
}

export function eagleFlyerSVG() {
  const wing = (cls, fill) => `<g class="fly-wing ${cls}"><path ${E} fill="${fill}" d="M104 64 C94 42 78 20 56 6 L62 20 L46 16 L58 30 L42 32 L58 42 L46 50 C66 58 86 64 104 64Z"/><path fill="#f0892a" opacity=".8" d="M98 58 C88 40 76 24 60 12 C74 22 88 38 96 52Z"/></g>`;
  return `<svg class="runner eagle-flyer" viewBox="0 0 220 130" aria-hidden="true">
  <g class="glide">
    <g transform="translate(22 -6) rotate(-6 104 64)">${wing('far', '#a8321f')}</g>
    <path ${E} fill="#fbfaf6" d="M72 66 L30 54 L38 68 L26 78 L72 80Z"/>
    <path ${E} fill="#c9452c" d="M70 72 C70 58 92 54 118 56 C138 58 150 64 150 72 C150 82 134 88 112 88 C88 88 70 84 70 72Z"/>
    <g class="fish"><path ${E} fill="#3aa0d8" d="M96 100 C104 92 128 92 136 100 C128 108 104 108 96 100Z"/><path ${E} fill="#3aa0d8" d="M96 100 L84 92 L86 100 L84 108Z"/><circle cx="128" cy="99" r="2.2" fill="${BR}"/></g>
    <path ${E} fill="#ffc23a" d="M104 86 L108 98 M118 86 L120 98"/><path ${E} fill="#ffc23a" d="M102 96 C104 92 112 92 112 96 L112 102 C108 104 104 104 102 102Z"/><path ${E} fill="#ffc23a" d="M116 96 C118 92 126 92 126 96 L126 102 C122 104 118 104 116 102Z"/>
    <path ${E} fill="#fbfaf6" d="M140 62 C140 46 152 38 164 40 C176 42 182 52 180 62 C178 70 172 74 166 76 L170 84 L160 80 L156 88 L150 78 L142 82 L144 72 C141 69 140 66 140 62Z"/>
    <path ${E} fill="#ffc23a" d="M172 49 C182 43 196 45 201 53 C203 57 200 62 195 62 C195 58 191 56 185 57 L176 60 C174 57 172 53 172 49Z"/><path fill="#f0892a" d="M201 53 C203 57 200 62 195 62 C195 59 193 57 190 56 C195 55 199 54 201 53Z"/>
    <circle cx="164" cy="52" r="6" fill="#fff" stroke="${BR}" stroke-width="2.5"/><circle cx="166" cy="52.5" r="3.6" fill="#6b5fa8"/><circle cx="166" cy="52.5" r="1.8" fill="${BR}"/>
    <path stroke="${BR}" stroke-width="3.5" stroke-linecap="round" d="M156 44 L170 46"/>
    ${wing('near', '#c9452c')}
  </g></svg>`;
}

/* ── Runner layer ─────────────────────────── */
let layer, enabled = true, timer = 0, running = 0;
const LINES = [['Zikomo!', 'Thank you'], ['Bwanji?', 'Hello'], ['Bwino bwino!', 'Nicely!']];

export function initPets({ on = true } = {}) {
  enabled = on && !reduceMotion;
  layer = document.createElement('div');
  layer.className = 'pet-layer'; layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  schedule(6000 + Math.random() * 4000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(8000); });
}
export function setPets(on) { enabled = on && !reduceMotion; if (enabled) schedule(1500); else clearTimeout(timer); }

const small = () => innerWidth < 760;
function schedule(ms = (small() ? 45000 : 30000) + Math.random() * 40000) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (enabled && !document.hidden && !running) runPet(Math.random() < .55 ? 'dog' : 'eagle');
    schedule();
  }, ms);
}

export function petParade() {
  if (!enabled) return;
  runPet('dog'); setTimeout(() => runPet('eagle'), 900);
}

export function runPet(kind) {
  if (!layer || reduceMotion) return;
  const ltr = Math.random() < .6;
  const el = document.createElement('button');
  el.type = 'button'; el.tabIndex = -1;
  el.className = `pet pet-${kind}${ltr ? '' : ' rtl'}`;
  el.innerHTML = `<span class="pet-say" hidden></span>${kind === 'dog' ? dogRunnerSVG() : eagleFlyerSVG()}`;
  layer.append(el);
  running++;
  const w = el.offsetWidth, from = ltr ? -w - 20 : innerWidth + 20, to = ltr ? innerWidth + 20 : -w - 20;
  const dur = kind === 'dog' ? 5200 + Math.random() * 1600 : 7500 + Math.random() * 2500;
  let frames;
  if (kind === 'dog') frames = [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }];
  else {
    const top = 70 + Math.random() * Math.max(80, innerHeight * .35);
    el.style.top = top + 'px';
    frames = [0, .25, .5, .75, 1].map((t, i) => ({ transform: `translate(${from + (to - from) * t}px, ${[0, -26, 6, -18, -40][i]}px) rotate(${[2, -4, 3, -3, -6][i] * (ltr ? 1 : -1)}deg)` }));
  }
  const anim = el.animate(frames, { duration: dur, easing: 'linear', fill: 'forwards' });
  anim.finished.then(() => { el.remove(); running--; }).catch(() => { el.remove(); running--; });

  el.addEventListener('click', () => {
    if (el.classList.contains('petted')) return;
    el.classList.add('petted');
    const [ny, en] = LINES[Math.random() * LINES.length | 0];
    const say = el.querySelector('.pet-say');
    say.innerHTML = `${ny}<small>${en}</small>`; say.hidden = false;
    const r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 3, 28);
    blip('good');
    anim.playbackRate = .35;
    setTimeout(() => { anim.playbackRate = 1.6; el.classList.remove('petted'); say.hidden = true; }, 1300);
  });
}
