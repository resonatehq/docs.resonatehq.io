"use client";

import { useState } from "react";
import { ChevronRight, PanelLeftClose, PanelLeft } from "lucide-react";
import type { PageTree } from "fumadocs-core/server";

interface SidebarProps {
  tree: PageTree.Root;
  currentPath: string;
}

function SidebarNode({
  node,
  currentPath,
  depth = 0,
}: {
  node: PageTree.Node;
  currentPath: string;
  depth?: number;
}) {
  const [open, setOpen] = useState(() => {
    if (node.type === "folder") {
      return isAncestor(node, currentPath);
    }
    return false;
  });

  if (node.type === "separator") {
    return (
      <div className="pt-6 pb-2 first:pt-0">
        <span className="text-xs font-display font-semibold uppercase tracking-wider text-muted">
          {node.name}
        </span>
      </div>
    );
  }

  if (node.type === "page") {
    const isActive = node.url === currentPath;
    return (
      <a
        href={node.url}
        className={`block py-1.5 text-sm transition-colors ${
          depth > 0 ? "pl-4" : ""
        } ${
          isActive
            ? "text-secondary font-medium"
            : "text-muted hover:text-primary"
        }`}
      >
        {node.name}
      </a>
    );
  }

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center justify-between w-full py-1.5 text-sm text-left transition-colors ${
            depth > 0 ? "pl-4" : ""
          } ${
            isAncestor(node, currentPath)
              ? "text-primary font-medium"
              : "text-muted hover:text-primary"
          }`}
        >
          <span>{node.name}</span>
          <ChevronRight
            size={14}
            className={`transition-transform ${open ? "rotate-90" : ""}`}
          />
        </button>
        {open && (
          <div className="ml-2 border-l border-primary/10 pl-2">
            {node.children.map((child, i) => (
              <SidebarNode
                key={`${child.type}-${i}`}
                node={child}
                currentPath={currentPath}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}

function isAncestor(node: PageTree.Node, path: string): boolean {
  if (node.type === "page") return node.url === path;
  if (node.type === "folder") {
    if (node.index?.url === path) return true;
    return node.children.some((child) => isAncestor(child, path));
  }
  return false;
}

export default function Sidebar({ tree, currentPath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed bottom-4 left-4 z-50 p-3 bg-surface-elevated border border-primary/10 text-primary hover:text-secondary transition"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
      </button>

      <aside
        className={`${
          collapsed ? "hidden" : "block"
        } lg:block w-64 shrink-0 border-r border-primary/10 overflow-y-auto h-[calc(100vh-65px)] sticky top-[65px] py-6 px-4`}
      >
        {tree.children.map((node, i) => (
          <SidebarNode key={`${node.type}-${i}`} node={node} currentPath={currentPath} />
        ))}
      </aside>
    </>
  );
}
