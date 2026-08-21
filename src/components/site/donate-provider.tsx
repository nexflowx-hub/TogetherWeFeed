"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DONATION_OPTIONS, type DonationOption } from "./donation-options";
import { useLocale } from "@/i18n/locale-provider";

export type { DonationOption };
export { DONATION_OPTIONS };

type DonateContextValue = {
  // Active donation option (by id, stable across currencies)
  selectedId: string;
  selected: DonationOption;
  // Active price + label in the current currency
  price: number;
  label: string;
  select: (id: string) => void;
  checkoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
};

const DonateContext = createContext<DonateContextValue | null>(null);

export function DonateProvider({ children }: { children: React.ReactNode }) {
  const { presets, formatPrice } = useLocale();
  const [selectedId, setSelectedId] = useState<string>(DONATION_OPTIONS[0].id);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const select = useCallback((id: string) => setSelectedId(id), []);
  const openCheckout = useCallback(() => setCheckoutOpen(true), []);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);

  const selected = useMemo(
    () =>
      DONATION_OPTIONS.find((o) => o.id === selectedId) ?? DONATION_OPTIONS[0],
    [selectedId]
  );

  // Map the selected option (by index) to the corresponding preset in the
  // active currency. This keeps the chosen "tier" stable when the currency
  // changes (e.g. €20 → $20 → £20).
  const selectedIdx = DONATION_OPTIONS.findIndex((o) => o.id === selectedId);
  const price = useMemo(() => {
    const idx = Math.max(0, Math.min(selectedIdx, presets.length - 1));
    return presets[idx];
  }, [selectedIdx, presets]);

  const label = useMemo(() => formatPrice(price), [price, formatPrice]);

  // Lock body scroll when checkout is open
  useEffect(() => {
    if (checkoutOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [checkoutOpen]);

  const value = useMemo(
    () => ({
      selectedId,
      selected,
      price,
      label,
      select,
      checkoutOpen,
      openCheckout,
      closeCheckout,
    }),
    [selectedId, selected, price, label, select, checkoutOpen, openCheckout, closeCheckout]
  );

  return (
    <DonateContext.Provider value={value}>{children}</DonateContext.Provider>
  );
}

export function useDonate() {
  const ctx = useContext(DonateContext);
  if (!ctx) {
    throw new Error("useDonate must be used within a DonateProvider");
  }
  return ctx;
}
