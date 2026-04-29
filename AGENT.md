# docs.resonatehq.io — Agent Orientation

> **Read `resonate/AGENT.md` first.** This is the public docs site. Voice = Echo. Treat docs as a product surface.

## What this is

The Resonate documentation site at https://docs.resonatehq.io. **Next.js + fumadocs**, post-Docusaurus migration (PR #177, merged 2026-04-28). Deployed automatically to Vercel on push to `main`.

This repo's own git history. Pushed to `resonatehq/docs.resonatehq.io` on GitHub.

## Status

Migration complete. Three of the five pre-migration "known gaps" are now closed:

| Gap | Status |
|---|---|
| New Rust server undocumented | ✅ Closed — `/deploy/run-server` describes the Rust server and `cargo build --release` |
| v0.10.0 SDK APIs undocumented | ✅ TS at v0.10.1 with `.resolve()`/`.reject()`/`.cancel()` (no `.settle()` references in `content/docs/`) |
| JWT auth flow undocumented | ✅ Closed — `/deploy/security` covers `[auth]` config + Ed25519 keygen + TS+Rust client wiring |
| Formal protocol spec link-out | ⚠ Still missing on `/evaluate/how-it-works` |
| v0.9.x → v0.10.x migration guide | ⚠ Still missing |

Other live drift: **Python SDK page (`content/docs/develop/python.mdx`) still framed as "legacy server only, support for v0.9.x coming"** — but the live server is v0.10-era Rust. The Python SDK is genuinely stalled; the framing needs an update, not the gating.

## Stack

| | |
|---|---|
| Framework | **Next.js 15** + **fumadocs-core** + **fumadocs-mdx** |
| Routing | Root-routed (`/get-started/...`, not `/docs/get-started/...`). 26+ redirect rules in `vercel.json` preserve old Docusaurus paths |
| Package mgr | **npm** (`package-lock.json` is canonical — yarn era is over, don't reintroduce `yarn.lock`) |
| Build | `npm run build` (runs `next build` + regenerates `public/llms.txt` + `public/llms-full.txt` via `scripts/generate-llms-txt.mjs`) |
| Postbuild | `scripts/check-links.mjs` runs linkinator over the build output |
| Search | **Orama** keyword nav (`⌘K` "Jump to..."), no Algolia |
| Code highlighting | **Shiki** (`@shikijs/rehype`, themes: github-light + github-dark) |
| Styling | Tailwind 3 + shared `resonate-preset.ts` with the marketing site |
| Linter | `next lint` |
| Deploy | Vercel via `vercel.json` |
| License | Apache-2.0 |

## Key paths

| Path | Contents |
|---|---|
| `content/docs/` | All documentation MDX content (root-routed: `content/docs/get-started/quickstart.mdx` → `https://docs.resonatehq.io/get-started/quickstart`) |
| `app/[[...slug]]/page.tsx` | Catch-all docs route renderer |
| `app/api/`, `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx` | Next.js app router surfaces |
| `lib/source.ts` | fumadocs source loader (`baseUrl: "/"` — this is what makes the site root-routed) |
| `source.config.ts` | fumadocs MDX config (frontmatter schema, rehype/shiki options) |
| `next.config.mjs` | Next config (wraps `createMDX()` from fumadocs-mdx) |
| `vercel.json` | Redirect rules + security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) |
| `scripts/generate-llms-txt.mjs` | Generates `public/llms.txt` and `public/llms-full.txt` at build time |
| `scripts/check-links.mjs` | linkinator wrapper used by `postbuild` |
| `components/` | Custom React components used in the layout/theme |
| `resonate-preset.ts` | Shared design tokens with the marketing site |
| `public/` | Static assets (banners, downloads); regenerated llms files land here |
| `CONTRIBUTING.md` | Contribution rules |

## Run

```bash
npm install         # install
npm run dev         # local dev server (Cully runs this himself — don't auto-start)
npm run build       # production build → .next/, plus regenerated public/llms*.txt
npm start           # serve built output
```

**Use npm, not yarn.** The canonical lockfile is `package-lock.json`. A stray `yarn.lock` from the Docusaurus era exists in `.gitignore` and should not be committed — mixing package managers will drift the dep tree.

## Deploy

**Vercel auto-deploy on push to `main`.** Preview deploys on PRs.

- **Approver:** auto deploy, but PRs need review
- **Rollback:** Vercel dashboard

## Rules

1. **Voice = Echo.** Technical, precise, friendly but not casual. Match the tone of existing pages.
2. **Code samples must run against the current SDK.** Stale snippets are the #1 doc bug. When you change a snippet, run it locally against the SDK or note the SDK version it targets. Echo's corrections layer can patch known drift but the doc should be right first.
3. **Don't ship docs for unreleased APIs** unless you mark them clearly as experimental/preview.
4. **npm, not yarn.** The canonical lockfile is `package-lock.json`. Don't reintroduce a tracked `yarn.lock`.
5. **Open a PR, don't push to `main` directly.** Vercel previews make review trivial.
6. **Coordinated docs sweeps for big architecture changes.** New server, new protocol, JWT auth, v0.10.0 SDK — talk to Cully before starting one.
7. **Don't name competitors** in the marketing-style copy. Note: the `/evaluate/coming-from/{temporal,restate,dbos}.mdx` pages are the deliberate exception — those exist to help users coming from those tools and naming them is the point.
8. **Preserve old URLs.** When you move or rename a page, add a redirect rule to `vercel.json`. Old Docusaurus `/docs/*` paths and `/operate/*` paths are already covered; check before renaming anything that's been live.

## Architecture notes

- Content is Markdown + MDX in `content/docs/`. fumadocs auto-generates the sidebar from the file tree; override via `meta.json` files in each section.
- Root routing: `lib/source.ts` sets `baseUrl: "/"`. Files at `content/docs/foo/bar.mdx` resolve to `https://docs.resonatehq.io/foo/bar`. The 26 redirect rules in `vercel.json` preserve old paths.
- Custom components for code samples, callouts, and diagrams live in `components/`.
- Theme is a fumadocs customization sharing tokens with the marketing site via `resonate-preset.ts`.
- Search is **Orama**, configured via fumadocs. No external service.
- `llms.txt` and `llms-full.txt` are regenerated on every build by `scripts/generate-llms-txt.mjs`; don't hand-edit them.

## Known gaps (as of 2026-04-28)

- **No v0.9.x → v0.10.x SDK migration guide** — write `content/docs/develop/migrations/typescript-v0.10.mdx`. Echo's corrections layer is patching the API rename for now, but a real migration page is the right home.
- **`/evaluate/how-it-works` doesn't link to a formal protocol spec** — needs an outbound link to the `resonatehq/resonate-protocol` JSON Schema or the server-specification repo.
- **Python SDK page framing is stale** — says "support for v0.9.x server coming," but the v0.10-era Rust server is what's live. The SDK is still on the legacy server protocol; the framing should reflect that gap clearly without implying v0.9 is the target.
- **Rust server lacks an "evaluate vs legacy" comparison page** — Echo can't surface the new-vs-legacy distinction when asked. `/deploy/run-server` describes the new server in isolation; a positioning page (or a section in `/evaluate/`) would close the retrieval gap.

These are scoped work, not casual edits. Coordinate before tackling.
