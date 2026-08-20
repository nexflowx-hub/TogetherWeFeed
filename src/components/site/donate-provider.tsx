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

export type { DonationOption };
export { DONATION_OPTIONS };

type DonateContextValue = {
  selected: DonationOption;
  select: (id: string) => void;
  checkoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
};

const DonateContext = createContext<DonateContextValue | null>(null);

export function DonateProvider({ children }: { children: React.ReactNode }) {
  const [selectedId, setSelectedId] = useState<string>(DONATION_OPTIONS[0].id);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const select = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const openCheckout = useCallback(() => setCheckoutOpen(true), []);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);

  const selected = useMemo(
    () =>
      DONATION_OPTIONS.find((o) => o.id === selectedId) ?? DONATION_OPTIONS[0],
    [selectedId]
  );

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
      selected,
      select,
      checkoutOpen,
      openCheckout,
      closeCheckout,
    }),
    [selected, select, checkoutOpen, openCheckout, closeCheckout]
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
