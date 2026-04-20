import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-6xl font-bold text-bright-gray-900 dark:text-white mb-4">404</h1>
        <p className="font-serif text-bright-gray-700 dark:text-primary text-lg mb-8">
          This page doesn&apos;t exist. It might have been moved or the URL may have changed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/docs"
            className="inline-flex items-center justify-center bg-secondary text-dark font-semibold px-6 py-3 transition hover:bg-secondary/90"
          >
            Documentation home
          </Link>
          <Link
            href="/docs/get-started"
            className="inline-flex items-center justify-center border border-bright-gray-200 dark:border-primary/20 text-bright-gray-900 dark:text-primary px-6 py-3 font-semibold transition hover:border-secondary hover:text-secondary"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
