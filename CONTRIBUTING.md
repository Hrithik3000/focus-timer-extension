# Contributing

1. Fork → create branch: `feat/x`, `fix/x`
2. Commit with Conventional Commits (`feat: ...`, `fix: ...`)
3. `chrome://extensions` → Load unpacked for manual testing
4. Push & open PR. The CI will attach a ZIP artifact.

## Project Scripts
- none (pure JS modules). Linting and tests incoming.

## Style
- Use modern JS (no eval). Keep modules small and focused.
- Prefer async/await with try/catch around storage and messaging.
