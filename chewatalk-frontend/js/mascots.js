// ChewaTalk mascots: Nkwazi the eagle and Goggles the aviator dog.
// Hand-built SVG with ink outlines and flat fills to match the poster style.
// Moods are set by data-mood on the .mascot wrapper: idle | happy | sad | cheer | think.

const INK = '#1c1c19';
const S = `stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;

// Fish-eagle palette: rust body, orange highlights, white head + tail, warm brown outline.
const BR = '#3a2320';
const E = `stroke="${BR}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;
const RUST = '#c9452c', RUST_D = '#a8321f', GLOW = '#f0892a', WHITE = '#fbfaf6', WSH = '#cfd8ea', BEAK = '#ffc23a';

// Raised wing (reference pose). Drawn for the left side, mirrored for the right.
const wing = `
  <g class="wing-flap">
    <path ${E} fill="${RUST}" d="M86 108 C76 82 60 54 36 26 C30 20 22 24 24 32 L32 50 L14 46 L26 64 L8 66 L26 80 L12 88 L36 96 L28 104 C50 108 70 112 86 108Z"/>
    <path fill="${RUST_D}" d="M80 104 C62 104 46 100 30 96 L36 96 L28 104 C50 108 70 112 86 108Z" opacity=".55"/>
    <path fill="${GLOW}" opacity=".85" d="M80 98 C70 76 56 54 38 32 C52 42 66 60 76 78 C80 86 82 92 80 98Z"/>
    <path fill="none" stroke="${GLOW}" stroke-width="2.6" stroke-linecap="round" d="M52 60 q4 6 8 0 M46 76 q4 6 8 0 q4 6 8 0"/>
  </g>`;

export function eagleSVG({ logo = false } = {}) {
  const vb = logo ? '67 15 86 86' : '0 0 220 214';
  return `<svg class="eagle" viewBox="${vb}" role="img" aria-label="Nkwazi the eagle">
  <g class="m-body">
    ${logo ? '' : `<g class="wing wing-l">${wing}</g><g class="wing wing-r" transform="translate(220 0) scale(-1 1)">${wing}</g>
    <path ${E} fill="${WHITE}" d="M98 158 L84 200 L100 190 L110 206 L120 190 L136 200 L122 158Z"/>
    <path fill="none" stroke="${WSH}" stroke-width="3" stroke-linecap="round" d="M100 176 L94 192 M110 178 L110 196 M120 176 L126 192"/>
    <path ${E} fill="${RUST}" d="M110 86 C138 86 150 110 148 136 C146 160 130 174 110 174 C90 174 74 160 72 136 C70 110 82 86 110 86Z"/>
    <path fill="${GLOW}" opacity=".55" d="M84 120 C86 104 96 94 108 92 C96 102 90 116 90 134 C90 148 96 160 104 168 C88 162 82 140 84 120Z"/>
    <path fill="none" stroke="${RUST_D}" stroke-width="2.6" stroke-linecap="round" d="M98 130 q4 6 8 0 q4 6 8 0 M104 146 q4 6 8 0 q4 6 8 0 M96 156 q4 5 8 0"/>
    <g class="legs">
      <path ${E} fill="${GLOW}" d="M94 164 L104 164 L104 184 L94 184Z"/><path ${E} fill="${GLOW}" d="M116 164 L126 164 L126 184 L116 184Z"/>
      <g class="fish"><path ${E} fill="#3aa0d8" d="M78 192 C88 182 120 182 132 192 C120 202 88 202 78 192Z"/><path ${E} fill="#3aa0d8" d="M132 192 L146 182 L144 192 L146 202Z"/><circle cx="88" cy="190" r="2.6" fill="${BR}"/><path fill="none" stroke="#9fd8f2" stroke-width="2.4" stroke-linecap="round" d="M96 188 Q108 184 120 188"/></g>
      <path ${E} fill="${BEAK}" d="M90 182 C92 178 106 178 108 182 L108 192 C104 196 94 196 90 192Z"/><path ${E} fill="${BEAK}" d="M112 182 C114 178 128 178 130 182 L130 192 C126 196 116 196 112 192Z"/>
      <path fill="none" ${E} d="M94 192 l-2 5 M100 194 l0 5 M106 192 l2 5 M116 192 l-2 5 M122 194 l0 5 M128 192 l2 5"/>
    </g>`}
    <g class="head">
      <path ${E} fill="${WHITE}" d="M110 22 C134 22 148 40 146 62 C146 72 142 80 138 86 L146 98 L132 95 L128 108 L118 97 L110 110 L102 97 L92 108 L88 95 L74 98 L82 86 C78 80 74 72 74 62 C72 40 86 22 110 22Z"/>
      <path fill="none" stroke="${WSH}" stroke-width="3" stroke-linecap="round" d="M88 88 q4 5 8 0 M114 90 q4 5 8 0 M100 92 q5 5 10 0 M80 72 q-2 6 2 10 M140 72 q2 6 -2 10"/>
      <ellipse cx="86" cy="74" rx="6" ry="4" fill="#ff9aa8" opacity=".75"/><ellipse cx="134" cy="74" rx="6" ry="4" fill="#ff9aa8" opacity=".75"/>
      <g class="eyes-open">
        <circle cx="96" cy="56" r="10" fill="#fff" stroke="${BR}" stroke-width="3"/><circle cx="124" cy="56" r="10" fill="#fff" stroke="${BR}" stroke-width="3"/>
        <g class="pupil"><circle cx="97" cy="57" r="6.5" fill="#6b5fa8"/><circle cx="97" cy="57" r="3.4" fill="${BR}"/><circle cx="99" cy="54.5" r="1.8" fill="#fff"/></g>
        <g class="pupil"><circle cx="123" cy="57" r="6.5" fill="#6b5fa8"/><circle cx="123" cy="57" r="3.4" fill="${BR}"/><circle cx="125" cy="54.5" r="1.8" fill="#fff"/></g>
      </g>
      <g class="eyes-happy" fill="none" stroke="${BR}" stroke-width="4" stroke-linecap="round"><path d="M87 59 Q96 48 105 59"/><path d="M115 59 Q124 48 133 59"/></g>
      <path class="brow brow-l" fill="none" stroke="${BR}" stroke-width="4.5" stroke-linecap="round" d="M84 42 L105 46"/>
      <path class="brow brow-r" fill="none" stroke="${BR}" stroke-width="4.5" stroke-linecap="round" d="M136 42 L115 46"/>
      <path class="beak" ${E} fill="${BEAK}" d="M94 70 C98 60 124 59 128 69 C132 79 128 92 118 100 C117 92 113 87 106 86 C99 85 94 79 94 70Z"/>
      <path class="beak-tip" fill="${GLOW}" d="M118 100 C125 93 128 86 128 78 C122 83 116 86 108 86 C113 89 117 93 118 100Z"/>
      <path class="smile" fill="none" stroke="${BR}" stroke-width="2.5" stroke-linecap="round" d="M99 74 Q110 80 124 72"/>
    </g>
  </g></svg>`;
}

export function dogSVG() {
  // Sheepskin fleece: a jittered grid of small curls clipped to the cap dome.
  let fleece = '';
  for (let y = 28, row = 0; y <= 60; y += 6, row++) for (let x = 60 + (row % 2) * 4; x <= 140; x += 8) {
    const dx = (x - 100) / 42, dy = (y - 62) / 40;
    if (dx * dx + dy * dy < .92 && y < 62 - Math.abs(x - 100) * .08) fleece += `<circle cx="${x + ((x * 7 + y) % 3) - 1}" cy="${y}" r="3.4" fill="${(x + y) % 3 ? '#d9954a' : '#e6a95e'}"/>`;
  }
  return `<svg class="dog" viewBox="0 0 200 214" role="img" aria-label="Goggles the dog">
  <g class="m-body">
    <g class="tail"><path ${S} fill="#3b2b22" d="M150 196 C164 186 172 172 168 156 C178 160 182 180 168 198Z"/></g>
    <path ${S} fill="#3b2b22" d="M38 214 C38 176 60 156 100 156 C140 156 162 176 162 214Z"/>
    <path fill="#c98a4b" stroke="${INK}" stroke-width="3" d="M70 214 C72 186 84 170 100 170 C116 170 128 186 130 214Z"/>
    <path ${S} fill="#ed442b" d="M66 152 Q100 166 134 152 L136 162 Q100 178 64 162Z"/>
    <circle cx="100" cy="174" r="6" fill="#c9ccd2" stroke="${INK}" stroke-width="2.5"/>
    <g class="head">
      <g class="ear ear-l"><path ${S} fill="#a8682f" d="M58 74 C36 74 28 100 42 114 C54 114 60 98 62 86Z"/></g>
      <g class="ear ear-r"><path ${S} fill="#a8682f" d="M142 74 C164 74 172 100 158 114 C146 114 140 98 138 86Z"/></g>
      <path ${S} fill="#c98a4b" d="M60 72 C60 50 80 40 100 40 C120 40 140 50 140 72 L138 118 C136 140 120 152 100 152 C80 152 64 140 62 118Z"/>
      <g class="eyes-open">
        <circle cx="80" cy="82" r="9" fill="#fff"/><circle cx="120" cy="82" r="9" fill="#fff"/>
        <circle class="pupil" cx="82" cy="83" r="5" fill="${INK}"/><circle class="pupil" cx="118" cy="83" r="5" fill="${INK}"/>
      </g>
      <g class="eyes-happy" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"><path d="M72 85 Q80 76 88 85"/><path d="M112 85 Q120 76 128 85"/></g>
      <path ${S} fill="#2a2522" d="M50 76 L60 74 L60 88 L50 90Z"/><path ${S} fill="#2a2522" d="M150 76 L140 74 L140 88 L150 90Z"/>
      <g class="goggles">
        <ellipse cx="80" cy="82" rx="19" ry="16" fill="#bfe3f2" fill-opacity=".45" stroke="#c9ccd2" stroke-width="6"/>
        <ellipse cx="80" cy="82" rx="19" ry="16" fill="none" stroke="${INK}" stroke-width="2.5"/><ellipse cx="80" cy="82" rx="22.5" ry="19.5" fill="none" stroke="${INK}" stroke-width="2.5"/>
        <ellipse cx="120" cy="82" rx="19" ry="16" fill="#bfe3f2" fill-opacity=".45" stroke="#c9ccd2" stroke-width="6"/>
        <ellipse cx="120" cy="82" rx="19" ry="16" fill="none" stroke="${INK}" stroke-width="2.5"/><ellipse cx="120" cy="82" rx="22.5" ry="19.5" fill="none" stroke="${INK}" stroke-width="2.5"/>
        <path fill="#c9ccd2" stroke="${INK}" stroke-width="2.5" d="M97 80 Q100 76 103 80 L103 86 Q100 83 97 86Z"/>
        <path fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9" d="M70 76 L76 70 M110 76 L116 70"/>
      </g>
      <path ${S} fill="#b8752f" d="M56 70 C54 38 78 22 100 22 C122 22 146 38 144 70 C130 61 116 58 100 58 C84 58 70 61 56 70Z"/>
      ${fleece}
      <path ${S} fill="#7a4a22" d="M57 66 C52 78 50 94 54 106 C58 112 66 110 67 102 L66 72Z"/>
      <path ${S} fill="#7a4a22" d="M143 66 C148 78 150 94 146 106 C142 112 134 110 133 102 L134 72Z"/>
      <circle cx="60" cy="100" r="3" fill="#c9ccd2" stroke="${INK}" stroke-width="2"/><circle cx="140" cy="100" r="3" fill="#c9ccd2" stroke="${INK}" stroke-width="2"/>
      <path fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" d="M56 70 C70 61 84 58 100 58 C116 58 130 61 144 70"/><path fill="none" stroke="#7a4a22" stroke-width="2.5" stroke-linecap="round" d="M57 69 C70 60 84 57 100 57 C116 57 130 60 143 69"/>
      <path ${S} fill="#e0a865" d="M72 114 C72 100 86 96 100 96 C114 96 128 100 128 114 C128 128 124 138 118 142 L114 136 L110 144 L104 137 L100 147 L96 137 L90 144 L86 136 L82 142 C76 138 72 128 72 114Z"/>
      <g class="tongue"><path ${S} fill="#ff7d93" d="M94 126 C94 140 106 140 106 126Z"/><path stroke="#d94f6a" stroke-width="2" d="M100 128 L100 135"/></g>
      <path class="smile" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" d="M90 122 Q100 130 110 122"/>
      <ellipse cx="100" cy="106" rx="13" ry="9" fill="${INK}"/><ellipse cx="96" cy="103" rx="4" ry="2.2" fill="#fff" opacity=".7"/>
    </g>
  </g></svg>`;
}

export const MASCOTS = {
  eagle: { name: 'Nkwazi', svg: eagleSVG },
  dog: { name: 'Goggles', svg: dogSVG },
};

export function mascotHTML(kind, { say = '', cls = '', logo = false, mood = 'idle' } = {}) {
  const m = MASCOTS[kind];
  const inner = logo ? `<span class="mascot-btn" aria-hidden="true">${m.svg({ logo })}</span>`
    : `<button class="mascot-btn" type="button" aria-label="Poke ${m.name}">${m.svg()}</button>`;
  return `<${logo ? 'span' : 'div'} class="mascot mascot-${kind} ${cls}" data-mood="${mood}">
    ${logo ? '' : `<div class="say" aria-live="polite" ${say ? '' : 'hidden'}>${say}</div>`}${inner}
  </${logo ? 'span' : 'div'}>`;
}

const timers = new WeakMap();
export function react(el, mood, text, ms = 1800) {
  if (!el) return;
  const say = el.querySelector('.say');
  el.dataset.mood = mood;
  if (text != null && say) { say.hidden = false; say.innerHTML = text; say.classList.remove('pop'); void say.offsetWidth; say.classList.add('pop'); }
  clearTimeout(timers.get(el));
  if (ms) timers.set(el, setTimeout(() => { el.dataset.mood = 'idle'; }, ms));
}

// Pupils follow the pointer a little.
export function lookAt(root = document) {
  const move = e => root.querySelectorAll('.mascot svg').forEach(svg => {
    const r = svg.getBoundingClientRect();
    const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 400));
    const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 400));
    svg.querySelectorAll('.pupil').forEach(p => { p.style.transform = `translate(${dx * 2.5}px, ${dy * 2.5}px)`; });
  });
  addEventListener('pointermove', move, { passive: true });
  return () => removeEventListener('pointermove', move);
}
