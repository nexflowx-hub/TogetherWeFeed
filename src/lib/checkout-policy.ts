import type { XPaymentsCurrency, XPaymentsMethod } from "@/lib/xpayments";

export type PixPayerFieldsMode = "optional" | "required" | "hidden";

export type CheckoutPolicy = {
  enabled: boolean;
  country: string | null;
  currency: XPaymentsCurrency;
  methods: XPaymentsMethod[];
  pixPayerFields: PixPayerFieldsMode;
  message?: string;
};

const VALID_METHODS = new Set<XPaymentsMethod>([
  "pix",
  "mb_way",
  "multibanco",
  "bizum",
  "card",
  "other",
]);

const DEFAULT_METHODS_BY_COUNTRY: Record<string, XPaymentsMethod[]> = {
  BR: ["pix", "card", "other"],
  PT: ["mb_way", "multibanco", "card", "other"],
  ES: ["bizum", "card", "other"],
};

const DEFAULT_METHODS: XPaymentsMethod[] = ["card", "other"];

function csv(value?: string): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function envMethods(country: string | null): XPaymentsMethod[] | null {
  const countryKey = country ? `CHECKOUT_METHODS_${country}` : null;
  const raw = countryKey ? process.env[countryKey] : undefined;
  const fallbackRaw = process.env.CHECKOUT_METHODS_DEFAULT;
  const selected = raw ?? fallbackRaw;

  if (selected === undefined) return null;

  return csv(selected)
    .map((item) => item.toLowerCase())
    .filter((item): item is XPaymentsMethod => VALID_METHODS.has(item as XPaymentsMethod));
}

export function normaliseCountry(value?: string | null): string | null {
  const country = value?.trim().toUpperCase();
  return country && /^[A-Z]{2}$/.test(country) ? country : null;
}

export function requestCountry(req: Request, fallback?: string | null): string | null {
  return (
    normaliseCountry(req.headers.get("cf-ipcountry")) ??
    normaliseCountry(req.headers.get("x-vercel-ip-country")) ??
    normaliseCountry(req.headers.get("x-country-code")) ??
    normaliseCountry(req.headers.get("geoip-country-code")) ??
    normaliseCountry(fallback)
  );
}

export function expectedCurrencyForCountry(country: string | null): XPaymentsCurrency {
  return country === "BR" ? "BRL" : "EUR";
}

export function getPixPayerFieldsMode(): PixPayerFieldsMode {
  const configured = process.env.CHECKOUT_PIX_PAYER_FIELDS?.trim().toLowerCase();
  return configured === "required" || configured === "hidden" || configured === "optional"
    ? configured
    : "optional";
}

export function getPixFallbackName(): string {
  return (
    process.env.CHECKOUT_PIX_FALLBACK_NAME?.trim() ||
    "Together We Feed - Doador"
  ).slice(0, 120);
}

function countryIsAllowed(country: string | null): boolean {
  const configured = csv(process.env.CHECKOUT_ALLOWED_COUNTRIES).map((item) => item.toUpperCase());
  if (configured.length === 0 || configured.includes("*")) return true;
  if (!country) return false;
  return configured.includes(country);
}

export function getCheckoutPolicy(
  country: string | null,
  currency: XPaymentsCurrency
): CheckoutPolicy {
  const pixPayerFields = getPixPayerFieldsMode();

  if (!countryIsAllowed(country)) {
    return {
      enabled: false,
      country,
      currency,
      methods: [],
      pixPayerFields,
      message:
        process.env.CHECKOUT_COUNTRY_BLOCK_MESSAGE?.trim() ||
        "Os donativos desta campanha não estão disponíveis na sua localização.",
    };
  }

  const expectedCurrency = expectedCurrencyForCountry(country);
  if (currency !== expectedCurrency) {
    return {
      enabled: false,
      country,
      currency,
      methods: [],
      pixPayerFields,
      message: "A moeda selecionada não está disponível para esta localização.",
    };
  }

  const configuredMethods = envMethods(country);
  const methods =
    configuredMethods ??
    (country && DEFAULT_METHODS_BY_COUNTRY[country]
      ? DEFAULT_METHODS_BY_COUNTRY[country]
      : DEFAULT_METHODS);

  return {
    enabled: methods.length > 0,
    country,
    currency,
    methods,
    pixPayerFields,
    ...(methods.length === 0
      ? { message: "Os meios de pagamento desta campanha estão temporariamente indisponíveis." }
      : {}),
  };
}
