import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import Link from "next/link";
import { findNeighbour } from "fumadocs-core/server";
import Sidebar from "@/components/Sidebar";
import TableOfContents from "@/components/TableOfContents";
import { CodeTabs, TabItem } from "@/components/mdx/CodeTabs";
import Callout from "@/components/mdx/Callout";
import { Card, CardGrid } from "@/components/mdx/CardGrid";
import { RepoCard, RepoGrid } from "@/components/mdx/RepoCard";
import HomePageCategory from "@/components/mdx/HomePageCategory";
import CloneRepoCard from "@/components/mdx/CloneRepoCard";
import DocCardList from "@/components/mdx/DocCardList";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import type { ReactElement } from "react";

const mdxComponents = {
  Tabs: CodeTabs,
  TabItem,
  Callout,
  Card,
  CardGrid,
  RepoCard,
  RepoGrid,
  HomePageGrid: CardGrid,
  HomePageCategory,
  CloneRepoGrid: RepoGrid,
  CloneRepoCard,
  DocCardList,
};

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const tree = source.pageTree;
  const neighbours = findNeighbour(tree, page.url);

  const MDX = page.data.body;

  return (
    <div className="flex">
      <Sidebar tree={tree} currentPath={page.url} />

      <main className="flex-1 min-w-0 px-6 md:px-10 py-8">
        {/* Breadcrumbs */}
        <nav className="text-xs text-muted mb-6 font-mono" aria-label="Breadcrumb">
          <Link href="/docs" className="hover:text-bright-gray-900 dark:hover:text-primary transition">
            Docs
          </Link>
          {slug?.map((segment, i) => (
            <span key={segment}>
              <span className="mx-1.5">/</span>
              {i === slug.length - 1 ? (
                <span className="text-bright-gray-900 dark:text-primary">{page.data.title}</span>
              ) : (
                <span>{segment}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Content */}
        <article className="docs-content max-w-3xl">
          <h1>{page.data.title}</h1>
          {page.data.description && (
            <p className="text-lg text-muted font-serif mb-8 !mt-0">
              {page.data.description}
            </p>
          )}
          <MDX components={mdxComponents} />
        </article>

        {/* Prev / Next (section-aware via fumadocs findNeighbour) */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-primary/10 max-w-3xl">
          {neighbours.previous ? (
            <Link
              href={neighbours.previous.url}
              className="group flex items-center gap-2 text-sm text-muted hover:text-bright-gray-900 dark:hover:text-primary transition focus-visible:outline-2 focus-visible:outline-secondary"
            >
              <ChevronLeft size={14} />
              <span className="group-hover:text-secondary transition">
                {neighbours.previous.name}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {neighbours.next ? (
            <Link
              href={neighbours.next.url}
              className="group flex items-center gap-2 text-sm text-muted hover:text-bright-gray-900 dark:hover:text-primary transition focus-visible:outline-2 focus-visible:outline-secondary"
            >
              <span className="group-hover:text-secondary transition">
                {neighbours.next.name}
              </span>
              <ChevronRight size={14} />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>

      <TableOfContents toc={page.data.toc} />
    </div>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) return {};

  const title = page.data.title;
  const description = page.data.description || `${title} — Resonate documentation`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — Resonate Docs`,
      description,
      url: `https://docs.resonatehq.io${page.url}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${title} — Resonate Docs`,
      description,
    },
    alternates: {
      canonical: `https://docs.resonatehq.io${page.url}`,
    },
  };
}
