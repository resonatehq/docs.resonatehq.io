import { NextResponse } from "next/server";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

function walkMdx(dir: string): string[] {
  const files: string[] = [];
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

function extractFrontmatter(content: string): { title: string; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { title: "", body: content };
  const fm = match[1];
  const title = fm.match(/^title:\s*(.+)$/m)?.[1]?.trim() ?? "";
  const body = content.slice(match[0].length).trim();
  return { title, body };
}

// Strip JSX/MDX component tags while preserving code blocks verbatim.
// Code such as Rust generics (WorkflowResult<Vec<String>>) would otherwise be
// mangled by the tag regex, so we protect code spans first, then restore them.
function stripJsx(content: string): string {
  const code: string[] = [];
  const protected_ = content.replace(
    /```[\s\S]*?```|`[^`\n]*`/g,
    (m) => `\x00CODE${code.push(m) - 1}\x00`
  );

  const stripped = protected_
    .replace(
      /<SeeItInAction\s+repo="([^"]+)"(?:\s+href="([^"]+)")?\s*\/>/g,
      (_m, repo: string, href: string) =>
        `See it in action: [${repo}](${href ?? `https://github.com/resonatehq-examples/${repo}`})`
    )
    .replace(/<\/?[A-Z][A-Za-z]*[^>]*>/g, "")
    .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, "");

  return stripped
    .replace(/\x00CODE(\d+)\x00/g, (_m, i) => code[Number(i)])
    .trim();
}

export function GET() {
  const contentDir = join(process.cwd(), "content/docs");
  const files = walkMdx(contentDir).sort();

  const sections = files.map((f) => {
    const rel = relative(contentDir, f).replace(/\.mdx$/, "").replace(/\/index$/, "");
    const url = rel
      ? `https://docs.resonatehq.io/${rel}`
      : "https://docs.resonatehq.io";
    const { title, body } = extractFrontmatter(readFileSync(f, "utf-8"));
    const cleaned = stripJsx(body);
    return `---\nurl: ${url}\ntitle: ${title || rel}\n---\n\n${cleaned}`;
  });

  const content = `# Resonate Documentation — Full Content\n\n${sections.join("\n\n---\n\n")}\n`;

  return new NextResponse(content, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
