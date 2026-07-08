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

function extractFrontmatter(content: string): { title: string; description: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { title: "", description: "" };
  const fm = match[1];
  const title = fm.match(/^title:\s*(.+)$/m)?.[1]?.trim() ?? "";
  const description = fm.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? "";
  return { title, description };
}

export function GET() {
  const contentDir = join(process.cwd(), "content/docs");
  const files = walkMdx(contentDir).sort();

  const lines = files.map((f) => {
    const rel = relative(contentDir, f).replace(/\.mdx$/, "").replace(/\/index$/, "");
    const url = rel
      ? `https://docs.resonatehq.io/${rel}`
      : "https://docs.resonatehq.io";
    const { title, description } = extractFrontmatter(readFileSync(f, "utf-8"));
    const desc = description ? `: ${description}` : "";
    return `- [${title || rel}](${url})${desc}`;
  });

  const body = [
    "# Resonate Documentation",
    "",
    "> Resonate — durable execution, dead simple. Build agents, workflows, pipelines,",
    "> and services without thinking about retries or recovery.",
    "",
    "## Docs Pages",
    "",
    ...lines,
    "",
    "## External References",
    "",
    "- [Distributed Async Await Specification](https://www.distributed-async-await.io/spec): The formal, language-agnostic protocol specification that Resonate implements.",
  ].join("\n");

  return new NextResponse(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
