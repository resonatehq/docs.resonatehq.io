"use client";

import { useState, type ReactNode, type ReactElement } from "react";

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

function getLabel(child: ReactElement<TabItemProps>, index: number): string {
  return child?.props?.label || `Tab ${index + 1}`;
}

export function CodeTabs({ children, labels, defaultValue }: CodeTabsProps) {
  const items = (Array.isArray(children) ? children : [children]) as ReactElement<TabItemProps>[];
  const tabLabels = labels || items.map((child, i) => getLabel(child, i));
  const [active, setActive] = useState(defaultValue || tabLabels[0]);

  return (
    <div className="my-4 border border-primary/10">
      <div className="flex border-b border-primary/10 bg-bright-gray-50 dark:bg-surface-elevated" role="tablist">
        {tabLabels.map((label: string) => (
          <button
            key={label}
            role="tab"
            aria-selected={active === label}
            onClick={() => setActive(label)}
            className={`px-4 py-2 text-sm font-mono transition-colors focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-[-2px] ${
              active === label
                ? "text-secondary border-b-2 border-secondary -mb-px"
                : "text-muted hover:text-bright-gray-900 dark:hover:text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div>
        {items.map((child, i) => {
          const label = getLabel(child, i);
          return (
            <div key={label} role="tabpanel" className={active === label ? "block" : "hidden"}>
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
