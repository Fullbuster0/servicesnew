## Services Repo
<!-- AUTO-UPDATE-TIMESTAMP --> Last run: 2026-08-30 04:00:44
Last run: never

---

### servicesnew — modernized UI/UX

This repo is a clone of `services` carrying a full front-end redesign
("Aurora Glass"). Content, routing, data sources and the governance bridge are
unchanged; everything that differs is presentation.

Redesigned surfaces: navbar, hero, chain cards, tab strip, search, footer,
docs pages (`/mainnets`, `/testnets`, per-chain docs) and the relayers page.
New design-token layer (`--sz-*`) in `src/css/custom.css`, plus a docs-specific
surface layer in `src/css/docs-surface.css`.

Verified against a local production build: 55 route/viewport combinations,
0 horizontal overflow, 0 text below 11.4px, 0 sub-32px tap targets,
0 console errors, 60fps median on animated routes, and WCAG AA contrast on
both themes.

Note: the hourly governance bridge cron still targets the original `services`
checkout, so generated files here (`<chain>/upgrade.md`, `static/data/*.json`)
do not auto-refresh in this repo.
