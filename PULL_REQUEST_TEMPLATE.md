## Focus Timer Pro v2.1

This PR delivers a professional MV3 overhaul, a warm modern UI, session sounds, analytics groundwork, and an automated GitHub Action for packaging a Chrome Web Store ZIP.

### ✨ New
- Modular service worker with timer/blocking/analytics/notify modules
- Work/Short/Long sessions with auto-advance
- Offscreen audio for reliable sound notifications
- Warm aesthetic popup with KPI cards; improved UX
- Content overlay blocking during focus sessions
- Daily analytics persisted (events, sessions, breaks)
- CI: GitHub Actions builds a ready-to-upload Web Store ZIP on push

### 🧱 Structure
- manifest.json → MV3, modules, offscreen, alarms
- src/background/index.js, modules/
- src/popup/index.html, styles.css, main.js
- src/content/index.js
- src/offscreen/audio.html

### 🔧 Dev Notes
- No external build tool required; pure JS modules
- Add assets/icons PNGs (16/32/48/128) and assets/sounds (chime.mp3, ding.mp3)
- Load in Developer Mode; artifacts appear in Actions as focus-timer-pro.zip

### 🚀 Next (follow-up PRs)
- Dark theme + theme switcher
- Weekly/monthly charts in popup
- Chrome storage sync for settings/stats
- Per-site custom messages and redirect mode
- CSV export + keyboard shortcuts

---
Preview screenshots to be added once assets/icons exist; UI is operable today.
