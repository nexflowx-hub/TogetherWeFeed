import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://hopeheaart.com/pt/sitemap.xml",
    host: "https://hopeheaart.com/pt/",
  };
}
