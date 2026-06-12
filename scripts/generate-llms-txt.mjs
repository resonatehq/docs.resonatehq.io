/**
 * Generate llms.txt and llms-full.txt for AI/LLM consumption.
 * Replaces the docusaurus-plugin-llms functionality.
 * Run: node scripts/generate-llms-txt.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const CONTENT_DIR = "content/docs";
const PUBLIC_DIR = "public";

function walkMdx(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkMdx(full));
    } else if (entry.endsWith(".mdx")) {
      files.push(full);
    }
  }
  return files;
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { title: "", description: "", body: content };
  const fm = match[1];
  const title = fm.match(/^title:\s*(.+)$/m)?.[1]?.trim() || "";
  const description = fm.match(/^description:\s*(.+)$/m)?.[1]?.trim() || "";
  const body = content.slice(match[0].length).trim();
  return { title, description, body };
}

function stripProse(text) {
  // Remove JSX component tags but keep their text children. Only ever run on
  // prose segments — never on code (see stripJsx), or it would eat angle
  // brackets that are legitimate syntax (e.g. Rust generics).
  return text
    // Components that carry link content the LLM corpus needs must be expanded
    // to markdown BEFORE the generic tag strip below, or they vanish entirely.
    .replace(
      /<SeeItInAction\s+repo="([^"]+)"(?:\s+href="([^"]+)")?\s*\/>/g,
      (_m, repo, href) =>
        `See it in action: [${repo}](${href ?? `https://github.com/resonatehq-examples/${repo}`})`
    )
    .replace(/<\/?[A-Z][A-Za-z]*[^>]*>/g, "")
    .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, "");
}

function stripJsx(content) {
  // Strip JSX from prose while preserving code verbatim. Code such as Rust
  // generics — WorkflowResult<Vec<String>> or WorkflowContext<Self> — would
  // otherwise be mangled by the tag regex (anything matching <[A-Z]...> gets
  // deleted), corrupting the corpus.
  //
  // Replace every fenced code block (```...```) and inline code span (`...`)
  // with an opaque placeholder BEFORE running the JSX stripper, then restore
  // them after. Protecting code first (rather than splitting prose on code
  // boundaries) keeps JSX tags intact even when an attribute value itself
  // contains backticks — e.g. <Callout title="`localnet` requires ...">, which
  // a split-on-code approach would tear apart so the tag could no longer be
  // matched and stripped.
  const code = [];
  const protectedContent = content.replace(
    /```[\s\S]*?```|`[^`\n]*`/g,
    (match) => `\x00CODE${code.push(match) - 1}\x00`
  );
  return stripProse(protectedContent)
    .replace(/\x00CODE(\d+)\x00/g, (_m, i) => code[Number(i)])
    .trim();
}

const files = walkMdx(CONTENT_DIR).sort();

// llms.txt — index with titles and URLs
const index = files.map((f) => {
  const rel = relative(CONTENT_DIR, f).replace(/\.mdx$/, "").replace(/\/index$/, "");
  const url = `/${rel}`;
  const content = readFileSync(f, "utf-8");
  const { title, description } = extractFrontmatter(content);
  return `- [${title || rel}](${url})${description ? `: ${description}` : ""}`;
});

writeFileSync(
  join(PUBLIC_DIR, "llms.txt"),
  `# Resonate Documentation\n\n> Resonate — durable execution, dead simple.\n\n${index.join("\n")}\n`
);

// llms-full.txt — full content concatenated
const fullContent = files.map((f) => {
  const rel = relative(CONTENT_DIR, f).replace(/\.mdx$/, "").replace(/\/index$/, "");
  const url = `/${rel}`;
  const content = readFileSync(f, "utf-8");
  const { title, body } = extractFrontmatter(content);
  const cleaned = stripJsx(body);
  return `---\nurl: ${url}\ntitle: ${title || rel}\n---\n\n${cleaned}`;
});

writeFileSync(
  join(PUBLIC_DIR, "llms-full.txt"),
  `# Resonate Documentation — Full Content\n\n${fullContent.join("\n\n---\n\n")}\n`
);

console.log(`Generated llms.txt (${files.length} entries) and llms-full.txt`);
