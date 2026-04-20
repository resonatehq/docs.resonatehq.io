import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface CardProps {
  title: string;
  description?: string;
  href: string;
  icon?: ReactNode;
}

export function Card({ title, description, href, icon }: CardProps) {
  return (
    <a
      href={href}
      className="group block p-5 border border-primary/10 hover:border-secondary/30 bg-surface-elevated hover:bg-surface-subtle transition"
    >
      <div className="flex items-start justify-between">
        <div>
          {icon && <div className="text-secondary mb-2">{icon}</div>}
          <h3 className="font-display text-sm font-semibold text-white group-hover:text-secondary transition">
            {title}
          </h3>
          {description && (
            <p className="font-serif text-sm text-muted mt-1">{description}</p>
          )}
        </div>
        <ArrowRight
          size={14}
          className="text-muted group-hover:text-secondary transition mt-1 shrink-0"
        />
      </div>
    </a>
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6 not-prose">
      {children}
    </div>
  );
}
