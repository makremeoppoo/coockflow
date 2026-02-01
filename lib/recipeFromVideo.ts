/**
 * Extract text content from recipe video URLs (YouTube, etc.) and
 * call Gemini to parse into a structured recipe.
 */

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

export async function getVideoContent(url: string): Promise<string> {
  try {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return await getYouTubeContent(url);
    }
    return await scrapeVideoMetadata(url);
  } catch (error) {
    console.error("Error getting video content:", error);
    throw new Error(
      "Could not extract video content. Please ensure the URL is valid and accessible."
    );
  }
}

async function getYouTubeContent(url: string): Promise<string> {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
  );
  if (!videoIdMatch) throw new Error("Invalid YouTube URL");

  const response = await fetch(
    `https://www.youtube.com/watch?v=${videoIdMatch[1]}`,
    { headers: { "User-Agent": USER_AGENT } }
  );
  const html = await response.text();

  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch
    ? titleMatch[1].replace(" - YouTube", "").trim()
    : "";

  const descMatch = html.match(/<meta name="description" content="([^"]*)">/i);
  const description = descMatch ? descMatch[1] : "";

  let structuredDesc = "";
  const jsonLdMatch = html.match(
    /<script type="application\/ld\+json">({[^<]+})<\/script>/i
  );
  if (jsonLdMatch) {
    try {
      const jsonData = JSON.parse(jsonLdMatch[1]);
      structuredDesc = jsonData.description || "";
    } catch (_) {}
  }

  const content = [
    `Video Title: ${title}`,
    `Video Description: ${description || structuredDesc}`,
    `Video URL: ${url}`,
  ].join("\n");

  if (!title && !description && !structuredDesc) {
    throw new Error("Could not extract video information");
  }
  return content;
}

async function scrapeVideoMetadata(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });
  const html = await response.text();

  const title =
    html.match(/<meta property="og:title" content="([^"]*)">/i)?.[1] ||
    html.match(/<meta name="twitter:title" content="([^"]*)">/i)?.[1] ||
    html.match(/<title>([^<]+)<\/title>/i)?.[1] ||
    "";

  const description =
    html.match(/<meta property="og:description" content="([^"]*)">/i)?.[1] ||
    html.match(/<meta name="description" content="([^"]*)">/i)?.[1] ||
    html.match(/<meta name="twitter:description" content="([^"]*)">/i)?.[1] ||
    "";

  const keywords =
    html.match(/<meta name="keywords" content="([^"]*)">/i)?.[1] || "";

  let recipeSchema = "";
  const recipeSchemaMatch = html.match(
    /<script type="application\/ld\+json">({[^<]*"@type"\s*:\s*"Recipe"[^<]*})<\/script>/i
  );
  if (recipeSchemaMatch) {
    try {
      const schema = JSON.parse(recipeSchemaMatch[1]);
      recipeSchema = [
        `Recipe Name: ${schema.name || ""}`,
        `Ingredients: ${Array.isArray(schema.recipeIngredient) ? schema.recipeIngredient.join(", ") : ""}`,
        `Instructions: ${Array.isArray(schema.recipeInstructions) ? schema.recipeInstructions.map((s: any) => (typeof s === "string" ? s : s.text)).join(" ") : ""}`,
      ].join("\n");
    } catch (_) {}
  }

  const content = [
    `Video/Recipe Title: ${title}`,
    `Description: ${description}`,
    `Keywords: ${keywords}`,
    recipeSchema,
    `Video URL: ${url}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (!title && !description) {
    throw new Error("Could not extract content from URL");
  }
  return content;
}

const GEMINI_RECIPE_PROMPT = (videoContent: string) =>
  `Analyze this recipe video/content and extract recipe information.

${videoContent}

Return ONLY a valid JSON object with this exact structure (no markdown, no backticks, no explanation):

{
  "title": "Recipe Name",
  "servings": 4,
  "prepTime": "15 mins",
  "cookTime": "30 mins",
  "ingredients": [
    {"item": "ingredient name", "amount": "2 cups", "category": "pantry"}
  ],
  "instructions": ["Step 1 description", "Step 2 description"],
  "tags": ["dinner", "easy"],
  "imageUrl": null
}

Valid categories: produce, dairy, meat, pantry, frozen, bakery, spices, other

Rules:
- Extract ALL ingredients mentioned with their amounts
- Create clear, numbered step-by-step instructions
- Infer reasonable values if exact amounts are missing
- Use appropriate categories for each ingredient
- Add relevant tags based on cuisine type, difficulty, meal type`;

export type RecipeData = {
  title: string;
  servings?: number;
  prepTime?: string;
  cookTime?: string;
  ingredients: Array<{ item: string; amount?: string; category?: string }>;
  instructions: string[];
  tags?: string[];
  imageUrl?: string | null;
};

export async function extractRecipeWithGemini(
  videoContent: string,
  apiKey: string,
  model: string
): Promise<RecipeData> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: GEMINI_RECIPE_PROMPT(videoContent) }] },
        ],
        generationConfig: {
          maxOutputTokens: 3000,
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  const rawText = await response.text();

  if (!response.ok) {
    let errorMsg = `API Error (${response.status})`;
    try {
      const errJson = JSON.parse(rawText);
      errorMsg = errJson.error?.message || errorMsg;
    } catch (_) {}
    if (response.status === 503) {
      throw new Error(
        "Gemini service unavailable. Please try again in a moment."
      );
    }
    throw new Error(errorMsg);
  }

  if (!rawText?.trim()) throw new Error("Empty response from AI");

  let parsed: any;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error("Invalid response format from AI");
  }

  const candidate = parsed.candidates?.[0];
  if (!candidate) throw new Error("No response generated by AI");

  const contentText = candidate.content?.parts?.[0]?.text;
  if (!contentText) throw new Error("Empty content in AI response");

  let cleaned = contentText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  let recipeData: RecipeData;
  try {
    recipeData = JSON.parse(cleaned);
  } catch (e: any) {
    throw new Error(`Invalid recipe format: ${e.message}`);
  }

  if (!recipeData.title) throw new Error("Recipe missing title");
  if (
    !Array.isArray(recipeData.ingredients) ||
    recipeData.ingredients.length === 0
  ) {
    throw new Error("Recipe missing ingredients");
  }
  if (
    !Array.isArray(recipeData.instructions) ||
    recipeData.instructions.length === 0
  ) {
    throw new Error("Recipe missing instructions");
  }

  return recipeData;
}
