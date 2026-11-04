// Local progress. Kept in localStorage until the FastAPI backend's progress endpoints exist;
// the shape mirrors what README asks to track (lessons, categories, level, answers, streak, XP).
const KEY = 'chewatalk.progress.v1';
const blank = () => ({ xp: 0, learned: {}, correct: 0, wrong: 0, quizBest: {}, streak: { count: 0, last: null }, unlocked: [1], sound: false, pets: true });

let state = blank();
try { state = { ...blank(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { /* private mode etc. */ }

const listeners = new Set();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } listeners.forEach(f => f(state)); };
const today = () => new Date().toLocaleDateString('en-CA');

export const store = {
  get: () => state,
  subscribe(f) { listeners.add(f); return () => listeners.delete(f); },
  addXp(n) {
    state.xp += n;
    const t = today();
    if (state.streak.last !== t) {
      const y = new Date(Date.now() - 864e5).toLocaleDateString('en-CA');
      state.streak.count = state.streak.last === y ? state.streak.count + 1 : 1;
      state.streak.last = t;
    }
    save();
  },
  learn(id) { const fresh = !state.learned[id]; state.learned[id] = true; save(); return fresh; },
  isLearned: id => !!state.learned[id],
  answer(ok) { ok ? state.correct++ : state.wrong++; save(); },
  setBest(cat, score) { if ((state.quizBest[cat] ?? -1) < score) { state.quizBest[cat] = score; save(); return true; } return false; },
  unlock(level) { if (!state.unlocked.includes(level)) { state.unlocked.push(level); save(); return true; } return false; },
  isUnlocked: level => state.unlocked.includes(level),
  setSound(on) { state.sound = on; save(); },
  setPets(on) { state.pets = on; save(); },
  streakAlive() {
    const y = new Date(Date.now() - 864e5).toLocaleDateString('en-CA');
    return state.streak.last === today() || state.streak.last === y ? state.streak.count : 0;
  },
};
