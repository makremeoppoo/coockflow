# Cookflow

**From "I saw this" to "it's on the table."**

Turn recipe videos into saved recipes and grocery lists—so you actually cook what you've been meaning to make.

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

## Tech stack

- **App:** React Native (Expo), TypeScript, Expo Router
- **AI:** Google Gemini (recipe extraction from video metadata/description)
- **Storage:** AsyncStorage (recipes, grocery list, app state)
- **Auth / backend:** Appwrite (optional; e.g. auth, sync)

---

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment (optional)**

   Create a `.env` (or set in your environment) for recipe extraction:

   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Run the app**

   ```bash
   npx expo start
   ```

   Then open in iOS simulator, Android emulator, or Expo Go.

---

## Project structure

- `app/` — Screens and routing (Expo Router)
  - `(tabs)/` — Main tabs: My Recipes, Grocery List, Discover
- `components/` — UI (RecipeCard, EmptyState, grocery, discover, etc.)
- `lib/` — Recipe extraction (`recipeFromVideo`), Appwrite config
- `context/` — Tab bar visibility (scroll-to-hide, FAB)
- `constants/` — Colors, assets, theme

---

## Hackathon

Built for **Eitan Bernath: From saved recipe to dinner made** — tools that turn inspiration into action: generate a grocery list from a recipe video/link, organize what you want to cook, and make it simple to go from “I saw this” to “it’s on the table.”

Cookflow does exactly that: paste a link → get a recipe → get a list → cook.
