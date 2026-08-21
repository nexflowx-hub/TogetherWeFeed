import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";

const SITE_URL = "https://hopeheaart.com/pt/";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l.code, `${SITE_URL}?lang=${l.code}`])
        ),
      },
    },
  ];
}
