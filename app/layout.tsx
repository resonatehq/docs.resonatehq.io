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
  title: {
    template: "%s — Resonate Docs",
    default: "Resonate Documentation",
  },
  description: "Documentation for Resonate — durable execution, dead simple.",
  icons: {
    icon: "/images/favicon.png",
  },
  openGraph: {
    title: "Resonate Documentation",
    description: "Documentation for Resonate — durable execution, dead simple.",
    url: "https://docs.resonatehq.io",
    siteName: "Resonate Docs",
    images: [{ url: "https://docs.resonatehq.io/images/resonate-documentation-banner.png" }],
    type: "website",
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
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="bg-dark dark:bg-dark bg-surface-light min-h-screen">
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
        {/* Echo AI assistant — currently Kapa.ai widget, will be swapped to native Echo when echo-agent initiative ships */}
        <Script src="/scripts/echo.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
