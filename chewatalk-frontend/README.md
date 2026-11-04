# ChewaTalk frontend

A static site with no build step for learning Nyanja (Chichewa): flashcards, quizzes, a matching game and a phrasebook. The look matches gabrielerzah.com: ivory paper, ink, vermilion, condensed display type and print grain, with poster art for each level.

## Run it

```sh
python3 -m http.server 8790 --directory chewatalk-frontend
```

Open http://localhost:8790. The data is loaded with `fetch`, so the site needs a server; opening `index.html` straight from disk won't work.

## Layout

| Path | What |
| --- | --- |
| `index.html` | Page shell: masthead, HUD (streak, XP, sound) and the FX layers |
| `css/style.css` | All styling, including the poster art for each level and the responsive rules |
| `js/app.js` | Hash router and the views: home, level, flashcards, quiz, match, phrasebook |
| `js/fx.js` | Confetti, XP floaters, toast, custom cursor, tilt, scroll reveal, WebAudio blips |
| `js/mascots.js` | The mascots, Nkwazi the eagle and Goggles the dog: hand-drawn SVG with moods (idle, happy, sad, cheer, think) and a `react()` helper |
| `js/pets.js` | Side-view sprites (galloping Goggles, flying Nkwazi) and the layer that sends them across the screen now and then |
| `js/store.js` | Progress (XP, streak, learned words, quiz bests, unlocks), kept in `localStorage` |
| `data/vocab.json` | Generated vocabulary. Don't edit it by hand |
| `tools/build_vocab.py` | Source of truth for phrases and translations. Run it to regenerate the JSON |

## Translation rules

These follow the project README: **never invent Nyanja.**

- The English phrases come from *ChewaTalk English Phrase List* (levels 1–5).
- Nyanja is filled in only where *Peace Corps/Zambia PST 1995 Special Lessons: Nyanja* gives it, with the page number. Spelling is kept as printed. That document writes `c` where newer spelling often uses `ch` (cakudya → chakudya).
- `status` is one of:
  - `verified`: from the source.
  - `review`: the scan is unclear or the source looks like it has a typo. Shown in the phrasebook, kept out of quizzes.
  - `pending`: no translation yet.
- To add a checked translation, put an entry in `T` (curriculum) or `KIT` in `tools/build_vocab.py`, then run `python3 tools/build_vocab.py`.

## Progress and unlocks

Level 1 is open from the start. Each later level unlocks once 60% of the previous level's verified words are learned. A word counts as learned when it's marked "Got it", answered correctly or matched. Each level page also has a "jump ahead" link. Progress stays in the browser until the FastAPI progress endpoints in `chewatalk-backend` exist. `store.js` keeps the same fields the README lists, so moving it to the API later should be straightforward.

## Mascots

- **Nkwazi** (a fish eagle carrying a fish) coaches levels 1–5 and is the logo. The name comes from the national anthem line *"Monga nkwazi m'mwamba"* (source p.10).
- **Goggles** (the Airedale in an aviator cap) coaches the survival kit and shows up on empty and not-found pages.

Both react to answers: they hop on a correct one, droop on a wrong one and cheer on a combo or at the end of a round. You can also poke them. Their speech bubbles use only verified phrases (Bwanji?, Fikani!, Bwino bwino!, Inde!, Pepani, Bwerezanso, Pang'ono pang'ono, Zikomo!).

### Pets

About 6–10 seconds after the page loads, and then every 30–70 seconds, one pet crosses the screen: Goggles gallops along the bottom with a scarf flying, or Nkwazi flies over with the fish. Both run out together when you finish a deck, a quiz at 70% or more, or a match game. Click a pet as it passes to make it hop and say something. The paw button in the header turns pets on or off (the setting is saved), and pets never run when reduced motion is on.
