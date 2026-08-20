// Plain data module — safe to import from both server and client components.

export type DonationOption = {
  id: string;
  slug: string;
  price: number;
  label: string;
  impact: string;
};

export const DONATION_OPTIONS: DonationOption[] = [
  {
    id: "2905ef12-074a-409f-bb15-91fc9d067727",
    slug: "doacao-25",
    price: 5,
    label: "5 €",
    impact: "Uma semana de alimento e esperança para um animal.",
  },
  {
    id: "be9ed21a-460d-4941-95d4-5350dfa3f823",
    slug: "doacao-50",
    price: 10,
    label: "10 €",
    impact: "Saúde e nutrição para 2 animais durante 10 dias.",
  },
  {
    id: "904a0347-7c9a-450f-81aa-6661c0b8d0e6",
    slug: "doacao-100",
    price: 20,
    label: "20 €",
    impact: "Um saco de ração de 10kg — alimenta 5 vidas durante 30 dias.",
  },
  {
    id: "cf14c4cd-780e-44ee-8024-96d9302e2489",
    slug: "doacao-200",
    price: 35,
    label: "35 €",
    impact: "Vacinas e desparasitantes que protegem 4 animais contra doenças.",
  },
  {
    id: "70c75991-077f-45df-9c0f-4dba5c905ff5",
    slug: "doacao-500",
    price: 50,
    label: "50 €",
    impact: "Tratamento completo e digno durante um mês para 3 animais.",
  },
  {
    id: "b85d7ddd-2f3c-4aec-9022-81287cc69043",
    slug: "doacao-1000",
    price: 100,
    label: "100 €",
    impact: "Cirurgias de urgência e recuperação de animais em estado crítico.",
  },
];
