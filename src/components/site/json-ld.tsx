import { DONATION_OPTIONS } from "./donation-options";

// Server component — injects JSON-LD structured data for richer SEO.
// Includes Organization, NGO (NonProfit), FAQPage and the donation
// products so search engines understand the page intent.

const SITE_URL = "https://hopeheaart.com/pt/";

export function JsonLd() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Como são utilizados os donativos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Os donativos financiam a alimentação, cuidados veterinários, medicamentos, tratamentos e as despesas básicas do abrigo. Cada valor recebido ajuda diretamente os mais de 500 animais resgatados.",
        },
      },
      {
        "@type": "Question",
        name: "Os donativos são seguros?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. O pagamento é processado por plataforma segura e auditada, com os mesmos padrões de qualquer compra online.",
        },
      },
      {
        "@type": "Question",
        name: "Os donativos fazem realmente a diferença?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. Cada contribuição, por mais pequena que pareça, ajuda a manter o abrigo a funcionar. Já salvámos mais de 4.500 vidas graças ao apoio de pessoas como você.",
        },
      },
    ],
  };

  const org = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Together We Feed",
    alternateName: "Hope Heaart",
    url: SITE_URL,
    logo: `${SITE_URL}media/images/logo.webp`,
    description:
      "Alimento, água e cuidados essenciais a cães abandonados no sul da Europa.",
    sameAs: [
      "https://hopeheaart.com/pt/",
      "https://togetherwefeeds.com/pt-pt/",
    ],
    areaServed: ["PT", "ES", "FR", "IT", "DE"],
    knowsAbout: ["animal rescue", "dog shelter", "pet adoption", "donation"],
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Doar",
        item: `${SITE_URL}#doar`,
      },
    ],
  };

  const products = DONATION_OPTIONS.map((opt) => ({
    "@type": "Product",
    name: `Donativo ${opt.priceEur}€ — Together We Feed`,
    description: "Donação para alimentar, tratar e proteger cães abandonados.",
    brand: { "@type": "Brand", name: "Together We Feed" },
    category: "Donation",
    offers: {
      "@type": "Offer",
      price: opt.priceEur,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}#doar`,
    },
  }));

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Opções de donativo",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: p,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    </>
  );
}
