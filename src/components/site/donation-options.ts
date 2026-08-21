// Plain data module — safe to import from both server and client components.
// Prices are expressed in EUR (base currency). The active currency presets
// are derived in the LocaleProvider via the currency config.

export type DonationOption = {
  id: string;
  slug: string;
  priceEur: number;
  impactKey: number; // index into messages.impacts.items
  emoji: string;
};

export const DONATION_OPTIONS: DonationOption[] = [
  {
    id: "2905ef12-074a-409f-bb15-91fc9d067727",
    slug: "doacao-25",
    priceEur: 5,
    impactKey: 0,
    emoji: "🩵",
  },
  {
    id: "be9ed21a-460d-4941-95d4-5350dfa3f823",
    slug: "doacao-50",
    priceEur: 10,
    impactKey: 1,
    emoji: "🩵",
  },
  {
    id: "904a0347-7c9a-450f-81aa-6661c0b8d0e6",
    slug: "doacao-100",
    priceEur: 20,
    impactKey: 2,
    emoji: "🩵",
  },
  {
    id: "cf14c4cd-780e-44ee-8024-96d9302e2489",
    slug: "doacao-200",
    priceEur: 35,
    impactKey: 3,
    emoji: "🩵",
  },
  {
    id: "70c75991-077f-45df-9c0f-4dba5c905ff5",
    slug: "doacao-500",
    priceEur: 50,
    impactKey: 4,
    emoji: "🩵",
  },
  {
    id: "b85d7ddd-2f3c-4aec-9022-81287cc69043",
    slug: "doacao-1000",
    priceEur: 100,
    impactKey: 5,
    emoji: "🩵",
  },
];

