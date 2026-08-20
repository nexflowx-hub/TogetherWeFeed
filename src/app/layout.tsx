import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://hopeheaart.com/pt/"),
  title: "Together We Feed — Juntos alimentamos vidas",
  description:
    "Alimento, água e cuidados essenciais a cães abandonados no sul da Europa. Ajude-nos a salvar vidas.",
  keywords: [
    "doação",
    "cães abandonados",
    "Together We Feed",
    "ONG",
    "resgate animal",
    "ajuda animal",
  ],
  authors: [{ name: "Together We Feed" }],
  icons: {
    icon: "/media/images/favicon.webp",
  },
  openGraph: {
    title: "Together We Feed",
    description:
      "Alimento, água e cuidados essenciais a cães abandonados no sul da Europa.",
    url: "https://hopeheaart.com/pt/",
    siteName: "Together We Feed",
    type: "website",
    images: [{ url: "/media/images/logo.webp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Together We Feed",
    description:
      "Alimento, água e cuidados essenciais a cães abandonados no sul da Europa.",
  },
};

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
