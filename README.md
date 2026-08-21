# Together We Feed — Donation Landing Page

A multilingual, multi-currency donation landing page for rescuing abandoned
dogs in Southern Europe. Built with Next.js 16, TypeScript, Tailwind CSS 4
and shadcn/ui, with Stripe Checkout integration and a conversion-focused
donation funnel.

> Clone created for analysis purposes. The checkout runs in **demo mode**
> unless `STRIPE_SECRET_KEY` is configured — no real charges are made.

## Features

### Internationalisation & currencies
- **8 locales**: Português (PT/BR), English (US/UK), Español, Français, Deutsch, Italiano
- **6 currencies**: EUR, USD, GBP, BRL, CHF, CAD — with clean donation presets per currency
- Locale + currency switcher in the header (persisted in localStorage + cookie)
- Auto-detection from browser language, with manual override
- Prices, goals and live counters convert to the active currency

### SEO & indexing
- Dynamic metadata per locale (title, description, OpenGraph, Twitter cards)
- `hreflang` alternates for all locales
- **JSON-LD structured data**: NGO/Organization, FAQPage, BreadcrumbList, ItemList of donation products
- `sitemap.xml` with language alternates
- `robots.txt` (allows crawling, disallows `/api/`)
- Web App Manifest (PWA-ready)
- Optimised `lang` attribute synced with the active locale

### Conversion-focused funnel
- **Match campaign countdown** — "your donation is doubled" with a live 3-day timer
- **Exit-intent modal** — captures abandoning visitors with a last-chance offer
- **Social proof notifications** — periodic toasts showing recent donors
- **Trust badges** — secure / transparent / real impact, near both CTAs
- **Sticky donate bar** — appears on scroll, reflects the selected amount
- **Streamlined checkout** — amount + frequency (one-time/monthly) + minimal fields, redirects to Stripe
- Two donate sections (sky + navy) with synchronised selection

### Stripe integration
- `POST /api/checkout` — creates a Stripe Checkout Session (payment or subscription)
- `POST /api/stripe/webhook` — receives `checkout.session.completed` + `invoice.paid`
- Graceful **demo mode** when `STRIPE_SECRET_KEY` is not set
- Supports monthly recurring donations via Stripe Subscriptions
- Localised Stripe Checkout (locale + product name)

### Page sections (matching the original)
Hero → Match campaign → Video → Mission → Stats (count-up) → Donate (sky) →
Trust badges → Urgency → Monthly goal (animated ring + bars) → Impacts →
Donate (navy) → Trust badges → Stories carousel → Without/With you contrast →
Live progress bar → Testimonials → FAQ (accordion) → Banner → Final CTA → Footer

## Getting started

```bash
bun install
cp .env.example .env.local   # add Stripe keys to enable live checkout
bun run dev
```

Open <http://localhost:3000>.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | No | Stripe secret key. Without it, checkout runs in demo mode. |
| `STRIPE_WEBHOOK_SECRET` | No | For verifying webhook signatures. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Publishable key (future client-side use). |
| `NEXT_PUBLIC_SITE_URL` | No | Public base URL for redirect URLs. |

## Tech stack

- **Next.js 16** (App Router) + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (New York)
- **Stripe** SDK for checkout
- Fontes: Inter (body) + Poppins (headings) via `next/font`

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts      # Stripe Checkout Session creation
│   │   └── stripe/webhook/route.ts # Webhook handler
│   ├── layout.tsx                  # Dynamic metadata (per-locale)
│   ├── page.tsx                    # Main landing page
│   ├── sitemap.ts                  # SEO sitemap with hreflang
│   ├── robots.ts                   # SEO robots.txt
│   └── manifest.ts                 # PWA manifest
├── components/site/                # Page sections + funnel components
├── i18n/
│   ├── config.ts                   # Locales + currencies
│   ├── config.server.ts            # Server-side cookie reader
│   ├── locale-provider.tsx         # Client context (locale + currency)
│   └── messages.ts                 # 6-language dictionary
└── lib/stripe.ts                   # Stripe client singleton
```

## License

This is a clone for analysis. All trademarks and content belong to
Together We Feed / Hope Heaart.
