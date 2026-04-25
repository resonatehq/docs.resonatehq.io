# Contribute to Resonate documentation

Open a Github Issue prior to submitting a Pull Request.

Join the #resonate-engineering channel in the [Community Discord](https://www.resonatehq.io/discord) to discuss your change.

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

**Follow these steps to view the website locally.**

Install dependencies:

```shell
yarn
```

Run the development server:

```shell
yarn start
```

**Before submitting a Pull Request, run a production build check.**

```shell
yarn build
```

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
