"use client";

import { useEffect, useState } from "react";
import type { TableOfContents as TOCType } from "fumadocs-core/server";

interface TOCProps {
  toc: TOCType;
}

export default function TableOfContents({ toc }: TOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    for (const item of toc) {
      const el = document.getElementById(item.url.slice(1));
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <div className="w-48 shrink-0 hidden xl:block">
      <div className="sticky top-[89px] py-6">
        <p className="text-xs font-display font-semibold uppercase tracking-wider text-muted mb-3">
          On this page
        </p>
        <ul className="space-y-1.5">
          {toc.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                className={`block text-xs leading-relaxed transition-colors ${
                  item.depth > 2 ? "pl-3" : ""
                } ${
                  activeId === item.url.slice(1)
                    ? "text-secondary"
                    : "text-muted hover:text-primary"
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
