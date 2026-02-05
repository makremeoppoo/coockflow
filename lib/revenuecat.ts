/**
 * RevenueCat integration for in-app purchases and subscriptions.
 * Requires a development build (expo-dev-client); does not run in Expo Go.
 * Set EXPO_PUBLIC_REVENUECAT_API_KEY_APPLE and/or EXPO_PUBLIC_REVENUECAT_API_KEY_GOOGLE in .env
 */

import { Platform } from "react-native";

/** Must match the entitlement identifier in RevenueCat dashboard (case-sensitive). */
export const REVENUECAT_ENTITLEMENT_ID = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID ?? "cookflow Pro";

let Purchases: typeof import("react-native-purchases").default | null = null;

try {
  Purchases = require("react-native-purchases").default;
} catch {
  // Native module not linked (e.g. Expo Go) – all methods no-op
}

function getApiKey(): string | null {
  if (Platform.OS === "ios") {
    return process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_APPLE ?? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? null;
  }
  if (Platform.OS === "android") {
    return process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_GOOGLE ?? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? null;
  }
  return null;
}

/** True only when native SDK is present and an API key is set (so preview build without key runs without IAP). */
export const revenueCatAvailable = Boolean(
  Purchases &&
  (Platform.OS === "ios" || Platform.OS === "android") &&
  (Platform.OS === "ios" ? (process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_APPLE ?? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY) : (process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_GOOGLE ?? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY))
);

export async function configureRevenueCat(userId?: string): Promise<void> {
  if (!Purchases || !revenueCatAvailable) return;
  const apiKey = getApiKey();
  if (!apiKey) return;

  try {
    await Purchases.configure({ apiKey, appUserID: userId ?? undefined });
  } catch (e) {
    console.warn("RevenueCat configure:", e);
  }
}

export async function getCustomerInfo(): Promise<{ entitlementActive: boolean }> {
  if (!Purchases) return { entitlementActive: false };
  try {
    const info = await Purchases.getCustomerInfo();
    const active = info.entitlements.active[REVENUECAT_ENTITLEMENT_ID] != null;
    return { entitlementActive: active };
  } catch {
    return { entitlementActive: false };
  }
}

export async function getOfferings(): Promise<{ packages: Array<{ identifier: string; product: { title: string; priceString: string }; packageType: string }> } | null> {
  if (!Purchases) return null;
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    if (!current?.availablePackages?.length) return null;
    return {
      packages: current.availablePackages.map((pkg: any) => ({
        identifier: pkg.identifier,
        product: {
          title: pkg.product.title ?? pkg.identifier,
          priceString: pkg.product.priceString ?? "",
        },
        packageType: pkg.packageType ?? "unknown",
      })),
    };
  } catch {
    return null;
  }
}

export async function purchasePackage(identifier: string): Promise<{ success: boolean; error?: string }> {
  if (!Purchases) return { success: false, error: "Purchases not available" };
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages?.find((p: any) => p.identifier === identifier);
    if (!pkg) return { success: false, error: "Package not found" };
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const active = customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT_ID] != null;

    return { success: active };
  } catch (e: any) {
    const code = e?.userCancelled ? "cancelled" : e?.message ?? "Purchase failed";
    return { success: false, error: code };
  }
}

export async function restorePurchases(): Promise<{ entitlementActive: boolean }> {
  if (!Purchases) return { entitlementActive: false };
  try {
    const info = await Purchases.restorePurchases();
    const active = info.entitlements.active[REVENUECAT_ENTITLEMENT_ID] != null;
    return { entitlementActive: active };
  } catch {
    return { entitlementActive: false };
  }
}

/** Callback when customer info updates (e.g. after Test Store completes). Use to refresh UI. */
export type CustomerInfoUpdateListener = () => void;

/** Adds a listener for customer info updates (e.g. after Test Store "TEST VALID PURCHASE"). Returns unsubscribe. */
export function addCustomerInfoUpdateListener(listener: CustomerInfoUpdateListener): () => void {
  if (!Purchases) return () => {};
  const wrapper = () => listener();
  try {
    Purchases.addCustomerInfoUpdateListener(wrapper);
    return () => {
      try {
        Purchases.removeCustomerInfoUpdateListener(wrapper);
      } catch {
        // no-op
      }
    };
  } catch {
    return () => {};
  }
}
