import { DONATION_OPTIONS } from "./donation-options";

// Server component — injects JSON-LD structured data for richer SEO and
// lead capture. Aggregated in a single @graph so search engines see the
// Organization, the Website, the DonateAction (conversion intent), the
// FAQPage, the BreadcrumbList and the donation products as ItemList.

const SITE_URL = "https://hopeheaart.com/pt/";

export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Organization / NGO
      {
        "@type": "NGO",
        "@id": `${SITE_URL}#organization`,
        name: "Together We Feed",
        alternateName: "Hope Heaart",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}media/images/logo.webp`,
          width: 180,
          height: 73,
        },
        image: `${SITE_URL}media/images/hero-desktop.webp`,
        description:
          "Alimento, água e cuidados essenciais a cães abandonados no sul da Europa. Ajude-nos a salvar vidas.",
        slogan: "Juntos alimentamos vidas",
        foundingDate: "2023",
        areaServed: [
          { "@type": "Country", name: "Portugal" },
          { "@type": "Country", name: "Spain" },
          { "@type": "Country", name: "France" },
          { "@type": "Country", name: "Italy" },
          { "@type": "Country", name: "Germany" },
        ],
        knowsAbout: [
          "animal rescue",
          "dog shelter",
          "pet adoption",
          "veterinary care",
          "donation",
        ],
        sameAs: [
          "https://hopeheaart.com/pt/",
          "https://togetherwefeeds.com/pt-pt/",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          url: SITE_URL,
          availableLanguage: ["Portuguese", "English", "Spanish", "French", "German", "Italian"],
        },
      },
      // 2. WebSite with SearchAction (sitelinks search box eligibility)
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: "Together We Feed",
        inLanguage: ["pt-PT", "en-US", "es-ES", "fr-FR", "de-DE", "it-IT"],
        publisher: { "@id": `${SITE_URL}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      // 3. WebPage (the landing page itself)
      {
        "@type": "WebPage",
        "@id": SITE_URL,
        url: SITE_URL,
        name: "Together We Feed — Juntos alimentamos vidas",
        description:
          "Alimento, água e cuidados essenciais a cães abandonados no sul da Europa. Faça a sua doação e salve uma vida.",
        isPartOf: { "@id": `${SITE_URL}#website` },
        about: { "@id": `${SITE_URL}#organization` },
        inLanguage: "pt-PT",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}media/images/hero-desktop.webp`,
        },
      },
      // 4. DonateAction — captures the conversion intent for lead gen
      {
        "@type": "DonateAction",
        "@id": `${SITE_URL}#donate-action`,
        name: "Doar para Together We Feed",
        target: `${SITE_URL}#doar`,
        recipient: { "@id": `${SITE_URL}#organization` },
        actionStatus: "PotentialActionStatus",
        instrument: {
          "@type": "Thing",
          name: "Stripe Checkout",
        },
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "EUR",
          minPrice: 5,
          maxPrice: 100,
        },
      },
      // 5. BreadcrumbList
      {
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
          {
            "@type": "ListItem",
            position: 3,
            name: "Impactos",
            item: `${SITE_URL}#impactos`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "FAQ",
            item: `${SITE_URL}#faq`,
          },
        ],
      },
      // 6. FAQPage (rich results eligibility)
      {
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
              text: "Sim. O pagamento é processado por plataforma segura e auditada (Stripe), com os mesmos padrões de qualquer compra online.",
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
          {
            "@type": "Question",
            name: "Posso doar mensalmente?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim. Pode tornar-se doador mensal e o valor é debitado automaticamente todos os meses. Cancela quando quiser.",
            },
          },
          {
            "@type": "Question",
            name: "Que métodos de pagamento são aceites?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Aceitamos cartão (Visa, Mastercard, Amex), PayPal, iDEAL, Bancontact, SEPA, Pix, Boleto e outros métodos locais consoante o seu país.",
            },
          },
        ],
      },
      // 7. ItemList of donation products (each as Product with Offer)
      {
        "@type": "ItemList",
        name: "Opções de donativo",
        itemListElement: DONATION_OPTIONS.map((opt, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: `Donativo ${opt.priceEur}€ — Together We Feed`,
            description:
              "Donação para alimentar, tratar e proteger cães abandonados no sul da Europa.",
            brand: { "@type": "Brand", name: "Together We Feed" },
            category: "Donation",
            image: `${SITE_URL}media/images/logo.webp`,
            offers: {
              "@type": "Offer",
              price: opt.priceEur,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              url: `${SITE_URL}#doar`,
              seller: { "@id": `${SITE_URL}#organization` },
            },
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
