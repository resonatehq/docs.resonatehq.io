import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Lora } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const lora = Lora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

const sansation = localFont({
  src: [
    { path: "../public/fonts/Sansation-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/Sansation-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Sansation-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-sansation",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.resonatehq.io"),
  title: {
    template: "%s — Resonate Docs",
    default: "Resonate Documentation",
  },
  description: "Documentation for Resonate — durable execution, dead simple. Guides for TypeScript, Python, and Rust SDKs.",
  icons: {
    icon: "/images/favicon.png",
  },
  openGraph: {
    title: "Resonate Documentation",
    description: "Documentation for Resonate — durable execution, dead simple.",
    url: "https://docs.resonatehq.io",
    siteName: "Resonate Docs",
    images: [{ url: "/images/resonate-documentation-banner.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resonate Documentation",
    description: "Documentation for Resonate — durable execution, dead simple.",
    images: ["/images/resonate-documentation-banner.png"],
  },
  alternates: {
    canonical: "https://docs.resonatehq.io",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sansation.variable} ${lora.variable} ${inter.className}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <body className="bg-surface-light dark:bg-dark min-h-screen font-serif">
        {children}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0660YY8LZF"
          strategy="afterInteractive"
        />
        <Script id="google-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0660YY8LZF');
          `}
        </Script>
        <Script src="/scripts/fullstory.js" strategy="afterInteractive" />
        <Script src="/scripts/cookiebanner.js" strategy="afterInteractive" />
        {/* Echo AI assistant widget */}
        <Script src="/scripts/echo.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
