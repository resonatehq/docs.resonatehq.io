import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import localFont from "next/font/local";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ConsentManager from "@/components/ConsentManager";
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
    icon: [
      { url: "/images/favicon.svg", type: "image/svg+xml" },
      { url: "/images/favicon.png", type: "image/png", sizes: "256x256" },
    ],
    shortcut: "/favicon.ico",
    apple: "/images/apple-touch-icon.png",
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
        {/* Consent Mode v2 — default everything to denied before any tag runs.
            Google Analytics is not loaded until the visitor opts in via ConsentManager. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});`,
          }}
        />
        <Navigation />
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
        <Footer />
        <ConsentManager />
      </body>
    </html>
  );
}
