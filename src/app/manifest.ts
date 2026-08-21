import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Together We Feed",
    short_name: "TWF",
    description:
      "Alimento, água e cuidados essenciais a cães abandonados no sul da Europa.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a2540",
    theme_color: "#0a2540",
    lang: "pt-PT",
    icons: [
      {
        src: "/media/images/favicon.webp",
        sizes: "any",
        type: "image/webp",
        purpose: "any",
      },
    ],
  };
}
