import {
  addCustomerInfoUpdateListener,
  configureRevenueCat,
  getCustomerInfo,
  revenueCatAvailable,
} from "@/lib/revenuecat";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

type PremiumContextType = {
  isPro: boolean;
  isLoading: boolean;
  isAvailable: boolean;
  refresh: () => Promise<void>;
};

const PremiumContext = createContext<PremiumContextType | null>(null);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!revenueCatAvailable) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { entitlementActive } = await getCustomerInfo();
      setIsPro(entitlementActive);
    } catch {
      setIsPro(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== "ios" && Platform.OS !== "android") {
      setLoading(false);
      return;
    }
    let unsubscribe = () => {};
    (async () => {
      await configureRevenueCat();
      await refresh();
      // When user taps "TEST VALID PURCHASE" in Test Store, RevenueCat updates customer info;
      // this listener runs so we refresh and the paywall closes.
      unsubscribe = addCustomerInfoUpdateListener(refresh);
    })();
    return () => unsubscribe();
  }, [refresh]);

  return (
    <PremiumContext.Provider
      value={{
        isPro,
        isLoading,
        isAvailable: revenueCatAvailable,
        refresh,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  return (
    ctx ?? {
      isPro: false,
      isLoading: false,
      isAvailable: false,
      refresh: async () => {},
    }
  );
}
