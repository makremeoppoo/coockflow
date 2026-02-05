# Cookflow — Technical Documentation

Technical documentation for **tech stack**, **architecture**, and **RevenueCat implementation**.

---

## 1. Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React Native (Expo SDK 54), TypeScript |
| **Routing** | Expo Router (file-based), React Navigation (bottom tabs) |
| **UI** | React Native core components, StyleSheet, NativeWind/Tailwind (optional), Ionicons |
| **AI / recipe extraction** | Google Gemini API (recipe parsing from video metadata) |
| **Monetization** | RevenueCat (`react-native-purchases` ≥ 9.5.4) |
| **Local storage** | AsyncStorage (recipes, grocery list, free-extraction count) |
| **Build / deploy** | EAS Build (development, preview, production), expo-dev-client |
| **Other** | Sentry (errors), Appwrite (optional backend), Reanimated, Gesture Handler |

**Key dependencies:** `expo`, `expo-router`, `react-native-purchases`, `@react-navigation/bottom-tabs`, `react-native-reanimated`, `@react-native-async-storage/async-storage`. In-app purchases require a **development build** (not Expo Go).

---

## 2. Architecture

### 2.1 App structure

```
app/
  _layout.tsx              # Root: fonts, PremiumProvider, Stack
  (tabs)/
    _layout.tsx            # Tab bar (My Recipes, Grocery, Discover), TabBarVisibilityProvider
    index.tsx              # My Recipes
    search.tsx             # Grocery List
    explore.tsx            # Discover (paste URL → extract recipe)
  styles.js                # Shared StyleSheet
components/                 # Reusable UI
  PaywallModal.tsx         # RevenueCat paywall
  RecipeCard.tsx, EmptyState.tsx, discover/*, grocery/*
context/
  PremiumContext.tsx       # isPro, refresh, RevenueCat init + listener
  TabBarVisibilityContext.tsx
lib/
  revenuecat.ts            # RevenueCat SDK wrapper
  freeLimit.ts             # Free tier: 3 extractions/month
  recipeFromVideo.ts       # Video metadata + Gemini extraction
constants/                  # Colors, assets
```

### 2.2 Data flow

- **Recipes / grocery list:** Stored in AsyncStorage; each tab loads on mount and on focus (`useFocusEffect`).
- **Premium state:** `PremiumContext` configures RevenueCat on app start, calls `getCustomerInfo()` for `isPro`, and subscribes to `addCustomerInfoUpdateListener` so the UI updates after a purchase.
- **Discover flow:** User pastes URL → `getVideoContent()` (metadata) → `extractRecipeWithGemini()` → save to AsyncStorage → show in My Recipes. Free users are limited by `freeLimit.ts` (3/month); Pro users skip the limit.
- **Tab bar:** Scroll-down hides the bar and shows a floating action button; tap restores the bar. State lives in `TabBarVisibilityContext`.

### 2.3 Key flows

1. **Recipe extraction (Discover):** `explore.tsx` → `canExtractFree(isPro)` → if allowed, `getVideoContent` + `extractRecipeWithGemini` → save recipe → `incrementFreeExtractions()` if free.
2. **Add to grocery list:** From a recipe card, ingredients are merged into the global grocery list (AsyncStorage) with category and “from recipe” label.
3. **Premium / paywall:** `usePremium()` exposes `isPro`. When the user hits the free limit or taps “Unlock unlimited,” `PaywallModal` shows offerings from RevenueCat, handles purchase/restore, and refreshes premium state.

---

## 3. RevenueCat Implementation

### 3.1 Configuration

- **SDK:** `react-native-purchases`; optional `require()` so the app runs in Expo Go without the native module (IAP disabled).
- **API keys:** Per platform via env:
  - `EXPO_PUBLIC_REVENUECAT_API_KEY_GOOGLE` (Android)
  - `EXPO_PUBLIC_REVENUECAT_API_KEY_APPLE` (iOS)
  - Or single `EXPO_PUBLIC_REVENUECAT_API_KEY`
- **Entitlement:** One entitlement, **`cookflow Pro`** (case-sensitive; must match RevenueCat dashboard). Pro unlocks unlimited extractions.
- **Configure:** `configureRevenueCat()` is called once at app startup from `PremiumContext` (root layout).

### 3.2 Initialization and premium state

- **Where:** `context/PremiumContext.tsx`.
- **On mount (iOS/Android):** `configureRevenueCat()` → `getCustomerInfo()` → set `isPro` from `entitlements.active["cookflow Pro"]`.
- **Listener:** `addCustomerInfoUpdateListener(refresh)` so that when RevenueCat updates (e.g. after Test Store “TEST VALID PURCHASE”), we re-fetch customer info and update `isPro`; the paywall can then close.

### 3.3 Offerings and purchase flow

- **Offerings:** `getOfferings()` returns the current offering’s packages (identifier, product title, price string). Used by `PaywallModal` to show subscription/one-time options.
- **Purchase:** `purchasePackage(identifier)` finds the package by identifier, calls `Purchases.purchasePackage(pkg)`, then checks `customerInfo.entitlements.active["cookflow Pro"]`. Returns `{ success, error }`.
- **Restore:** `restorePurchases()` calls `Purchases.restorePurchases()` and returns whether the entitlement is active.
- **Paywall UI:** `components/PaywallModal.tsx` loads offerings, displays packages, handles purchase and restore. After purchase, it re-fetches customer info (with a short delay for Test Store) and closes if the entitlement is active.

### 3.4 Free tier and gating

- **Limit:** `lib/freeLimit.ts` — 3 recipe extractions per calendar month for non-Pro users. Stored in AsyncStorage (`extractionsMonth`, `extractionsCount`); month change resets the count.
- **Gating:** Before extracting a recipe, `canExtractFree(isPro)` is called. If the user is not Pro and has already used 3 extractions this month, the app shows the paywall instead of extracting.
- **EAS / preview builds:** Use the **production** Android (or iOS) API key in RevenueCat, not the Test Store key. Set `EXPO_PUBLIC_REVENUECAT_API_KEY_GOOGLE` (e.g. via EAS secrets) for preview/production builds.

### 3.5 RevenueCat dashboard setup (reference)

- **Entitlement:** Create entitlement with identifier **`cookflow Pro`**.
- **Products:** Create products (e.g. monthly, yearly, lifetime) and attach them to that entitlement.
- **Offering:** Create an offering (e.g. “default”) and add packages that reference those products.
- **API keys:** Use the public SDK key for each platform (Android: `goog_...`) in the app; use Test Store key only for local dev builds.

---

## 4. Links and references

- **Repo / README:** [README.md](./README.md) — setup, troubleshooting, monetization summary.
- **RevenueCat:** [RevenueCat docs](https://www.revenuecat.com/docs)
- **Expo / EAS:** [Expo docs](https://docs.expo.dev), [EAS Build](https://docs.expo.dev/build/introduction/)
