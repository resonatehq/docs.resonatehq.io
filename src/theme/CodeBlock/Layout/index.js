import React from 'react';
import clsx from 'clsx';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import Container from '@theme/CodeBlock/Container';
import Title from '@theme/CodeBlock/Title';
import Content from '@theme/CodeBlock/Content';
import Buttons from '@theme/CodeBlock/Buttons';
import styles from './styles.module.css';
import OriginalCodeBlockLayout from '@theme-original/CodeBlock/Layout';

const LANGUAGE_LABELS = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TypeScript',
  json: 'JSON',
  sh: 'Shell',
  bash: 'Shell',
  shell: 'Shell',
  md: 'Markdown',
  mdx: 'MDX',
  py: 'Python',
  python: 'Python',
  go: 'Go',
  java: 'Java',
  csharp: 'C#',
  cs: 'C#',
  yaml: 'YAML',
  yml: 'YAML',
  dockerfile: 'Dockerfile',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  rust: 'Rust',
};

function formatLanguage(language) {
  if (!language) {
    return undefined;
  }
  const lower = language.toLowerCase();
  return LANGUAGE_LABELS[lower] ?? language.toUpperCase();
}

export default function CodeBlockLayout({className}) {
  let context;
  try {
    context = useCodeBlockContext();
  } catch (error) {
    if (error instanceof Error && /CodeBlockContextProvider/.test(error.message)) {
      return <OriginalCodeBlockLayout className={className} />;
    }
    throw error;
  }

  const {metadata} = context;
  const languageLabel = formatLanguage(metadata.language);
  const hasHeader = Boolean(metadata.title || languageLabel);

  return (
    <Container as="div" className={clsx(className, metadata.className)}>
      {hasHeader ? (
        <div className={styles.codeBlockHeader}>
          {metadata.title ? (
            <div className={styles.codeBlockTitle}>
              <Title>{metadata.title}</Title>
            </div>
          ) : (
            <div className={styles.codeBlockTitleSpacer} />
          )}
          {languageLabel && (
            <span className={styles.codeBlockLanguage}>{languageLabel}</span>
          )}
        </div>
      ) : null}
      <div className={styles.codeBlockContent}>
        <Content />
        <Buttons />
      </div>
    </Container>
  );
}
