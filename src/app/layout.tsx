import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import {
  DEFAULT_LOCALE,
  LOCALES,
} from "@/i18n/config";
import { readLocaleFromCookieSafe, readCountryFromCookieSafe } from "@/i18n/config.server";

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
  const country = readCountryFromCookieSafe(cookieHeader);

  const allMessages = (await import("@/i18n/messages")).MESSAGES;
  const messages = allMessages[locale] ?? allMessages[DEFAULT_LOCALE];

  const languages = Object.fromEntries(
    LOCALES.map((l) => [l.code, `${SITE_URL}?lang=${l.code}`])
  );

  // Keywords refined for lead capture across all markets
  const keywords = [
    // Portuguese
    "doação", "doar", "donativo", "cães abandonados", "resgate animal",
    "ajuda animais", "ONG animais", "abrigo cães", "adoção cães",
    "Together We Feed",
    // English
    "donation", "donate", "abandoned dogs", "animal rescue", "dog shelter",
    "animal charity", "adopt a dog", "help animals",
    // Spanish
    "donación", "perros abandonados", "rescate animal",
    // French
    "don", "chiens abandonnés", "refuge animal",
    // German
    "Spende", "ausgesetzte Hunde", "Tierschutz",
    // Italian
    "donazione", "cani abbandonati", "rifugio animali",
  ];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: messages.meta.title,
      template: "%s · Together We Feed",
    },
    description: messages.meta.description,
    keywords,
    authors: [{ name: "Together We Feed", url: SITE_URL }],
    creator: "Together We Feed",
    publisher: "Together We Feed",
    applicationName: "Together We Feed",
    category: "animal welfare",
    formatDetection: {
      telephone: false,
      address: false,
      email: false,
    },
    icons: {
      icon: [
        { url: "/media/images/favicon.webp", type: "image/webp" },
      ],
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
      alternateLocale: LOCALES.map((l) => l.code.replace("-", "_")),
      images: [
        {
          url: "/media/images/hero-desktop.webp",
          width: 1920,
          height: 800,
          alt: messages.hero.alt,
          type: "image/webp",
        },
        {
          url: "/media/images/banner-final.webp",
          width: 1600,
          height: 700,
          alt: "Together We Feed",
          type: "image/webp",
        },
        {
          url: "/media/images/logo.webp",
          width: 180,
          height: 73,
          alt: "Together We Feed",
          type: "image/webp",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.meta.title,
      description: messages.meta.description,
      images: ["/media/images/hero-desktop.webp"],
      creator: "@togetherwefeed",
      site: "@togetherwefeed",
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    // Geo + lead-capture meta tags
    other: {
      "theme-color": "#0a2540",
      "msapplication-TileColor": "#0a2540",
      "msapplication-config": "/browserconfig.xml",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "apple-mobile-web-app-title": "Together We Feed",
      "mobile-web-app-capable": "yes",
      "application-name": "Together We Feed",
      // Geo targeting for local search
      "geo.region": country ? country.toUpperCase() : "PT",
      "geo.placename": "Southern Europe",
      "geo.position": "37.0; -8.0",
      "ICBM": "37.0, -8.0",
      // Lead capture signals
      "article:author": "Together We Feed",
      "article:section": "Animal Welfare",
      "article:tag": "donation, animal rescue, dog shelter",
      // Color theme hint for browsers
      "color-scheme": "light",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a2540" },
    { media: "(prefers-color-scheme: dark)", color: "#0a2540" },
  ],
  viewportFit: "cover",
}

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
