import { Github, ArrowUpRight } from "lucide-react";

interface SeeItInActionProps {
  // Short repo slug under the resonatehq-examples org, e.g. "example-recursive-factorial-py".
  repo: string;
  // Optional full override if a link ever points outside resonatehq-examples.
  href?: string;
}

// A small, distinct "run this yourself" affordance that sits BELOW a code block.
// Deliberately not styled like a body link (no underline, mono, muted) so it
// reads as chrome attached to the sample rather than inline prose.
export default function SeeItInAction({ repo, href }: SeeItInActionProps) {
  const url = href ?? `https://github.com/resonatehq-examples/${repo}`;

  // The `not-prose` span + `!` utilities are load-bearing: inside `.docs-content`
  // the `.docs-content a` prose rule (specificity 0,1,1) otherwise overrides the
  // utility colors (0,1,0) and this renders as a teal underlined body link.
  return (
    <span className="not-prose mt-3 block pl-3">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1.5 text-xs font-mono !text-fg-muted !no-underline transition-colors hover:!text-accent-teal-800 dark:hover:!text-secondary focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2"
      >
        <Github size={13} className="shrink-0" />
        <span>See it in action: {repo}</span>
        <ArrowUpRight
          size={13}
          className="shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
        />
      </a>
    </span>
  );
}
