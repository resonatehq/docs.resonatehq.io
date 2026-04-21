import { RepoCard } from "./RepoCard";

type Language = "TypeScript" | "Python" | "Rust" | "Go";

const sdkToLanguage: Record<string, Language> = {
  typescript: "TypeScript",
  python: "Python",
  rust: "Rust",
  go: "Go",
  TypeScript: "TypeScript",
  Python: "Python",
  Rust: "Rust",
  Go: "Go",
};

interface CloneRepoCardProps {
  // New Docusaurus-style props
  sdk?: string;
  link?: string;
  // Original props
  name?: string;
  href?: string;
  description?: string;
  language?: Language;
}

export default function CloneRepoCard({ sdk, link, name, href, description, language }: CloneRepoCardProps) {
  const resolvedLanguage = language || (sdk ? sdkToLanguage[sdk] : undefined);
  const resolvedName = name || (resolvedLanguage ? `resonate-sdk-${sdk?.toLowerCase()}` : "Repository");
  const resolvedHref = href || link || "#";

  return <RepoCard name={resolvedName} href={resolvedHref} description={description} language={resolvedLanguage} />;
}
