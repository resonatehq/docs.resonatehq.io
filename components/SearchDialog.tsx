"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Search, X, FileText, Hash } from "lucide-react";
import { useDocsSearch } from "fumadocs-core/search/client";
import type { SortedResult } from "fumadocs-core/server";

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { search, setSearch, query } = useDocsSearch({
    type: "static",
    from: "/api/search",
  });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setSearch("");
    }
  }, [open, setSearch]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-muted border border-primary/10 hover:border-secondary/30 transition focus-visible:outline-2 focus-visible:outline-secondary"
        aria-label="Search documentation"
      >
        <Search size={14} />
        <span>Search</span>
        <kbd className="ml-2 text-xs text-muted/60 font-mono">⌘K</kbd>
      </button>
    );
  }

  const results: SortedResult[] =
    query.data && query.data !== "empty" ? query.data : [];

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        className="fixed inset-x-0 top-[15vh] z-50 mx-auto max-w-lg px-4"
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
      >
        <div className="bg-surface-light dark:bg-surface-elevated border border-primary/10 shadow-lg">
          <div className="flex items-center border-b border-primary/10 px-4">
            <Search size={16} className="text-muted shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search documentation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent px-3 py-3 text-sm text-bright-gray-900 dark:text-primary outline-none placeholder:text-muted"
            />
            <button
              onClick={() => setOpen(false)}
              className="p-1 text-muted hover:text-bright-gray-900 dark:hover:text-primary transition"
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-[50vh] overflow-y-auto p-2">
            {search.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-muted">
                Start typing to search...
              </p>
            )}

            {search.length > 0 && query.isLoading && (
              <p className="px-3 py-6 text-center text-sm text-muted">
                Searching...
              </p>
            )}

            {search.length > 0 && !query.isLoading && results.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-muted">
                No results for &ldquo;{search}&rdquo;
              </p>
            )}

            {results.map((hit) => (
              <Link
                key={hit.id}
                href={hit.url}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-3 py-2.5 hover:bg-bright-gray-50 dark:hover:bg-surface-subtle transition text-sm"
              >
                {hit.type === "page" ? (
                  <FileText size={14} className="text-muted mt-0.5 shrink-0" />
                ) : (
                  <Hash size={14} className="text-muted mt-0.5 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-bright-gray-900 dark:text-primary truncate">
                    {hit.content}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
