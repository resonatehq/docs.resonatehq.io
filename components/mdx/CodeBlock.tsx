"use client";

import { useRef, type ReactNode, type HTMLAttributes } from "react";
import CopyButton from "./CopyButton";

interface PreProps extends HTMLAttributes<HTMLPreElement> {
  children?: ReactNode;
  title?: string;
  "data-title"?: string;
}

export function Pre({ children, title, "data-title": dataTitle, ...props }: PreProps) {
  const ref = useRef<HTMLDivElement>(null);
  const displayTitle = title || dataTitle;

  return (
    <div className="group relative not-first:mt-4 last:mb-0">
      {displayTitle && (
        <div className="px-4 py-2 text-xs font-mono text-muted border border-b-0 border-bright-gray-200 dark:border-primary/10 bg-bright-gray-100 dark:bg-surface-elevated">
          {displayTitle}
        </div>
      )}
      <div ref={ref} className="relative">
        <pre {...props} className={`${props.className || ""} ${displayTitle ? "!mt-0 !border-t-0" : ""}`}>
          {children}
        </pre>
        <CopyButton containerRef={ref} />
      </div>
    </div>
  );
}
