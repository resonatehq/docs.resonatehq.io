"use client";

import { isValidElement, useRef, type HTMLAttributes, type ReactNode } from "react";
import CopyButton from "./CopyButton";

interface PreProps extends HTMLAttributes<HTMLPreElement> {
  children?: ReactNode;
  title?: string;
  "data-title"?: string;
  "data-language"?: string;
}

// A migration guide titles its code blocks `System — path/to/file` (e.g.
// `Resonate — example-hello-world-py/main.py`). Split that into a system
// label and a filename so the header can badge the system and show the file
// cleanly, instead of cramming both onto a bold line above an unlabeled block.
const TITLE_SEPARATOR = " — ";

function parseTitle(title: string): { system: string | null; file: string } {
  const i = title.indexOf(TITLE_SEPARATOR);
  if (i === -1) return { system: null, file: title };
  return { system: title.slice(0, i), file: title.slice(i + TITLE_SEPARATOR.length) };
}

const LANGUAGE_LABELS: Record<string, string> = {
  bash: "bash",
  c: "c",
  cpp: "c++",
  css: "css",
  diff: "diff",
  go: "go",
  graphql: "graphql",
  html: "html",
  java: "java",
  javascript: "javascript",
  js: "javascript",
  json: "json",
  jsx: "jsx",
  kotlin: "kotlin",
  md: "markdown",
  markdown: "markdown",
  mdx: "mdx",
  plaintext: "text",
  py: "python",
  python: "python",
  rs: "rust",
  rust: "rust",
  sh: "shell",
  shell: "shell",
  sql: "sql",
  swift: "swift",
  ts: "typescript",
  tsx: "tsx",
  toml: "toml",
  typescript: "typescript",
  yaml: "yaml",
  yml: "yaml",
};

// Shiki bakes the language into inline styles and drops the `language-X`
// class, so prefer the `data-language` stamped on the <pre> by our rehype
// transformer; fall back to the legacy class on the inner <code> just in case.
function extractLanguage(children: ReactNode, dataLanguage?: string): string | null {
  if (dataLanguage) return dataLanguage;
  if (!isValidElement(children)) return null;
  const className = (children.props as { className?: string })?.className ?? "";
  const match = className.match(/language-([a-zA-Z0-9_+-]+)/);
  return match ? match[1] : null;
}

export function Pre({
  children,
  title,
  "data-title": dataTitle,
  "data-language": dataLanguage,
  ...props
}: PreProps) {
  const ref = useRef<HTMLDivElement>(null);
  const displayTitle = title || dataTitle;
  const lang = extractLanguage(children, dataLanguage);
  const langLabel = lang ? (LANGUAGE_LABELS[lang.toLowerCase()] ?? lang.toLowerCase()) : null;
  const { system, file } = displayTitle
    ? parseTitle(displayTitle)
    : { system: null, file: null };
  const isResonate = system?.toLowerCase() === "resonate";

  return (
    <div className="group relative [&:not(:first-child)]:mt-4 last:mb-0">
      <div className="flex items-center justify-between gap-3 px-4 py-2 text-xs font-mono border border-b-0 border-bright-gray-200 dark:border-primary/10 bg-bright-gray-100 dark:bg-surface-subtle">
        <div className="flex items-center gap-2 min-w-0">
          {displayTitle ? (
            <>
              {system && (
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    isResonate
                      ? "bg-secondary/15 text-accent-teal-700 dark:text-secondary"
                      : "bg-bright-gray-200/80 text-bright-gray-600 dark:bg-primary/10 dark:text-fg-muted"
                  }`}
                >
                  {system}
                </span>
              )}
              <span className="truncate text-bright-gray-900 dark:text-primary">{file}</span>
              {langLabel && <span className="shrink-0 text-fg-muted/60">·</span>}
              {langLabel && <span className="shrink-0 text-fg-muted">{langLabel}</span>}
            </>
          ) : (
            <span className="text-fg-muted">{langLabel ?? "code"}</span>
          )}
        </div>
      </div>
      <div ref={ref} className="relative">
        <pre {...props} className={`${props.className || ""} !mt-0 !border-t-0`}>
          {children}
        </pre>
        <CopyButton containerRef={ref} />
      </div>
    </div>
  );
}
