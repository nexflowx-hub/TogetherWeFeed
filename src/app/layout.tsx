import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import {
  DEFAULT_LOCALE,
  LOCALES,
} from "@/i18n/config";
import { readLocaleFromCookieSafe } from "@/i18n/config.server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = "https://hopeheaart.com/pt/";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const locale = readLocaleFromCookieSafe(cookieHeader) ?? DEFAULT_LOCALE;

  const allMessages = (await import("@/i18n/messages")).MESSAGES;
  const messages = allMessages[locale] ?? allMessages[DEFAULT_LOCALE];

  const languages = Object.fromEntries(
    LOCALES.map((l) => [l.code, `${SITE_URL}?lang=${l.code}`])
  );

  return {
    metadataBase: new URL(SITE_URL),
    title: messages.meta.title,
    description: messages.meta.description,
    keywords: [
      "doação",
      "donation",
      "cães abandonados",
      "abandoned dogs",
      "Together We Feed",
      "ONG",
      "resgate animal",
      "ajuda animal",
      "animal shelter",
      "Spain dogs",
      "Portugal dogs",
    ],
    authors: [{ name: "Together We Feed" }],
    creator: "Together We Feed",
    publisher: "Together We Feed",
    applicationName: "Together We Feed",
    category: "animal welfare",
    icons: {
      icon: "/media/images/favicon.webp",
      shortcut: "/media/images/favicon.webp",
      apple: "/media/images/favicon.webp",
    },
    manifest: "/manifest.webmanifest",
    alternates: {
      canonical: SITE_URL,
      languages,
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      url: SITE_URL,
      siteName: "Together We Feed",
      type: "website",
      locale: locale.replace("-", "_"),
      images: [
        {
          url: "/media/images/hero-desktop.webp",
          width: 1920,
          height: 800,
          alt: messages.hero.alt,
        },
        {
          url: "/media/images/logo.webp",
          width: 180,
          height: 73,
          alt: "Together We Feed",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.meta.title,
      description: messages.meta.description,
      images: ["/media/images/hero-desktop.webp"],
      creator: "@togetherwefeed",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "theme-color": "#0a2540",
      "msapplication-TileColor": "#0a2540",
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a2540",
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
