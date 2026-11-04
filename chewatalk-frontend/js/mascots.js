// ChewaTalk mascots: Nkwazi the eagle and Goggles the aviator dog.
// Hand-built SVG with ink outlines and flat fills to match the poster style.
// Moods are set by data-mood on the .mascot wrapper: idle | happy | sad | cheer | think.

const INK = '#1c1c19';
const S = `stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;

// Fish-eagle palette: rust body, orange highlights, white head + tail, warm brown outline.
const BR = '#3a2320';
const E = `stroke="${BR}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;
const RUST = '#c9452c', RUST_D = '#a8321f', GLOW = '#f0892a', WHITE = '#fbfaf6', WSH = '#cfd8ea', BEAK = '#ffc23a';

// Three-quarter side view: head turned up-left, wings raised behind, white tail fanned out,
// orange legs gripping a fish. Soft rounded shapes with a warm brown outline.
const RED2 = '#b5302a', BELLY = '#d9583a';

export function eagleSVG({ logo = false } = {}) {
  const vb = logo ? '20 28 88 88' : '0 0 232 215';
  return `<svg class="eagle" viewBox="${vb}" role="img" aria-label="Nkwazi the eagle">
  <g class="m-body">
    ${logo ? '' : `
    <g class="wing wing-far"><g class="wing-flap">
      <path ${E} fill="${RED2}" d="M104 78 C98 60 86 42 68 32 C62 29 58 33 61 38 C66 46 70 55 72 63 C77 72 86 78 96 82Z"/>
      <path fill="${GLOW}" opacity=".85" d="M66 33 C80 40 92 54 98 68 C90 56 80 46 64 38 C62 36 63 34 66 33Z"/>
      <path fill="none" stroke="${GLOW}" stroke-width="2.4" stroke-linecap="round" d="M80 56 q3 4 6 0"/>
    </g></g>
    <g class="wing wing-near"><g class="wing-flap">
      <path ${E} fill="${RUST}" d="M100 80 C97 60 99 40 104 28 C106 22 113 19 121 21 C150 29 181 58 207 85 C214 92 225 95 222 102 C220 106 213 105 207 104 C213 110 215 116 209 120 C203 123 197 119 193 117 C197 125 195 133 189 133 C181 133 171 121 161 112 C151 105 139 104 128 107 C116 104 106 94 100 80Z"/>
      <path fill="${RED2}" d="M128 107 C139 104 151 105 161 112 C171 121 181 133 189 133 C178 124 168 108 156 98 C146 90 134 92 124 96Z" opacity=".9"/>
      <path fill="${GLOW}" opacity=".9" d="M105 30 C110 23 120 22 128 26 C152 38 178 62 203 86 C180 70 152 46 127 35 C119 31 111 31 105 34Z"/>
      <path fill="none" stroke="${BR}" stroke-width="2.6" stroke-linecap="round" d="M117 32 C116 54 124 74 142 92 M176 84 L200 102 M166 94 L192 116 M156 102 L180 128"/>
      <path fill="none" stroke="${GLOW}" stroke-width="2.6" stroke-linecap="round" d="M132 52 q3 5 6 0 M146 70 q3 5 6 0 q3 5 6 0 M126 76 q3 4 6 0"/>
    </g></g>
    <path ${E} fill="${WHITE}" d="M124 126 C145 134 165 141 182 149 C187 151 186 157 181 158 C186 161 185 168 178 168 C160 166 140 158 124 148Z"/>
    <path fill="none" stroke="${WSH}" stroke-width="3" stroke-linecap="round" d="M132 140 C148 148 164 154 178 159 M134 132 C150 138 164 144 176 150"/>
    <path ${E} fill="${RUST}" d="M66 98 C60 118 68 140 86 150 C99 157 115 155 125 146 C133 138 135 124 131 110 C127 96 116 86 104 82 C90 80 72 86 66 98Z"/>
    <path fill="${BELLY}" d="M72 104 C68 120 74 138 88 146 C80 134 78 118 82 104Z" opacity=".9"/>
    <path fill="none" stroke="${RED2}" stroke-width="2.6" stroke-linecap="round" d="M84 134 l3 5 l3 -5 l3 5 M100 142 q3 5 6 0 M112 120 q3 5 6 0"/>
    <g class="legs">
      <path ${E} fill="${GLOW}" d="M93 146 L104 146 L106 168 L95 170Z"/><path ${E} fill="${GLOW}" d="M105 144 L116 144 L118 166 L108 168Z"/><path ${E} fill="${RUST}" d="M89 132 C86 142 90 151 97 150 C100 155 107 155 110 151 C115 153 121 148 120 139 L117 130 Z"/><path fill="none" stroke="${RED2}" stroke-width="2.2" stroke-linecap="round" d="M94 146 l2 4 M104 147 l1 4 M113 146 l1 4"/>
      <path fill="none" stroke="#c96a12" stroke-width="2" stroke-linecap="round" d="M96 156 h6 M97 162 h6 M108 154 h6 M109 160 h6"/>
      <g class="fish">
        <path ${E} fill="#3aa0d8" d="M80 166 L70 158 L74 170 L66 176 L82 172Z"/>
        <path ${E} fill="#3aa0d8" d="M80 168 C92 166 110 172 120 182 C117 190 107 191 100 187 C91 182 84 176 80 168Z"/>
        <circle cx="112" cy="183" r="3" fill="#fff" stroke="${BR}" stroke-width="1.6"/><circle cx="112.6" cy="183.4" r="1.4" fill="${BR}"/>
        <path fill="none" stroke="#9fd8f2" stroke-width="2.2" stroke-linecap="round" d="M88 172 C96 174 104 178 110 182"/>
      </g>
      <path ${E} fill="${BEAK}" d="M92 166 C92 162 106 162 107 167 L107 176 C103 180 94 180 92 176Z"/>
      <path ${E} fill="${BEAK}" d="M105 166 C105 162 119 162 120 167 L120 176 C116 180 107 180 105 176Z"/>
      <path fill="none" ${E} d="M95 176 l-1 5 M100 178 l0 5 M108 176 l-1 5 M113 178 l0 5 M118 176 l1 4"/>
    </g>`}
    <g class="head">
      <path ${E} fill="${WHITE}" d="M50 66 C48 52 56 44 68 45 C77 46 83 53 85 61 C90 71 98 78 108 84 C101 87 97 87 93 85 C97 92 96 98 92 102 C87 100 84 96 82 92 C80 100 76 104 70 106 C68 99 66 93 64 89 C60 95 56 98 51 98 C54 88 52 76 50 66Z"/>
      <path fill="none" stroke="${WSH}" stroke-width="2.8" stroke-linecap="round" d="M70 78 q3 4 6 0 M84 84 q3 4 6 0 M62 86 q2 4 5 0 M78 92 l2 6"/>
      <ellipse class="blush" cx="76" cy="66" rx="5" ry="3.2" fill="#ff9aa8" opacity=".7"/>
      <g class="eyes-open">
        <circle cx="64" cy="57" r="7.5" fill="#fff" stroke="${BR}" stroke-width="2.8"/>
        <g class="pupil"><circle cx="63" cy="57" r="5" fill="#6b5fa8"/><circle cx="63" cy="57" r="2.6" fill="${BR}"/><circle cx="64.6" cy="55" r="1.5" fill="#fff"/></g>
      </g>
      <g class="eyes-happy" fill="none" stroke="${BR}" stroke-width="3.4" stroke-linecap="round"><path d="M57 59 Q64 50 71 59"/></g>
      <path class="brow brow-l" fill="none" stroke="${BR}" stroke-width="3.6" stroke-linecap="round" d="M55 43.5 L70 45.5"/>
      <path class="beak" ${E} fill="${BEAK}" d="M57 49 C49 43 37 42 30 46 C27 48 28 52 32 52 C39 52 44 55 46 59 C48 63 52 65 57 64 C60 60 60 53 57 49Z"/>
      <path class="beak-tip" fill="${GLOW}" d="M32 52 C39 52 44 55 46 59 C48 63 52 65 57 64 C52 67 45 66 41 62 C38 58 36 54 32 52Z"/>
      <path class="smile" fill="none" stroke="${BR}" stroke-width="2.2" stroke-linecap="round" d="M44 58 Q50 62 56 61"/>
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
