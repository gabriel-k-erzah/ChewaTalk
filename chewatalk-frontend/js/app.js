import { store } from './store.js';
import { burst, burstFrom, rain, floatText, toast, blip, sound, initCursor, tilt, reveal, reduceMotion } from './fx.js';
import { mascotHTML, react, lookAt, MASCOTS } from './mascots.js';
import { initPets, setPets, petParade, runPet } from './pets.js';

/* ── Data ─────────────────────────────────── */
const DATA = await fetch('data/vocab.json').then(r => r.json());
const ITEMS = DATA.items;
const CATS = DATA.categories;
const catById = Object.fromEntries(CATS.map(c => [c.id, c]));
const levelInfo = n => DATA.levels.find(l => l.level === n);
const verified = ITEMS.filter(i => i.status === 'verified');
const inCat = (id, status) => ITEMS.filter(i => i.category === id && (!status || i.status === status));
const inLevel = (n, status) => ITEMS.filter(i => catById[i.category].track === 'curriculum' && i.level === n && (!status || i.status === status));
const kitItems = status => ITEMS.filter(i => catById[i.category].track === 'kit' && (!status || i.status === status));
const UNLOCK_AT = 0.6;

/* ── Helpers ──────────────────────────────── */
const app = document.getElementById('app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
// Compare answers ignoring case and punctuation ("Mundithandize" vs "Mundithandize!").
const norm = s => String(s).toLowerCase().replace(/[^\p{L}\p{N}' ]/gu, '').replace(/\s+/g, ' ').trim();
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const learnedCount = list => list.filter(i => store.isLearned(i.id)).length;
const pad = n => String(n).padStart(2, '0');
// Rollout text: each word is a clipped line, each letter rises out of it in turn.
// Screen readers get the plain text; the animated letters are hidden from them.
const roll = s => {
  let k = 0;
  const words = String(s).split(' ').map(w => `<span class="rw">${[...w].map(ch => `<span class="rl" style="--i:${Math.min(k++, 30)}">${esc(ch)}</span>`).join('')}</span>`).join(' ');
  return `<span class="sr-only">${esc(s)}</span><span class="roll" aria-hidden="true">${words}</span>`;
};
const isWT = it => it.source?.doc.startsWith('Wikitravel');
const srcLine = it => !it.source ? '' : isWT(it) ? 'Wikitravel' : `Peace Corps p.${it.source.page}`;
const altLine = it => it.alt?.length ? `Also: ${it.alt.map(a => esc(a.nyanja)).join(' · ')}` : '';
const srcFull = it => !it.source ? '' : `${esc(it.source.doc)}${it.source.page ? `, page ${it.source.page}` : ''}.`;
const artFor = cat => cat.track === 'kit' ? 'art-kit' : `art-${cat.level}`;
let cleanup = [];
// Replays the small lift that accompanies every card flip.
const lift = el => { if (!el) return; el.classList.remove('lift'); void el.offsetWidth; el.classList.add('lift'); };
// Mascot lines use only verified phrases from the source (page numbers in vocab.json).
const say = (ny, en) => `${esc(ny)}<small>${esc(en)}</small>`;
const LINES = {
  hello: () => say('Bwanji?', 'Hello'),
  welcome: () => say('Fikani!', 'Welcome'),
  good: () => shuffle([say('Bwino bwino!', 'Nicely!'), say('Bwino bwino!', 'Nicely!'), say('Inde!', 'Yes!')])[0],
  sorry: () => say('Pepani…', 'Sorry'),
  again: () => say('Bwerezanso', 'Again'),
  thanks: () => say('Zikomo!', 'Thank you'),
  slowly: () => say("Pang'ono pang'ono", 'Slowly does it'),
};
const coachFor = cat => cat.track === 'kit' ? 'dog' : 'eagle';
const coachEl = () => app.querySelector('.coach .mascot, .stamp-wrap .mascot');
const stampHTML = (big, small, kind, mood, line) => `<div class="stamp-wrap"><div class="stamp"><div><b>${big}</b><span>${small}</span></div></div>${mascotHTML(kind, { mood, say: line })}</div>`;
// One delegated handler: any mascot on any page reacts when poked.
app.addEventListener('click', e => {
  const b = e.target.closest('.mascot .mascot-btn'); if (!b) return;
  blip('tap');
  react(b.closest('.mascot'), shuffle(['happy', 'happy', 'think'])[0], shuffle([LINES.hello, LINES.thanks, LINES.good, LINES.welcome])[0](), 1600);
});
const onCleanup = f => cleanup.push(f);

function gainXp(n, el) {
  store.addXp(n);
  if (el) floatText(el, `+${n} XP`);
  for (const id of ['hud-xp', 'hud-streak']) {
    const p = document.getElementById(id).parentElement;
    p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump');
  }
}

function levelProgress(n) {
  const v = inLevel(n, 'verified');
  return { verified: v.length, learned: learnedCount(v), total: inLevel(n).length, review: inLevel(n, 'review').length };
}
const isOpen = n => n === 1 || store.isUnlocked(n);

function checkUnlocks() {
  for (let n = 1; n < 5; n++) {
    const p = levelProgress(n);
    if (p.verified && p.learned / p.verified >= UNLOCK_AT && store.unlock(n + 1)) {
      setTimeout(() => { rain(); blip('win'); toast(`Level ${n + 1} unlocked: ${levelInfo(n + 1).title}`); }, 500);
    }
  }
}

/* ── HUD ──────────────────────────────────── */
function hud() {
  document.getElementById('hud-xp').textContent = store.get().xp;
  document.getElementById('hud-streak').textContent = store.streakAlive();
}
store.subscribe(hud); hud();
document.getElementById('logo-mascot').innerHTML = mascotHTML('eagle', { logo: true });
lookAt();
const soundBtn = document.getElementById('sound-toggle');
sound.on = store.get().sound; soundBtn.setAttribute('aria-pressed', sound.on);
const petsBtn = document.getElementById('pets-toggle');
const petsOn = store.get().pets !== false;
petsBtn.setAttribute('aria-pressed', petsOn); initPets({ on: petsOn });
petsBtn.addEventListener('click', () => {
  const on = petsBtn.getAttribute('aria-pressed') !== 'true';
  petsBtn.setAttribute('aria-pressed', on); store.setPets(on); setPets(on);
  toast(on ? 'Pets on. Nkwazi and Goggles will pop by now and then.' : 'Pets off');
  if (on) runPet('dog');
});
soundBtn.addEventListener('click', () => {
  sound.on = !sound.on; store.setSound(sound.on); soundBtn.setAttribute('aria-pressed', sound.on);
  blip('tap'); toast(sound.on ? 'Sound effects on' : 'Sound effects off');
});

/* ── Phone menu ───────────────────────────── */
const menuBtn = document.getElementById('menu-btn'), menuPanel = document.getElementById('menu-panel');
document.getElementById('menu-mascot').innerHTML = mascotHTML('dog', { say: LINES.hello() });
const syncSettings = () => menuPanel.querySelectorAll('[data-proxy]').forEach(b =>
  b.setAttribute('aria-pressed', document.getElementById(b.dataset.proxy).getAttribute('aria-pressed')));
const menuIsOpen = () => menuPanel.classList.contains('open');
function openMenu() {
  syncSettings();
  menuPanel.hidden = false;
  void menuPanel.offsetWidth; // start the reveal from the closed state
  menuPanel.classList.add('open');
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  blip('tap');
  setTimeout(() => menuPanel.querySelector('.menu-links a')?.focus({ preventScroll: true }), 120);
}
function closeMenu({ restoreFocus = true } = {}) {
  if (!menuIsOpen()) return;
  menuPanel.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  if (restoreFocus) menuBtn.focus({ preventScroll: true });
}
menuBtn.addEventListener('click', openMenu);
document.getElementById('menu-close').addEventListener('click', () => closeMenu());
menuPanel.querySelectorAll('.menu-links a').forEach(a => a.addEventListener('click', () => closeMenu({ restoreFocus: false })));
menuPanel.querySelectorAll('[data-proxy]').forEach(b => b.addEventListener('click', () => {
  document.getElementById(b.dataset.proxy).click(); syncSettings();
}));
addEventListener('keydown', e => {
  if (!menuIsOpen()) return;
  if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
  if (e.key !== 'Tab') return;
  // Keep keyboard focus inside the open menu.
  const f = [...menuPanel.querySelectorAll('a, button')].filter(el => el.offsetParent !== null);
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
addEventListener('hashchange', () => closeMenu({ restoreFocus: false }));
matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) closeMenu({ restoreFocus: false }); });

/* ── Views ────────────────────────────────── */
function levelCardHTML(n) {
  const L = levelInfo(n), p = levelProgress(n), open = isOpen(n);
  const cats = CATS.filter(c => c.track === 'curriculum' && c.level === n).map(c => c.name).join(' · ');
  return `<a class="level-card reveal" href="#/level/${n}" data-level="${n}" ${open ? '' : 'data-locked'}>
    <div class="lc-inner art-${n}">
      <div class="lc-top"><span>Level ${pad(n)}</span><span>${esc(L.name)}</span></div>
      <div class="lc-title">${esc(L.title)}</div>
      <div class="lc-cats">${esc(cats)}</div>
      <div class="lc-num" aria-hidden="true">${n}</div>
      <div class="lc-foot"><span>${p.learned}/${p.verified} verified words learned</span><div class="bar"><i style="--p:${pct(p.learned, p.verified)}%"></i></div></div>
      ${open ? '' : `<div class="lock"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Learn ${Math.round(UNLOCK_AT * 100)}% of level ${n - 1} to unlock</span></div>`}
    </div>
    <div class="level-meta"><strong>${esc(L.name)}</strong><span>${p.verified} verified · ${p.total - p.verified - p.review} waiting</span></div>
  </a>`;
}

function viewHome() {
  const sample = shuffle(verified.filter(i => i.nyanja.length < 22));
  const total = ITEMS.filter(i => catById[i.category].track === 'curriculum');
  const tv = total.filter(i => i.status === 'verified').length, tr = total.filter(i => i.status === 'review').length;
  const kv = kitItems('verified');
  const first = sample[0];
  const floats = sample.slice(1, 3);

  app.innerHTML = `
  <section class="hero wrap">
    <div>
      <p class="eyebrow fade-up">Nyanja / Chichewa · Levels 1 → 5</p>
      <h1 class="display"><span class="split-line"><span>Learn Nyanja.</span></span><span class="split-line"><span>One <em>word</em></span></span><span class="split-line"><span>at a time.</span></span></h1>
      <p class="lead fade-up">Short decks, quick quizzes and a matching game for the Nyanja people actually use: greetings, family, food, getting around town. Start with "Bwanji?" and work up to real conversations.</p>
      <div class="hero-ctas fade-up">
        <a class="btn" href="#/level/1">Start level 1 <span class="arrow">→</span></a>
        <a class="btn ghost" href="#/kit">Open the survival kit <span class="arrow">→</span></a>
      </div>
      <div class="hero-meta fade-up">
        <span><b>${store.get().xp}</b>XP earned</span>
        <span><b>${Object.keys(store.get().learned).length}</b>words learned</span>
        <span><b>${verified.length}</b>verified phrases</span>
      </div>
    </div>
    <div class="stage" id="stage">
      <div class="stage-label"><span>CH. 01 · SAY IT</span><span>TAP THE CARD · POKE THE CREW</span></div>
      <div class="sun"></div><div class="cloud c1"></div><div class="cloud c2"></div><div class="cloud c3"></div>
      <div class="ground"></div>
      ${mascotHTML('eagle', { cls: 'hero-eagle' })}
      ${mascotHTML('dog', { cls: 'hero-dog flip-say' })}
      ${floats.map((f, i) => `<span class="floaty f${i + 1}" data-depth="${(i + 1) * 6}">${esc(f.nyanja)}</span>`).join('')}
      <button class="word-card" id="hero-card" aria-label="Flip card to see the Nyanja translation">
        <span class="wc-flip">
        <span class="wc-face wc-front"><small><span>English</span><span>Tap ↻</span></small><strong id="hc-en">${roll(first.english)}</strong></span>
        <span class="wc-face wc-back"><small><span>Nyanja</span><span id="hc-src">${srcLine(first)}</span></small><strong id="hc-ny">${roll(first.nyanja)}</strong></span>
        </span>
      </button>
    </div>
  </section>

  <section class="wrap">
    <div class="section-heading"><h2><span>01</span>The route</h2><span class="section-aside">Five levels · ${CATS.filter(c => c.track === 'curriculum').length} categories</span></div>
    <div class="route">${[1, 2, 3, 4, 5].map(levelCardHTML).join('')}</div>

    <div class="section-heading"><h2><span>02</span>Meet the crew</h2><span class="section-aside">Poke them</span></div>
    <div class="crew">
      <div class="crew-card eagle-card reveal">${mascotHTML('eagle')}<div><span class="small-note">Your guide · Levels 1–5</span><h3>Nkwazi</h3><p>Named after the eagle in Zambia's national anthem: <i>"Monga nkwazi m'mwamba"</i>. Nkwazi is a fish eagle who never goes anywhere without a fish, coaches you through the main course and cheers loudest when you're on a combo.</p><span class="small-note">Name taken from the anthem text, source p.10</span></div></div>
      <div class="crew-card dog-card reveal">${mascotHTML('dog')}<div><span class="small-note">Travel buddy · Survival kit</span><h3>Goggles</h3><p>Goggles has the cap and goggles on and is ready for the bus, the market and asking where the toilet is. Goggles runs the survival kit.</p><span class="small-note">Good dog. Very good dog.</span></div></div>
    </div>

    <div class="section-heading"><h2><span>03</span>Survival kit</h2><span class="section-aside">From the 1995 Peace Corps Zambia lessons and Wikitravel</span></div>
    <a class="kit-banner reveal" href="#/kit">
      <div class="art-kit"><div class="lc-top"><span>Bonus track</span><span>${kv.length} phrases</span></div><strong>Survival<br>kit</strong></div>
      <div class="kit-side">
        <ul>${shuffle(kv).slice(0, 4).map(i => `<li><span>${esc(i.english)}</span><b>${esc(i.nyanja)}</b></li>`).join('')}</ul>
        <span class="text-link">Learn the kit <span class="arrow">→</span></span>
      </div>
    </a>

    <div class="section-heading"><h2><span>04</span>Translation coverage</h2><span class="section-aside">${tv} of ${total.length} phrases verified</span></div>
    <div class="coverage">
      <div class="reveal">
        <h3 class="h2">No made-up <em>Nyanja.</em></h3>
        <p>Every translation here comes from a named source, never a machine. There are two so far. The Peace Corps/Zambia 1995 Nyanja lessons are kept with their original spelling, which writes "c" where newer spelling uses "ch" (<b>cakudya</b> is <b>chakudya</b> today). The Wikitravel Nyanja phrasebook mostly gives Malawi Chichewa forms, so those phrases are marked for a Lusaka speaker to check. Phrases with no translation yet stay in the phrasebook as waiting.</p>
        <a class="text-link" href="#/phrasebook">Browse the phrasebook <span class="arrow">→</span></a>
      </div>
      <div class="cov-rows reveal">
        ${[1, 2, 3, 4, 5].map(n => { const p = levelProgress(n); return `<div class="cov-row"><span>Level ${pad(n)}</span><div class="bar"><i style="--p:${pct(p.verified, p.total)}%"></i></div><span>${p.verified}/${p.total}</span></div>`; }).join('')}
        <div class="cov-legend"><span><i></i>verified</span><span>${tr} more need a spelling check</span></div>
      </div>
    </div>
  </section>`;

  document.querySelectorAll('.level-card').forEach(c => {
    tilt(c, c.querySelector('.lc-inner'), 10);
    if (c.hasAttribute('data-locked')) c.addEventListener('click', e => {
      e.preventDefault(); blip('bad');
      toast(`Locked. Learn ${Math.round(UNLOCK_AT * 100)}% of level ${c.dataset.level - 1}, or open it from the level page.`);
      setTimeout(() => location.hash = `#/level/${c.dataset.level}`, 900);
    });
  });
  heroStage(sample);
  const [e, d] = app.querySelectorAll('.stage .mascot');
  setTimeout(() => react(e, 'happy', LINES.hello(), 2400), 900);
  setTimeout(() => react(d, 'happy', LINES.welcome(), 2400), 2000);
}

function heroStage(sample) {
  const stage = document.getElementById('stage'), card = document.getElementById('hero-card');
  const en = document.getElementById('hc-en'), ny = document.getElementById('hc-ny'), src = document.getElementById('hc-src');
  let i = 0;
  const step = () => {
    if (card.classList.contains('flipped')) {
      i = (i + 1) % sample.length;
      en.innerHTML = roll(sample[i].english);
      card.classList.remove('flipped'); lift(card.firstElementChild);
      setTimeout(() => { ny.innerHTML = roll(sample[i].nyanja); src.textContent = srcLine(sample[i]); }, 650);
    } else { card.classList.add('flipped'); lift(card.firstElementChild); }
  };
  let timer = reduceMotion ? 0 : setInterval(step, 2800);
  card.addEventListener('click', () => { clearInterval(timer); step(); blip('flip'); timer = reduceMotion ? 0 : setInterval(step, 4200); });
  onCleanup(() => clearInterval(timer));
  if (reduceMotion) return;
  const sun = stage.querySelector('.sun'), floats = stage.querySelectorAll('.floaty');
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    card.style.setProperty('--ry', `${px * 18}deg`); card.style.setProperty('--rx', `${-py * 14}deg`);
    sun.style.setProperty('--px', `${px * -24}px`); sun.style.setProperty('--py', `${py * -16}px`);
    floats.forEach(f => { const d = +f.dataset.depth; f.style.setProperty('--fx', `${px * d * 2}px`); f.style.setProperty('--fy', `${py * d * 2}px`); });
  });
  stage.addEventListener('pointerleave', () => { card.style.setProperty('--ry', '0deg'); card.style.setProperty('--rx', '0deg'); });
}

function viewLevel(n) {
  const isKit = n === 'kit';
  const cats = CATS.filter(c => isKit ? c.track === 'kit' : c.track === 'curriculum' && c.level === n);
  const L = isKit ? { name: 'Bonus track', title: 'Survival kit' } : levelInfo(n);
  if (!L) return viewNotFound();
  const open = isKit || isOpen(n);
  const p = isKit ? { verified: kitItems('verified').length, learned: learnedCount(kitItems('verified')) } : levelProgress(n);

  app.innerHTML = `<section class="wrap">
    <a class="back" href="#/">← All levels</a>
    <div class="level-hero ${isKit ? 'art-kit' : `art-${n}`}">
      <div class="lc-top"><span>${isKit ? 'Survival kit' : `Level ${pad(n)}`}</span><span>${esc(L.name)}</span></div>
      <h1>${esc(L.title)}</h1>
      <p>${p.learned}/${p.verified} verified phrases learned${isKit ? '. Phrases from the 1995 Peace Corps Zambia survival kit and the Wikitravel phrasebook.' : ''}</p>
      <div class="lc-num" aria-hidden="true">${isKit ? '<span class="star-mark"></span>' : n}</div>
    </div>
    ${open ? '' : `<p class="small-note" style="margin-top:22px">This level opens once you've learned ${Math.round(UNLOCK_AT * 100)}% of level ${n - 1}. <button class="text-link" id="jump" style="background:none;border:0;border-bottom:1px solid">Jump ahead anyway →</button></p>`}
    <div class="cat-list">${cats.map((c, idx) => {
      const v = inCat(c.id, 'verified'), rv = inCat(c.id, 'review').length, pend = inCat(c.id, 'pending').length;
      const lr = learnedCount(v), best = store.get().quizBest[c.id];
      const can = open && v.length > 0;
      return `<div class="cat-row">
        <div class="ring" style="--p:${pct(lr, v.length)}"><span>${pct(lr, v.length)}%</span></div>
        <div><span class="small-note">${pad(idx + 1)} · ${esc(isKit ? 'Survival kit' : `Level ${n}`)}</span><h3>${esc(c.name)}</h3></div>
        <div class="counts">
          <span class="chip ok">${v.length} verified</span>
          ${rv ? `<span class="chip review">${rv} to check</span>` : ''}
          ${pend ? `<span class="chip pending">${pend} waiting</span>` : ''}
          ${best != null ? `<span class="chip">Best ${best}%</span>` : ''}
        </div>
        <div class="cat-actions">
          <a class="btn small" href="#/learn/${c.id}" ${can ? '' : 'aria-disabled="true" tabindex="-1" style="opacity:.35;pointer-events:none"'}>Learn <span class="arrow">→</span></a>
          <a class="btn small ghost" href="#/quiz/${c.id}" ${can ? '' : 'aria-disabled="true" tabindex="-1" style="opacity:.35;pointer-events:none"'}>Quiz</a>
          <a class="btn small ghost" href="#/match/${c.id}" ${can ? '' : 'aria-disabled="true" tabindex="-1" style="opacity:.35;pointer-events:none"'}>Match</a>
        </div>
      </div>`;
    }).join('')}</div>
    <p class="small-note" style="margin-top:22px">Categories with no verified phrases yet show "waiting". Add checked translations to <code>data/vocab.json</code> through <code>tools/build_vocab.py</code> and they show up here automatically.</p>
  </section>`;
  reveal(app);
  document.getElementById('jump')?.addEventListener('click', () => { store.unlock(n); blip('win'); burst(innerWidth / 2, innerHeight / 3, 60); render(); });
}

/* Flashcards */
function viewLearn(catId) {
  const cat = catById[catId]; if (!cat) return viewNotFound();
  const items = inCat(catId, 'verified');
  const waiting = ITEMS.filter(i => i.category === catId && i.status !== 'verified');
  const backHref = cat.track === 'kit' ? '#/kit' : `#/level/${cat.level}`;
  if (!items.length) return viewEmpty(cat, backHref);
  let queue = [...items], pos = 0, requeued = new Set();
  const status = {};

  app.innerHTML = `<section class="wrap">
    <a class="back" href="${backHref}">← ${esc(cat.track === 'kit' ? 'Survival kit' : `Level ${cat.level}`)}</a>
    <div class="session-head"><div><p class="eyebrow" style="margin:0">Flashcards</p><h1>${esc(cat.name)}</h1></div><div class="pips" id="pips"></div></div>
    <div class="deck-zone">
      <div><div class="deck" id="deck"></div>
        <div class="deck-controls">
          <button class="btn ghost" id="b-again">← Again</button>
          <button class="btn ghost" id="b-flip">Flip ↻</button>
          <button class="btn" id="b-got">Got it →</button>
        </div>
      </div>
      <aside class="deck-side">
        <div class="coach">${mascotHTML(coachFor(cat), { say: LINES.hello() })}</div>
        <h3>How it works</h3>
        <div class="keys"><kbd>Space</kbd><span>flip the card</span><kbd>→</kbd><span>got it (+5 XP)</span><kbd>←</kbd><span>see it again</span></div>
        <p>Drag or swipe the card, too.</p>
        ${waiting.length ? `<h3>Not in the deck yet</h3><ul class="waiting">${waiting.map(w => `<li><span>${esc(w.english)}</span><span>${w.status === 'review' ? 'spelling check' : 'waiting'}</span></li>`).join('')}</ul>` : ''}
      </aside>
    </div></section>`;

  const deck = document.getElementById('deck'), pips = document.getElementById('pips');
  const drawPips = () => pips.innerHTML = items.map(it => `<i class="${status[it.id] || ''} ${queue[pos]?.id === it.id ? 'on' : ''}"></i>`).join('');

  function cardHTML(it, depth) {
    const long = it.nyanja.length > 18 || it.english.length > 22;
    return `<div class="card ${depth ? `behind behind-${depth}` : ''}" ${depth ? 'aria-hidden="true"' : 'tabindex="0" role="button" aria-label="Flashcard. Press space to flip."'}>
      <div class="card-flip">
        <div class="face front"><small><span>English</span><span>${pad(items.indexOf(it) + 1)}/${pad(items.length)}</span></small><div class="big ${long ? 'long' : ''}">${roll(it.english)}</div><span class="hint">Tap to flip ↻</span></div>
        <div class="face back"><small><span>Nyanja</span><span>${srcLine(it)}</span></small>
          <div><div class="big ${long ? 'long' : ''}">${roll(it.nyanja)}</div>
          ${altLine(it) ? `<p class="note">${altLine(it)}</p>` : ''}${it.sourceEnglish ? `<p class="note">Source wording: "${esc(it.sourceEnglish)}"</p>` : ''}${it.note ? `<p class="note">${esc(it.note)}</p>` : ''}${it.dialect ? `<p class="note">Malawi form · to check for Lusaka</p>` : ''}</div>
          <span class="hint">→ got it · ← again</span></div>
      </div>
      <span class="stamp-yes">Got it</span><span class="stamp-no">Again</span>
    </div>`;
  }

  function drawDeck() {
    if (pos >= queue.length) return finish();
    const view = queue.slice(pos, pos + 3);
    deck.innerHTML = view.map((it, d) => cardHTML(it, d)).reverse().join('');
    drawPips();
    const top = deck.lastElementChild;
    bindDrag(top);
  }

  function flip() { const top = deck.lastElementChild; if (!top) return; top.classList.toggle('flipped'); lift(top.querySelector('.card-flip')); blip('flip'); }

  function decide(ok) {
    const top = deck.lastElementChild; if (!top || top.dataset.leaving) return;
    top.dataset.leaving = '1';
    const it = queue[pos];
    if (ok) {
      status[it.id] = 'done';
      if (store.learn(it.id)) gainXp(5, top);
      blip('good'); burstFrom(top, 18); react(coachEl(), 'happy', LINES.good());
    } else {
      status[it.id] = 'again';
      if (!requeued.has(it.id)) { queue.push(it); requeued.add(it.id); }
      blip('bad'); react(coachEl(), 'think', LINES.again());
    }
    top.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1), opacity .5s';
    top.style.transform = `translate(${ok ? 140 : -140}%, -10%) rotate(${ok ? 22 : -22}deg)`;
    top.style.opacity = '0';
    setTimeout(() => { pos++; drawDeck(); }, reduceMotion ? 0 : 320);
  }

  function bindDrag(card) {
    let sx = 0, sy = 0, dx = 0, dragging = false, moved = false;
    const yes = card.querySelector('.stamp-yes'), no = card.querySelector('.stamp-no');
    card.addEventListener('pointerdown', e => { dragging = true; moved = false; sx = e.clientX; sy = e.clientY; dx = 0; card.setPointerCapture(e.pointerId); card.style.transition = 'none'; });
    card.addEventListener('pointermove', e => {
      if (!dragging) return;
      dx = e.clientX - sx; const dy = e.clientY - sy;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
      card.style.transform = `translate(${dx}px, ${dy * .3}px) rotate(${dx / 18}deg)`;
      yes.style.opacity = Math.max(0, Math.min(1, dx / 110)); no.style.opacity = Math.max(0, Math.min(1, -dx / 110));
    });
    const end = () => {
      if (!dragging) return; dragging = false;
      if (Math.abs(dx) > 110) return decide(dx > 0);
      card.style.transition = 'transform .45s cubic-bezier(.34,1.56,.64,1)'; card.style.transform = '';
      yes.style.opacity = no.style.opacity = 0;
      if (!moved) flip();
    };
    card.addEventListener('pointerup', end); card.addEventListener('pointercancel', end);
  }

  function finish() {
    checkUnlocks();
    const done = items.filter(i => status[i.id] === 'done').length;
    blip('win'); rain(90); petParade();
    app.innerHTML = `<section class="wrap"><a class="back" href="${backHref}">← Back</a>
      <div class="results">${stampHTML(done, `of ${items.length} learned`, coachFor(cat), 'cheer', LINES.thanks())}
      <div><p class="eyebrow">Deck complete · ${esc(cat.name)}</p><h1>Zikomo! Nice work.</h1>
      <p class="lead">You got through the whole deck. Test yourself while it's fresh. Quizzes give 10 XP per answer, plus combo bonuses.</p>
      <div class="btns"><a class="btn" href="#/quiz/${catId}">Take the quiz <span class="arrow">→</span></a><a class="btn ghost" href="#/match/${catId}">Play match</a><a class="btn ghost" href="#/learn/${catId}?r=${Date.now()}">Go again ↻</a></div></div></div></section>`;
  }

  document.getElementById('b-again').onclick = () => decide(false);
  document.getElementById('b-got').onclick = () => decide(true);
  document.getElementById('b-flip').onclick = flip;
  const key = e => {
    if (e.target.closest('input')) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
    else if (e.key === 'ArrowRight') decide(true);
    else if (e.key === 'ArrowLeft') decide(false);
  };
  addEventListener('keydown', key); onCleanup(() => removeEventListener('keydown', key));
  drawDeck();
}

/* Quiz */
function pickDistractors(it, dir, cat) {
  const field = dir === 'en' ? 'nyanja' : 'english';
  const same = c => c.id !== it.id && norm(c.english) !== norm(it.english) && norm(c.nyanja) !== norm(it.nyanja);
  const tiers = [verified.filter(c => c.category === cat.id), verified.filter(c => c.level === it.level), verified];
  const out = [], seen = new Set([norm(it[field])]);
  for (const tier of tiers) for (const c of shuffle(tier.filter(same))) {
    if (out.length === 3) return out;
    const k = norm(c[field]); if (seen.has(k)) continue; seen.add(k); out.push(c);
  }
  return out;
}

function viewQuiz(catId) {
  const cat = catById[catId]; if (!cat) return viewNotFound();
  const items = inCat(catId, 'verified');
  const backHref = cat.track === 'kit' ? '#/kit' : `#/level/${cat.level}`;
  if (!items.length) return viewEmpty(cat, backHref);
  const pairs = shuffle(items.flatMap(it => [{ it, dir: 'en' }, { it, dir: 'ny' }]));
  const qs = pairs.slice(0, Math.min(10, Math.max(4, items.length * 2)));
  let qi = 0, score = 0, combo = 0, bestCombo = 0, xpEarned = 0, locked = false;
  const misses = [];

  app.innerHTML = `<section class="wrap"><a class="back" href="${backHref}">← ${esc(cat.track === 'kit' ? 'Survival kit' : `Level ${cat.level}`)}</a>
    <div class="session-head"><div><p class="eyebrow" style="margin:0">Quiz</p><h1>${esc(cat.name)}</h1></div><div class="pips" id="pips"></div></div>
    <div class="quiz-wrap"><div id="qhost"></div>
      <aside class="score-side"><div class="coach">${mascotHTML(coachFor(cat), { say: LINES.hello() })}</div><div class="stat"><span>Combo</span><b class="combo" id="combo">×0</b></div><div class="stat"><span>Score</span><b id="score">0</b></div><div class="stat"><span>XP this round</span><b id="xpr">0</b></div><p>Keys <kbd>1</kbd>–<kbd>4</kbd> pick an answer. <kbd>Enter</kbd> moves on.</p></aside>
    </div></section>`;
  const host = document.getElementById('qhost'), pips = document.getElementById('pips');
  const drawPips = () => pips.innerHTML = qs.map((q, i) => `<i class="${q.res || ''} ${i === qi ? 'on' : ''}"></i>`).join('');

  function ask() {
    if (qi >= qs.length) return results();
    locked = false; drawPips();
    const { it, dir } = qs[qi];
    const field = dir === 'en' ? 'nyanja' : 'english';
    const opts = shuffle([it, ...pickDistractors(it, dir, cat)]);
    host.innerHTML = `<div class="q-card enter">
      <div class="q-dir"><span>${dir === 'en' ? 'English → Nyanja' : 'Nyanja → English'}</span><span>${pad(qi + 1)}/${pad(qs.length)}</span></div>
      <div class="q-prompt">${roll(dir === 'en' ? it.english : it.nyanja)}</div>
      <p class="q-ask">${dir === 'en' ? 'How do you say this in Nyanja?' : 'What does this mean?'}</p>
      <div class="options">${opts.map((o, i) => `<button class="opt" data-id="${o.id}"><kbd>${i + 1}</kbd>${esc(o[field])}</button>`).join('')}</div>
      <div class="q-feedback" aria-live="polite"></div>
      <div class="q-next" hidden><button class="btn">Next →</button></div>
    </div>`;
    host.querySelectorAll('.opt').forEach(b => b.onclick = () => choose(b));
    host.querySelector('.q-next button').onclick = next;
  }

  function choose(btn) {
    if (locked) return; locked = true;
    const q = qs[qi], ok = btn.dataset.id === q.it.id;
    const fb = host.querySelector('.q-feedback');
    host.querySelectorAll('.opt').forEach(b => b.disabled = true);
    store.answer(ok);
    if (ok) {
      combo++; bestCombo = Math.max(bestCombo, combo); score++;
      const xp = 10 + Math.min(combo - 1, 5) * 2; xpEarned += xp;
      btn.classList.add('correct'); gainXp(xp, btn); burstFrom(btn, 26 + combo * 4); blip('good');
      react(coachEl(), combo >= 3 ? 'cheer' : 'happy', combo >= 3 ? say(`Bwino bwino! ×${combo}`, 'On a roll!') : LINES.good(), 1400);
      store.learn(q.it.id);
      fb.className = 'q-feedback good'; fb.textContent = combo > 1 ? `Correct! Combo ×${combo}` : 'Correct!';
      q.res = 'done';
      setTimeout(next, reduceMotion ? 600 : 950);
    } else {
      combo = 0; btn.classList.add('wrong'); blip('bad'); react(coachEl(), 'sad', LINES.sorry(), 2200);
      host.querySelector(`.opt[data-id="${q.it.id}"]`).classList.add('answer');
      fb.className = 'q-feedback bad'; fb.textContent = `Not quite. ${q.it.english} = ${q.it.nyanja}`;
      misses.push(q.it); q.res = 'again';
      host.querySelector('.q-next').hidden = false; host.querySelector('.q-next button').focus();
    }
    const c = document.getElementById('combo'); c.textContent = `×${combo}`; c.classList.toggle('hot', combo > 1);
    if (combo > 1) { c.classList.remove('hot'); void c.offsetWidth; c.classList.add('hot'); }
    document.getElementById('score').textContent = score; document.getElementById('xpr').textContent = xpEarned;
  }
  function next() { if (!locked) return; qi++; ask(); }

  function results() {
    const p = pct(score, qs.length), best = store.setBest(catId, p);
    checkUnlocks();
    if (p >= 70) { rain(p === 100 ? 220 : 120); blip('win'); petParade(); }
    const head = p === 100 ? 'Perfect!' : p >= 70 ? 'Zikomo! Well done.' : p >= 40 ? 'Getting there.' : 'Keep practising.';
    const uniq = [...new Map(misses.map(m => [m.id, m])).values()];
    app.innerHTML = `<section class="wrap"><a class="back" href="${backHref}">← Back</a>
      <div class="results">${stampHTML(`${p}%`, `${score}/${qs.length} correct`, coachFor(cat), p >= 70 ? 'cheer' : p >= 40 ? 'think' : 'sad', p >= 70 ? LINES.thanks() : LINES.slowly())}
      <div><p class="eyebrow">Quiz · ${esc(cat.name)}${best ? ' · New best' : ''}</p><h1>${head}</h1>
      <p class="lead">+${xpEarned} XP · best combo ×${bestCombo}</p>
      ${uniq.length ? `<div class="miss-list">Worth another look:<br>${uniq.map(m => `<b>${esc(m.english)}</b> → ${esc(m.nyanja)}`).join('<br>')}</div>` : ''}
      <div class="btns"><a class="btn" href="#/quiz/${catId}?r=${Date.now()}">Try again ↻</a><a class="btn ghost" href="#/learn/${catId}">Review cards</a><a class="btn ghost" href="#/match/${catId}">Play match</a></div></div></div></section>`;
  }

  const key = e => {
    if (/^[1-4]$/.test(e.key)) host.querySelectorAll('.opt')[+e.key - 1]?.click();
    else if (e.key === 'Enter' && locked && !host.querySelector('.q-next')?.hidden) { e.preventDefault(); next(); }
  };
  addEventListener('keydown', key); onCleanup(() => removeEventListener('keydown', key));
  ask();
}

/* Match */
function viewMatch(catId) {
  const cat = catById[catId]; if (!cat) return viewNotFound();
  const backHref = cat.track === 'kit' ? '#/kit' : `#/level/${cat.level}`;
  const own = inCat(catId, 'verified');
  if (!own.length) return viewEmpty(cat, backHref);
  const pool = [], seenE = new Set(), seenN = new Set();
  const add = it => { const e = norm(it.english), n = norm(it.nyanja); if (seenE.has(e) || seenN.has(n) || pool.length >= 5) return; seenE.add(e); seenN.add(n); pool.push(it); };
  shuffle(own).forEach(add);
  shuffle(verified.filter(v => v.level === cat.level)).forEach(add);
  shuffle(verified).forEach(add);
  const tiles = shuffle(pool.flatMap(it => [{ it, side: 'en' }, { it, side: 'ny' }]));
  let sel = null, found = 0, misses = 0, t0 = performance.now(), busy = false, timer;

  app.innerHTML = `<section class="wrap"><a class="back" href="${backHref}">← ${esc(cat.track === 'kit' ? 'Survival kit' : `Level ${cat.level}`)}</a>
    <div class="session-head"><div><p class="eyebrow" style="margin:0">Match the pairs</p><h1>${esc(cat.name)}</h1></div></div>
    <div class="match-head"><div class="coach" style="border:0;padding:40px 0 0;margin:0 30px 0 0">${mascotHTML(coachFor(cat), { say: LINES.hello() })}</div><span><b id="m-time">0.0</b>s</span><span><b id="m-found">0</b>/${pool.length} pairs</span><span><b id="m-miss">0</b> misses</span>${own.length < pool.length ? `<span class="small-note">Topped up with words from other categories</span>` : ''}</div>
    <div class="match-grid">${tiles.map((t, i) => `<button class="tile ${t.side}" style="--i:${i}" data-id="${t.it.id}" data-side="${t.side}"><small>${t.side === 'en' ? 'English' : 'Nyanja'}</small>${esc(t.side === 'en' ? t.it.english : t.it.nyanja)}</button>`).join('')}</div>
  </section>`;
  const tEl = document.getElementById('m-time');
  timer = setInterval(() => tEl.textContent = ((performance.now() - t0) / 1000).toFixed(1), 100);
  onCleanup(() => clearInterval(timer));

  app.querySelectorAll('.tile').forEach(tile => tile.addEventListener('animationend', e => { if (e.animationName === 'dealin') tile.classList.add('dealt'); }));
  app.querySelectorAll('.tile').forEach(tile => tile.onclick = () => {
    if (busy || tile.disabled) return;
    blip('tap');
    if (!sel) { sel = tile; tile.classList.add('sel'); return; }
    if (sel === tile) { tile.classList.remove('sel'); sel = null; return; }
    if (sel.dataset.side === tile.dataset.side) { sel.classList.remove('sel'); sel = tile; tile.classList.add('sel'); return; }
    const a = sel; sel = null; a.classList.remove('sel');
    if (a.dataset.id === tile.dataset.id) {
      [a, tile].forEach(t => { t.classList.add('yes'); t.disabled = true; });
      found++; document.getElementById('m-found').textContent = found;
      burstFrom(tile, 24); blip('good'); gainXp(4, tile); store.learn(tile.dataset.id); react(coachEl(), 'happy', LINES.good(), 1200);
      if (found === pool.length) setTimeout(done, 700);
    } else {
      misses++; document.getElementById('m-miss').textContent = misses; blip('bad'); react(coachEl(), 'sad', LINES.sorry(), 1200);
      busy = true; [a, tile].forEach(t => t.classList.add('no'));
      setTimeout(() => { [a, tile].forEach(t => t.classList.remove('no')); busy = false; }, 460);
    }
  });

  function done() {
    clearInterval(timer); checkUnlocks();
    const secs = ((performance.now() - t0) / 1000).toFixed(1);
    const bonus = Math.max(0, 20 - misses * 4);
    if (bonus) store.addXp(bonus);
    rain(120); blip('win'); petParade();
    app.innerHTML = `<section class="wrap"><a class="back" href="${backHref}">← Back</a>
      <div class="results">${stampHTML(`${secs}s`, `${misses} misses`, coachFor(cat), 'cheer', LINES.thanks())}
      <div><p class="eyebrow">Match · ${esc(cat.name)}</p><h1>${misses === 0 ? 'Flawless!' : 'All matched!'}</h1>
      <p class="lead">+${pool.length * 4 + bonus} XP${bonus ? `, including a ${bonus} XP accuracy bonus` : ''}.</p>
      <div class="btns"><a class="btn" href="#/match/${catId}?r=${Date.now()}">Play again ↻</a><a class="btn ghost" href="#/quiz/${catId}">Take the quiz</a></div></div></div></section>`;
  }
}

/* Phrasebook */
function viewPhrasebook() {
  let q = '', filter = 'all';
  app.innerHTML = `<section class="wrap">
    <div style="margin-top:46px"><p class="eyebrow">Every phrase, verified or not</p><h1 class="display" style="font-size:clamp(56px,8vw,110px)">Phrase<em>book</em></h1></div>
    <div class="pb-tools">
      <label class="search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="pb-q" type="search" placeholder="Search English or Nyanja…" autocomplete="off" aria-label="Search phrases"></label>
      <div class="filters" role="group" aria-label="Filter by status">
        ${[['all', 'All'], ['verified', 'Verified'], ['review', 'Spelling check'], ['pending', 'Waiting']].map(([k, l]) => `<button data-f="${k}" aria-pressed="${k === 'all'}">${l}</button>`).join('')}
      </div>
    </div>
    <div id="pb-list"></div></section>`;
  const list = document.getElementById('pb-list');
  const hl = s => { const t = esc(s); if (!q) return t; const i = t.toLowerCase().indexOf(esc(q).toLowerCase()); return i < 0 ? t : `${t.slice(0, i)}<mark>${t.slice(i, i + esc(q).length)}</mark>${t.slice(i + esc(q).length)}`; };
  const draw = () => {
    const ql = q.toLowerCase();
    const groups = CATS.map(c => [c, ITEMS.filter(i => i.category === c.id && (filter === 'all' || i.status === filter) && (!ql || i.english.toLowerCase().includes(ql) || (i.nyanja || '').toLowerCase().includes(ql)))]).filter(([, its]) => its.length);
    list.innerHTML = groups.length ? groups.map(([c, its]) => `<div class="pb-group"><h2>${esc(c.name)} <small>${c.track === 'kit' ? 'Survival kit' : `Level ${c.level}`} · ${its.length}</small></h2>
      ${its.map(i => `<div class="pb-row"><span>${hl(i.english)}</span>${i.nyanja ? `<span class="ny">${hl(i.nyanja)}</span>` : `<span class="ny none">awaiting verified translation</span>`}
      <span class="chip ${i.status === 'verified' ? 'ok' : i.status}">${i.status === 'verified' ? 'verified' : i.status === 'review' ? 'check' : 'waiting'}</span>
      ${i.source || i.note ? `<details><summary>Source & notes${i.dialect ? ' · Malawi form' : ''}</summary>${srcFull(i)}${i.alsoIn ? ` Also in: ${esc(i.alsoIn)}.` : ''}${i.alt?.length ? ` Alternatives: ${i.alt.map(a => `${esc(a.nyanja)} (${esc(a.doc.split(',')[0])})`).join(', ')}.` : ''}${i.sourceEnglish ? ` Source wording: "${esc(i.sourceEnglish)}".` : ''} ${esc(i.note || '')}${i.dialect ? ` ${esc(i.dialect)}` : ''}</details>` : ''}</div>`).join('')}</div>`).join('')
      : `<p class="pb-empty">Nothing matches "${esc(q)}".</p>`;
  };
  document.getElementById('pb-q').addEventListener('input', e => { q = e.target.value.trim(); draw(); });
  app.querySelectorAll('.filters button').forEach(b => b.onclick = () => {
    filter = b.dataset.f; app.querySelectorAll('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b)); draw();
  });
  draw();
}

function viewEmpty(cat, backHref) {
  app.innerHTML = `<section class="wrap"><a class="back" href="${backHref}">← Back</a>
    <div style="margin-top:50px"><p class="eyebrow">${esc(cat.name)}</p><h1 class="display" style="font-size:clamp(56px,8vw,100px)">Nothing to <em>practise</em> yet.</h1>
    <div class="empty-mascot">${mascotHTML('dog', { mood: 'sad', say: LINES.sorry() })}</div>
    <p class="lead">None of these phrases has a verified Nyanja translation yet. They're listed in the phrasebook and appear here once a speaker checks them.</p>
    <div class="hero-ctas"><a class="btn" href="#/phrasebook">See the phrasebook →</a></div></div></section>`;
}
function viewNotFound() {
  app.innerHTML = `<section class="wrap"><div style="margin-top:60px"><h1 class="display">Pepani, <em>not found.</em></h1><div class="empty-mascot">${mascotHTML('dog', { mood: 'think', say: LINES.sorry() })}</div><p class="lead">That page doesn't exist.</p><div class="hero-ctas"><a class="btn" href="#/">Back to the start →</a></div></div></section>`;
}

/* ── Router ───────────────────────────────── */
function route() {
  const [path] = location.hash.replace(/^#/, '').split('?');
  const parts = path.split('/').filter(Boolean);
  cleanup.forEach(f => f()); cleanup = [];
  document.querySelectorAll('nav a').forEach(a => a.removeAttribute('aria-current'));
  const kitCat = parts[1] && catById[parts[1]]?.track === 'kit';
  const navKey = parts[0] === undefined ? 'home' : parts[0] === 'kit' || kitCat ? 'kit' : parts[0] === 'phrasebook' ? 'phrasebook' : 'learn';
  const furthest = [5, 4, 3, 2, 1].find(n => isOpen(n));
  document.getElementById('nav-learn').href = document.getElementById('menu-learn').href = `#/level/${furthest}`;
  document.querySelectorAll(`nav a[data-nav="${navKey}"]`).forEach(a => a.setAttribute('aria-current', 'page'));

  switch (parts[0]) {
    case undefined: viewHome(); break;
    case 'level': viewLevel(+parts[1]); break;
    case 'kit': viewLevel('kit'); break;
    case 'learn': viewLearn(parts[1]); break;
    case 'quiz': viewQuiz(parts[1]); break;
    case 'match': viewMatch(parts[1]); break;
    case 'phrasebook': viewPhrasebook(); break;
    default: viewNotFound();
  }
  reveal(app);
}
function render() {
  const go = () => { route(); scrollTo({ top: 0, behavior: 'instant' }); };
  if (!document.startViewTransition || reduceMotion) return go();
  const vt = document.startViewTransition(go);
  // Rapid navigation skips transitions; that's expected, not an error.
  [vt.ready, vt.finished, vt.updateCallbackDone].forEach(pr => pr.catch(() => {}));
}
addEventListener('hashchange', render);
initCursor();
route();
