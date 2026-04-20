# docs.resonatehq.io — Agent Orientation

> **Read `resonate/AGENT.md` first.** This is the public docs site. Voice = Echo. Treat docs as a product surface.

## What this is

The Resonate documentation site at https://docs.resonatehq.io. Docusaurus-based. Deployed automatically to Vercel on push to `main`.

This repo's own git history. Pushed to `resonatehq/docs.resonatehq.io` on GitHub.

## Status

**Stalled relative to the new architecture.** No updates reflecting the new Go server, formal protocol spec, JWT auth, or the v0.10.0 SDK rewrite. Current docs describe the legacy generation. Updating this is a **known active priority** — see `docs/board/PRIORITIES.md` (Zone 1) for the current phasing.

## Stack

| | |
|---|---|
| Framework | Docusaurus (TypeScript config) |
| Package mgr | yarn (`yarn.lock` present — yarn is canonical here, not npm) |
| Build | `yarn build` |
| Linter | Docusaurus defaults |
| Deploy | Vercel via `vercel.json` |
| License | Apache-2.0 |

## Key paths

| Path | Contents |
|---|---|
| `docs/` | All documentation Markdown content |
| `src/` | Custom React components, theme overrides, css |
| `static/` | Static assets (images, downloads, banners) |
| `docusaurus.config.ts` | Site config — nav, footer, plugins, theme |
| `babel.config.js` | Babel for Docusaurus build |
| `vercel.json` | Vercel deploy config |
| `CONTRIBUTING.md` | Contribution rules |

## Run

```bash
yarn                # install
yarn start          # local dev server (Cully runs this himself — don't auto-start)
yarn build          # production build → build/
yarn serve          # serve built output
yarn clear          # clear Docusaurus cache
```

**Use yarn, not npm.** The lockfile is `yarn.lock`. Mixing package managers will break things.

## Deploy

**Vercel auto-deploy on push to `main`.** Preview deploys on PRs.

- **Approver:** auto deploy, but PRs need review
- **Build badge:** the README shows `deploy-badge.vercel.app/?url=https://docs.resonatehq.io/`
- **Rollback:** Vercel dashboard

Full procedure: `docs/protocols/DEPLOYMENT.md`.

## Rules

1. **Voice = Echo.** Technical, precise, friendly but not casual. Read `docs/shared/IDENTITY.md` before writing.
2. **Code samples must run against the current SDK.** Stale snippets are the #1 doc bug. When you change a snippet, run it locally against the SDK or note the SDK version it targets.
3. **Don't ship docs for unreleased APIs** unless you mark them clearly as experimental/preview.
4. **Yarn, not npm.** Don't introduce a `package-lock.json`.
5. **Open a PR, don't push to `main` directly.** Vercel previews make review trivial.
6. **Big architecture changes (new server, new protocol, JWT auth, v0.10.0 SDK) need a coordinated docs sweep, not piecemeal edits.** Talk to Cully before starting one.
7. **Don't name competitors.** Same workspace rule as the marketing site.

## Architecture notes

- Content is Markdown + MDX in `docs/`. Docusaurus auto-generates the sidebar from filenames unless overridden.
- Custom React components for code samples, callouts, and diagrams live in `src/components/`.
- The theme is a light Docusaurus customization — don't fork the theme; override via swizzle if you need custom behavior.
- Search is hosted (Algolia or similar — check `docusaurus.config.ts`).

## Known gaps (as of 2026-04-07)

- New Go server is undocumented
- v0.10.0 SDK (`next` branch) APIs are undocumented
- JWT auth flow is undocumented
- Formal protocol spec link-out is missing
- Migration guide from v0.9.x → v0.10.x does not exist

These are scoped work, not casual edits. Coordinate before tackling.
