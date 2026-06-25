import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      // Override the on-page H1 when set; falls back to `title` (which is also
      // used for the sidebar label). Lets a page like the docs root display
      // "Home" in the sidebar but render a different headline.
      pageTitle: z.string().optional(),
      // Skip the auto-rendered H1 when the MDX body provides its own headline.
      hideTitle: z.boolean().optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      // Emit only CSS custom properties (--shiki-light / --shiki-dark) instead
      // of also baking the light color into an inline `color` style. The inline
      // color has higher specificity than `.dark pre code span` and would win
      // in dark mode, leaving tokens like function args near-black on dark bg.
      defaultColor: false,
      // Shiki bakes the language into inline styles and drops the
      // `language-x` class, so the code-block chrome had no way to label an
      // untitled block and fell back to a meaningless "code". Stamp the
      // language onto the <pre> as `data-language` so CodeBlock can show it.
      transformers: [
        {
          name: "stamp-language",
          pre(node) {
            const lang = this.options.lang;
            if (lang && lang !== "plaintext") {
              node.properties["data-language"] = lang;
            }
          },
        },
      ],
    },
  },
});
