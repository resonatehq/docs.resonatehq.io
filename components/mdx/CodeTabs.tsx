"use client";

import { useState, type ReactNode } from "react";

interface CodeTabsProps {
  children: ReactNode;
  labels?: string[];
  defaultValue?: string;
}

interface TabItemProps {
  label: string;
  value?: string;
  children: ReactNode;
}

export function CodeTabs({ children, labels, defaultValue }: CodeTabsProps) {
  const items = Array.isArray(children) ? children : [children];
  const tabLabels = labels || items.map((child: any, i: number) => child?.props?.label || `Tab ${i + 1}`);
  const [active, setActive] = useState(defaultValue || tabLabels[0]);

  return (
    <div className="my-4 border border-primary/10">
      <div className="flex border-b border-primary/10 bg-surface-elevated">
        {tabLabels.map((label: string) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`px-4 py-2 text-sm font-mono transition-colors ${
              active === label
                ? "text-secondary border-b-2 border-secondary -mb-px"
                : "text-muted hover:text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div>
        {items.map((child: any, i: number) => {
          const label = child?.props?.label || tabLabels[i];
          return (
            <div key={label} className={active === label ? "block" : "hidden"}>
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TabItem({ children }: TabItemProps) {
  return <div>{children}</div>;
}
