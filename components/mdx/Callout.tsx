import { type ReactNode } from "react";
import { Info, Lightbulb, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

type CalloutType = "note" | "tip" | "info" | "caution" | "danger" | "differentiator";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const icons: Record<CalloutType, typeof Info> = {
  note: Info,
  tip: Lightbulb,
  info: Info,
  caution: AlertTriangle,
  danger: AlertCircle,
  differentiator: CheckCircle,
};

const styles: Record<CalloutType, string> = {
  note: "border-accent-teal bg-accent-teal/5",
  tip: "border-accent-teal-400 bg-accent-teal/5",
  info: "border-muted bg-muted/5",
  caution: "border-accent-ember bg-accent-ember/5",
  danger: "border-accent-plum bg-accent-plum/5",
  differentiator: "border-secondary bg-secondary/5",
};

const titleColors: Record<CalloutType, string> = {
  note: "text-accent-teal",
  tip: "text-accent-teal-400",
  info: "text-muted",
  caution: "text-accent-ember",
  danger: "text-accent-plum",
  differentiator: "text-secondary",
};

export default function Callout({ type = "note", title, children }: CalloutProps) {
  const Icon = icons[type];
  const defaultTitle = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className={`callout border-l-4 p-4 my-4 ${styles[type]}`}>
      <div className={`flex items-center gap-2 mb-2 font-display text-sm font-semibold ${titleColors[type]}`}>
        <Icon size={16} />
        <span>{title || defaultTitle}</span>
      </div>
      <div className="text-sm font-serif text-primary [&>p]:mb-0">{children}</div>
    </div>
  );
}
