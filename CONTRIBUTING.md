# Contribute to Resonate documentation

Open a GitHub issue before submitting a pull request for non-trivial changes. Join the `#resonate-engineering` channel in the [Community Discord](https://www.resonatehq.io/discord) to discuss.

## Stack

This site is built with **[Next.js 15](https://nextjs.org/)** + **[fumadocs](https://fumadocs.dev/)**. Content lives as MDX under [`content/docs/`](./content/docs/) and is root-routed — `content/docs/get-started/quickstart.mdx` resolves to `https://docs.resonatehq.io/get-started/quickstart`. Deployed to Vercel on push to `main`.

The package manager is **npm**. The canonical lockfile is `package-lock.json`. Don't reintroduce `yarn.lock` — mixing managers will drift the dep tree.

## Run locally

Install dependencies:

```shell
npm install
```

Run the development server:

```shell
npm run dev
```

Before opening a PR, run a production build:

```shell
npm run build
```

`npm run build` runs `next build`, regenerates `public/llms.txt` + `public/llms-full.txt`, then runs the link checker as a postbuild step.

## Authoring rules

- **Open a PR — don't push to `main`.**
- **Voice is Echo:** technical, precise, friendly but not casual. Match the tone of existing pages.
- **Code samples must run against the current SDK.** Stale snippets are the #1 doc bug. When you change a snippet, run it against the SDK or note the version it targets.
- **Don't ship docs for unreleased APIs** unless they're clearly marked experimental/preview.
- **Preserve old URLs.** When you move or rename a page, add a redirect rule to [`vercel.json`](./vercel.json). Old Docusaurus `/docs/*` paths and `/operate/*` paths are already covered.
- **Don't name competitors** in marketing-style copy. The `/evaluate/coming-from/{temporal,restate,dbos}.mdx` pages are the deliberate exception — those exist to help users coming from those tools.
- **Big architecture sweeps need coordination.** New server, new protocol, JWT auth, major SDK rev — open a discussion first.

## Code blocks

Every fenced code block renders with a small chrome row above it (filename · language). The language label comes from the fence; `title="..."` overrides it as the primary label.

```` markdown
```typescript
// chrome shows: typescript
const x = 1;
```

```typescript title="src/agent.ts"
// chrome shows: src/agent.ts · typescript
const x = 1;
```
````

Use `title="..."` for any block where the file path or context isn't obvious from surrounding prose (config files, multi-step deployment commands, snippets that span more than a screen). Skip it for one-liners and shell snippets where the language label is enough.

## Link checking

`npm run build` runs [`linkinator`](https://github.com/JustinBeckwith/linkinator) against the production build via the `postbuild` step ([`scripts/check-links.mjs`](./scripts/check-links.mjs)). Broken internal links — including missing anchors — fail the build. External hosts (GitHub, Discord, X, etc.) are skipped, since they rot independently of this repo.

The check is automatically skipped on Vercel (`process.env.VERCEL`), since Vercel's build sandbox can't run `next start` mid-build. Run it locally before opening a PR, and rely on GitHub Actions to gate merges.

To run the check on its own against an already-built `.next/`:

```shell
npm run check-links
```
