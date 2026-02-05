# Cookflow — Written Proposal

**From "I saw this" to "it's on the table."**

---

## 1. The Problem

People constantly save recipes—from YouTube, TikTok, Instagram, or blogs—with the best of intentions. Yet most of those saved links and screenshots never lead to an actual meal. Inspiration rarely turns into action for three main reasons:

**Friction between “saved” and “cooking.”** Recipe content lives in many places (tabs, screenshots, bookmarks) with no structure. When someone finally wants to cook, they must re-find the link, re-read the recipe, and manually write down ingredients—a tedious step that often kills the impulse.

**No bridge from video to shopping list.** Turning a recipe video or article into a usable grocery list is manual and error-prone. Viewers have to pause, rewind, and type ingredients by hand, or switch between apps. There is no single flow that takes “I saw this” and turns it into “here’s what to buy.”

**Split between “what I want to make” and “what I need to buy.”** Even when someone has a list of dishes they want to try, the ingredients and the shopping list are disconnected. There’s no one place that ties saved recipes to a single, categorized grocery list with clear “from recipe” context.

The result: saved recipes pile up, and dinner stays uninspired. Cookflow addresses this by turning a single recipe link into a structured recipe and a grocery list in one flow.

---

## 2. Target Audience

**Primary: Home cooks who discover recipes online.**  
People who watch recipe videos (YouTube, TikTok, Instagram, etc.) or read recipe blogs and want to actually make those dishes. They are motivated to cook but need a simple path from “saw this” to “bought the ingredients and cooked it.” They often use their phone to browse and shop, so a mobile-first app fits their habits.

**Secondary: Busy people who want to reduce decision fatigue.**  
Users who want one place to keep “what I want to cook” and “what I need to buy,” instead of juggling multiple apps or notes. They value clarity (categorized lists, recipe labels) and speed (one-tap add to grocery list, check-off while shopping).

**Geographic and platform.**  
Anyone with a smartphone (iOS or Android) who consumes recipe content online. The app is built with React Native (Expo) for both platforms and uses AI (Google Gemini) and in-app monetization (RevenueCat) so it can scale with a single codebase.

---

## 3. Monetization Strategy

**Model: Freemium with in-app purchases (RevenueCat).**

**Free tier:**  
Users get **3 recipe extractions per month** (paste a video URL → AI extracts recipe → save and add to grocery list). This is enough to try the full flow and see value. The limit resets each calendar month. Free users have full access to My Recipes and Grocery List for the recipes they’ve already extracted.

**Cookflow Pro (paid):**  
Unlimited recipe extractions from video links and unlimited saved recipes. Pro is offered as a **subscription** (e.g. monthly/yearly) or **one-time purchase** (e.g. lifetime), configured in RevenueCat. Paying users never hit the extraction limit and can build a large recipe library and grocery lists from any number of videos.

**Implementation:**  
- **RevenueCat** handles entitlements, offerings, and store connectivity (App Store, Google Play, Test Store for development).  
- The app checks the **“cookflow Pro”** entitlement to gate unlimited extractions and show or hide the paywall.  
- A **paywall** is shown when a free user reaches the monthly limit (or taps “Unlock unlimited extractions”).  
- **Restore purchases** is available so users who reinstall or switch devices can regain Pro.

**Rationale:**  
The free tier demonstrates the core value (video → recipe → grocery list) with minimal friction. The limit is clear (3 per month) and encourages conversion for heavy users without blocking light use. RevenueCat keeps implementation simple and supports subscriptions and one-time options for different user preferences.

---

**Summary:** Cookflow addresses the gap between saving recipes and actually cooking by turning recipe video URLs into structured recipes and grocery lists in one app. The target audience is home cooks who discover recipes online and want a single flow to shop and cook. Monetization is freemium via RevenueCat: 3 free extractions per month, with Cookflow Pro unlocking unlimited extractions and a larger recipe library.
