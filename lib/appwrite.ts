
export const appwriteConfig = {
    geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
    geminiModel: process.env.EXPO_PUBLIC_GEMINI_MODEL ?? 'gemini-3-flash-preview',
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.app.cookflow",
}

