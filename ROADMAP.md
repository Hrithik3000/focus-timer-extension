# v2 Roadmap & Pro Features

## What’s new in v2 (shipped)
- Modular MV3 codebase using service worker modules
- Work/Short/Long break cycles with auto-advance
- Offscreen audio for reliable sound notifications
- Warm professional UI with KPI cards and better layout
- Daily analytics events persisted to storage
- Overlay site blocking integrated with timer state

## Next up (you asked)
- Dark theme toggle (system-aware)
- Cloud sync via Chrome Storage Sync (no account needed)
- Custom redirect mode + motivational messages per site
- Weekly and monthly stats with charts
- Keyboard shortcuts (Start/Pause/Reset)
- Advanced schedules (e.g., school timetable slots)
- Session tagging (Subject: Maths/Science) and per-tag stats
- Export CSV of focus history
- Do-Not-Disturb mode to silence notifications during focus

## Structure
```
src/
  background/
    index.js
    modules/
      timer.js
      blocker.js
      analytics.js
      notify.js
      sync.js
  content/
    index.js
  offscreen/
    audio.html
  popup/
    index.html
    styles.css
    main.js
assets/
  icons/
  sounds/
```

## Contributing Guidelines (Pro style)
- Conventional commits: feat:, fix:, chore:, refactor:
- ESLint + Prettier (to be added)
- Unit tests for timer module (to be added)
- CI: Lint & package zip (to be added)
