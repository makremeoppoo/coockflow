# Cookflow

**From "I saw this" to "it's on the table."**

Turn recipe videos into saved recipes and grocery lists—so you actually cook what you've been meaning to make. **Monetization:** [RevenueCat](#monetization-revenuecat) (Cookflow Pro subscription).

**Contents:** [Problem](#the-problem) · [Solution](#the-solution) · [Features](#features) · [How it works](#how-it-works) · [Monetization (RevenueCat)](#monetization-revenuecat) · [Tech stack](#tech-stack) · [Getting started](#getting-started) · [Troubleshooting](#troubleshooting-emulator-builds-but-doesnt-start) · [Hackathon](#hackathon)

---

## The problem

We all save recipes. We rarely cook them. Inspiration doesn’t turn into action because:

- Links and screenshots pile up with no structure
- Turning a video or blog post into a shopping list is manual and tedious
- “What did I want to make?” and “What do I need to buy?” live in different places

## The solution

**Cookflow** turns inspiration into action:

1. **Paste a recipe video URL** (YouTube, TikTok, etc.) → AI extracts title, ingredients, and steps.
2. **Save to your collection** → One place for “what I want to cook.”
3. **Add to grocery list in one tap** → Ingredients flow into a categorized list.
4. **Shop and cook** → Check off as you go; see which recipe each item is for.

You go from “I saw this” to “it’s on the table” without leaving the app.

---

## Features

- **Discover** — Paste a recipe video/link. AI (Gemini) parses it into a structured recipe. Save it to your collection.
- **My Recipes** — Your saved “want to cook” list. Expand cards for ingredients and steps, add to grocery list, open the original video, or remove.
- **Grocery List** — Items grouped by category, with “from recipe” labels. Check off while shopping; clear completed when done.

---

## How it works

```
Recipe video URL → AI extraction (Gemini) → Saved recipe → One-tap "Add to grocery list"
                                                                    ↓
                                              Categorized grocery list → Shop → Cook
```

- **Video → recipe:** Paste URL in Discover. We pull title/description (and metadata where available), then use Gemini to extract ingredients and steps.
- **Recipe → list:** From any saved recipe, tap “Add to grocery list.” Ingredients are merged into your list and categorized.
- **List → table:** Use the Grocery tab to shop and check off; recipes stay linked so you know what you’re making.

---

## Monetization (RevenueCat)

Cookflow uses **RevenueCat** for in-app purchases and subscriptions.

- **Cookflow Pro** — Subscription (or one-time) via RevenueCat. Pro unlocks:
  - Unlimited recipe extractions from video links
  - Unlimited saved recipes
- **Free tier** — 3 recipe extractions per month; after that the paywall is shown.
- In-app purchases require a **development build** (`expo run:ios` / `expo run:android`); they do not work in Expo Go.

Configure in [RevenueCat](https://www.revenuecat.com): create a project, add your App Store / Play Store app, create an entitlement (e.g. `pro`) and offerings, then set:

```env
EXPO_PUBLIC_REVENUECAT_API_KEY=your_public_sdk_key
# Or per platform:
# EXPO_PUBLIC_REVENUECAT_API_KEY_APPLE=...
# EXPO_PUBLIC_REVENUECAT_API_KEY_GOOGLE=...
```

If you use a **Test Store** API key (starts with `test_`), you need `react-native-purchases` **≥ 9.5.4**; older SDKs throw a deserialization error for `test_store`. Use production keys for release builds.

---

## Tech stack

- **App:** React Native (Expo), TypeScript, Expo Router
- **AI:** Google Gemini (recipe extraction from video metadata/description)
- **Monetization:** RevenueCat (in-app purchases / subscriptions)
- **Storage:** AsyncStorage (recipes, grocery list, app state)
- **Auth / backend:** Appwrite (optional; e.g. auth, sync)

---

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Create a `.env` (or set in your environment):

   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_public_sdk_key
   ```

3. **Run the app**

   ```bash
   npm install
   npx expo start
   ```

   Open in iOS simulator, Android emulator, or Expo Go.  
   **Note:** In-app purchases (RevenueCat) only work in a **development build**: `npx expo run:ios` or `npx expo run:android` (requires `expo-dev-client`).

---

## Troubleshooting: Emulator builds but doesn’t start

If the build succeeds but the emulator doesn’t start or the app doesn’t open:

### Android

1. **Start the emulator first**
   - Open **Android Studio** → **Device Manager** (or **Tools** → **Device Manager**).
   - Start an AVD (e.g. click the ▶ Run button).
   - Wait until the emulator is fully booted (home screen visible).

2. **Then run the app**
   ```bash
   npx expo run:android
   ```
   The CLI should detect the running emulator and install/launch the app.

3. **If no device is found**
   ```bash
   npx expo run:android --device
   ```
   to list connected devices and emulators.

4. **Alternative: start dev server, then open app on emulator**
   ```bash
   npx expo start
   ```
   Press `a` for Android. If the dev client is already installed on the emulator, it will open. Otherwise run `npx expo run:android` once with the emulator already running to install it.

5. **Windows:** Ensure `ANDROID_HOME` is set (e.g. `C:\Users\<you>\AppData\Local\Android\Sdk`) and that `platform-tools` is on your PATH.

### iOS

1. **Start the simulator first**
   ```bash
   open -a Simulator
   ```
   (or open **Xcode** → **Window** → **Devices and Simulators** and boot a simulator.)

2. **Then run the app**
   ```bash
   npx expo run:ios
   ```

3. **If the app installs but crashes on launch:** Try clearing the build and running again:
   ```bash
   cd ios && xcodebuild clean && cd ..
   npx expo run:ios
   ```

### App crashes on launch (dev build)

- If you added **RevenueCat** and the app crashes as soon as it opens, ensure you have a valid `EXPO_PUBLIC_REVENUECAT_API_KEY && EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID` in `.env` (or remove the key to skip RevenueCat; the app will run with IAP disabled).
- Clear the build and re-run: e.g. delete `android/app/build` and `android/.gradle`, then `npx expo run:android` again.

---

## Project structure

- `app/` — Screens and routing (Expo Router)
  - `(tabs)/` — Main tabs: My Recipes, Grocery List, Discover
- `components/` — UI (RecipeCard, EmptyState, grocery, discover, etc.)
- `lib/` — Recipe extraction (`recipeFromVideo`), RevenueCat (`revenuecat`), free limit (`freeLimit`), Appwrite config
- `context/` — Tab bar visibility, Premium (RevenueCat entitlement)
- `constants/` — Colors, assets, theme

---

## Hackathon

Built for **Eitan Bernath: From saved recipe to dinner made** — tools that turn inspiration into action: generate a grocery list from a recipe video/link, organize what you want to cook, and make it simple to go from “I saw this” to “it’s on the table.”

Cookflow does exactly that: paste a link → get a recipe → get a list → cook.  
Monetization is implemented with **RevenueCat** (Cookflow Pro subscription / in-app purchase).
