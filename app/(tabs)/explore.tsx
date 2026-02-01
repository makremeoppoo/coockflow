import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { appwriteConfig } from '@/lib/appwrite';
import styles from "../styles";

const Cart = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Helper function to extract video content from various sources
  const getVideoContent = async (url: string): Promise<string> => {
    try {
      // For YouTube videos, try to get transcript
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return await getYouTubeContent(url);
      }
      
      // For other platforms, scrape metadata
      return await scrapeVideoMetadata(url);
    } catch (error) {
      console.error('Error getting video content:', error);
      throw new Error('Could not extract video content. Please ensure the URL is valid and accessible.');
    }
  };

  // YouTube content extraction (using subtitle/description)
  const getYouTubeContent = async (url: string): Promise<string> => {
    try {
      // Extract video ID
      const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (!videoIdMatch) {
        throw new Error('Invalid YouTube URL');
      }
      
      const videoId = videoIdMatch[1];
      
      // Fetch video page to extract metadata
      const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const html = await response.text();
      
      // Extract title
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(' - YouTube', '').trim() : '';
      
      // Extract description from meta tags
      const descMatch = html.match(/<meta name="description" content="([^"]*)">/i);
      const description = descMatch ? descMatch[1] : '';
      
      // Try to extract from JSON-LD structured data
      const jsonLdMatch = html.match(/<script type="application\/ld\+json">({[^<]+})<\/script>/i);
      let structuredDesc = '';
      if (jsonLdMatch) {
        try {
          const jsonData = JSON.parse(jsonLdMatch[1]);
          structuredDesc = jsonData.description || '';
        } catch (e) {}
      }
      
      const content = `
Video Title: ${title}
Video Description: ${description || structuredDesc}
Video URL: ${url}
      `.trim();
      
      if (!title && !description && !structuredDesc) {
        throw new Error('Could not extract video information');
      }
      
      return content;
    } catch (error) {
      console.error('YouTube extraction error:', error);
      throw error;
    }
  };

  // Generic metadata scraper for other platforms
  const scrapeVideoMetadata = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const html = await response.text();
      
      // Extract various meta tags
      const title = 
        html.match(/<meta property="og:title" content="([^"]*)">/i)?.[1] ||
        html.match(/<meta name="twitter:title" content="([^"]*)">/i)?.[1] ||
        html.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
      
      const description = 
        html.match(/<meta property="og:description" content="([^"]*)">/i)?.[1] ||
        html.match(/<meta name="description" content="([^"]*)">/i)?.[1] ||
        html.match(/<meta name="twitter:description" content="([^"]*)">/i)?.[1] || '';
      
      const keywords = 
        html.match(/<meta name="keywords" content="([^"]*)">/i)?.[1] || '';
      
      // Try to extract recipe schema if present
      const recipeSchemaMatch = html.match(/<script type="application\/ld\+json">({[^<]*"@type"\s*:\s*"Recipe"[^<]*})<\/script>/i);
      let recipeSchema = '';
      if (recipeSchemaMatch) {
        try {
          const schema = JSON.parse(recipeSchemaMatch[1]);
          recipeSchema = `
Recipe Name: ${schema.name || ''}
Ingredients: ${Array.isArray(schema.recipeIngredient) ? schema.recipeIngredient.join(', ') : ''}
Instructions: ${Array.isArray(schema.recipeInstructions) ? 
  schema.recipeInstructions.map((s: any) => typeof s === 'string' ? s : s.text).join(' ') : ''}
          `.trim();
        } catch (e) {}
      }
      
      const content = `
Video/Recipe Title: ${title}
Description: ${description}
Keywords: ${keywords}
${recipeSchema}
Video URL: ${url}
      `.trim();
      
      if (!title && !description) {
        throw new Error('Could not extract content from URL');
      }
      
      return content;
    } catch (error) {
      console.error('Metadata extraction error:', error);
      throw new Error('Unable to access video content. The video may be private or require authentication.');
    }
  };

  const extractRecipe = async () => {
    if (!videoUrl.trim()) {
      Alert.alert('Error', 'Please enter a video URL');
      return;
    }
  
    setIsExtracting(true);
  
    try {
      const apiKey =
        appwriteConfig.geminiApiKey ??
        process.env.EXPO_PUBLIC_GEMINI_API_KEY ??
        '';
      if (!apiKey) {
        Alert.alert(
          'Error',
          'Missing Gemini API key. Add EXPO_PUBLIC_GEMINI_API_KEY to .env'
        );
        return;
      }
  
      // Step 1: Extract video content
      console.log('Extracting content from:', videoUrl.trim());
      const videoContent = await getVideoContent(videoUrl.trim());
      console.log('Extracted content:', videoContent.substring(0, 300) + '...');
  
      // Step 2: Analyze with Gemini
      const prompt = `Analyze this recipe video/content and extract recipe information.

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

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${appwriteConfig.geminiModel}:generateContent?key=${encodeURIComponent(
          apiKey
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 3000,
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      const rawText = await response.text();
      console.log('Gemini Raw Response:', rawText.substring(0, 300) + '...');

      if (!response.ok) {
        let errorMsg = `API Error (${response.status})`;
        try {
          const errJson = JSON.parse(rawText);
          errorMsg = errJson.error?.message || errorMsg;
        } catch (e) {}
        
        if (response.status === 503) {
          throw new Error('Gemini service unavailable. Please try again in a moment.');
        }
        throw new Error(errorMsg);
      }

      if (!rawText || !rawText.trim()) {
        throw new Error('Empty response from AI');
      }

      // Parse Gemini's response structure
      let parsed: any;
      try {
        parsed = JSON.parse(rawText);
      } catch (e) {
        console.error('Failed to parse response:', rawText);
        throw new Error('Invalid response format from AI');
      }

      // Extract content from Gemini's response structure
      const candidate = parsed.candidates?.[0];
      if (!candidate) {
        throw new Error('No response generated by AI');
      }

      const contentText = candidate.content?.parts?.[0]?.text;
      if (!contentText) {
        throw new Error('Empty content in AI response');
      }

      console.log('Extracted recipe JSON:', contentText.substring(0, 300) + '...');

      // Parse the recipe JSON
      let recipeData: any;
      try {
        let cleaned = contentText.trim();
        
        // Remove markdown code blocks if present
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }
        
        recipeData = JSON.parse(cleaned);
      } catch (e: any) {
        console.error('Failed to parse recipe JSON:', contentText);
        throw new Error(`Invalid recipe format: ${e.message}`);
      }

      // Validate required fields
      if (!recipeData.title) {
        throw new Error('Recipe missing title');
      }
      if (!recipeData.ingredients || !Array.isArray(recipeData.ingredients) || recipeData.ingredients.length === 0) {
        throw new Error('Recipe missing ingredients');
      }
      if (!recipeData.instructions || !Array.isArray(recipeData.instructions) || recipeData.instructions.length === 0) {
        throw new Error('Recipe missing instructions');
      }

      // Add metadata
      const recipe = {
        ...recipeData,
        id: Date.now().toString(),
        sourceUrl: videoUrl.trim(),
        addedDate: new Date().toISOString(),
      };
  
      const updatedRecipes: any[] = [...savedRecipes, recipe];
      setSavedRecipes(updatedRecipes as never[]);
      await saveToStorage('recipes', updatedRecipes);
  
      setVideoUrl('');
      
      Alert.alert(
        'Success! ✨',
        `"${recipe.title}" has been added to your recipes`
      );
    } catch (error) {
      console.error('Extraction error:', error);
      
      let errorMessage = 'Failed to extract recipe. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Alert.alert('Extraction Failed', errorMessage);
    } finally {
      setIsExtracting(false);
    }
  };
  
  const saveToStorage = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Storage error:', error);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView style={styles.tabContent}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Turn Recipe Videos into Action</Text>
          <Text style={styles.heroSubtitle}>
            Paste any recipe video link. Get instant ingredients, instructions, and grocery
            lists.
          </Text>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Recipe Video URL</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="link" size={20} color="#f97316" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={videoUrl}
              onChangeText={setVideoUrl}
              placeholder="https://youtube.com/watch?v=..."
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.extractButton, (!videoUrl.trim() || isExtracting) && styles.buttonDisabled]}
            onPress={extractRecipe}
            disabled={!videoUrl.trim() || isExtracting}
          >
            {isExtracting ? (
              <>
                <ActivityIndicator color="#fff" style={styles.buttonLoader} />
                <Text style={styles.extractButtonText}>Extracting...</Text>
              </>
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color="#fff" />
                <Text style={styles.extractButtonText}>Extract Recipe</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Supported:</Text> YouTube, TikTok, Instagram,
              Facebook, and most recipe websites
            </Text>
          </View>
        </View>

        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>✨ How it works</Text>
            <Text style={styles.featureText}>1. Paste a recipe video URL</Text>
            <Text style={styles.featureText}>2. AI extracts ingredients & steps</Text>
            <Text style={styles.featureText}>3. Add to grocery list</Text>
            <Text style={styles.featureText}>4. Cook with confidence!</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🎯 Features</Text>
            <Text style={styles.featureText}>• Smart ingredient parsing</Text>
            <Text style={styles.featureText}>• Organized grocery lists</Text>
            <Text style={styles.featureText}>• Save favorite recipes</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;