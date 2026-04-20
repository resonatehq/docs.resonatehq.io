import { RepoCard } from "./RepoCard";

interface CloneRepoCardProps {
  name: string;
  href: string;
  description?: string;
  language?: "TypeScript" | "Python" | "Rust" | "Go";
}

export default function CloneRepoCard({ name, href, description, language }: CloneRepoCardProps) {
  return <RepoCard name={name} href={href} description={description} language={language} />;
}
