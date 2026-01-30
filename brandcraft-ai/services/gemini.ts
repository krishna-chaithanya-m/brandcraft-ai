
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export type TextEngine = 'gemini' | 'granite';
export type ImageEngine = 'gemini-image' | 'stable-diffusion' | 'gemma';

export const generateBrandNames = async (industry: string, keywords: string, engine: TextEngine = 'gemini') => {
  const ai = getAI();
  const model = engine === 'granite' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  const systemInstruction = engine === 'granite' 
    ? "You are an IBM Granite AI specialist. Focus on enterprise-grade, reliable, and scalable brand names. Use clean plain text."
    : "You are a creative Gemini AI branding expert. Focus on catchy, modern, and memorable brand names. Use clean plain text.";

  const response = await ai.models.generateContent({
    model: model,
    contents: `Generate 10 creative and catchy brand names for the industry: ${industry}. Keywords: ${keywords}. Provide the name and a short explanation for each.`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            meaning: { type: Type.STRING }
          },
          required: ["name", "meaning"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const generateBrandStrategy = async (brandName: string, industry: string, description: string, engine: TextEngine = 'gemini') => {
  const ai = getAI();
  const model = engine === 'granite' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model: model,
    contents: `Brand: "${brandName}", Industry: "${industry}". Create a brand strategy based on: ${description}`,
    config: {
      systemInstruction: "You are a branding strategist. Output must be clean plain text. Do NOT use markdown symbols like ** or #. Use clear section labels in ALL CAPS.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mission: { type: Type.STRING },
          vision: { type: Type.STRING },
          values: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["mission", "vision", "values"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateLogo = async (prompt: string, industry: string, brandName: string, colors: string[], engine: ImageEngine = 'gemini-image') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = (engine === 'stable-diffusion') ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  const colorDirective = colors.length > 0 
    ? `Strictly use these colors: Primary ${colors[0]}, Secondary ${colors[1]}, Accent ${colors[2]}.`
    : "";

  const fullPrompt = `Professional minimalist vector logo for "${brandName}" in ${industry}. Style: ${prompt}. ${colorDirective} White background.`;
  
  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: [{ text: fullPrompt }] },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};

// Enhanced Refine existing logo colors using Image-to-Image
export const refineLogoColors = async (imageBase64: string, colors: string[], instruction: string = '', engine: ImageEngine = 'gemini-image') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = (engine === 'stable-diffusion') ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  const base64Data = imageBase64.split(',')[1];
  const mimeType = imageBase64.split(';')[0].split(':')[1];

  const colorList = `Primary ${colors[0]}, Secondary ${colors[1]}, and Accent ${colors[2]}`;
  const userRequirement = instruction ? `The user's specific color requirement is: "${instruction}".` : "Apply the new color palette accurately.";

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        { text: `TASK: RECOLOR LOGO. 
        INSTRUCTION: Keep the shapes, symbols, geometry, and layout of this logo COMPLETELY identical. 
        MODIFICATION: Change the colors of the logo parts to match this palette: ${colorList}. 
        ${userRequirement} 
        The background MUST stay pure white. The output must be a clean, high-resolution vector-style image.` }
      ]
    },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });

  const candidates = response.candidates || [];
  if (candidates.length > 0) {
    for (const part of candidates[0].content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
};

export const generateMarketingCopy = async (brandName: string, product: string, tone: string, engine: TextEngine = 'gemini') => {
  const ai = getAI();
  const model = engine === 'granite' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model: model,
    contents: `Brand: "${brandName}", Product: "${product}", Tone: ${tone}. Write 3 slogans, 2 social captions, and 1 email.`,
    config: {
      systemInstruction: "You are a professional copywriter. Use clean plain text only. Do NOT use markdown symbols like ** or underscores. Use capitalization for emphasis.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          slogans: { type: Type.ARRAY, items: { type: Type.STRING } },
          socialPosts: { type: Type.ARRAY, items: { type: Type.STRING } },
          email: { type: Type.STRING }
        },
        required: ["slogans", "socialPosts", "email"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeSentiment = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze sentiment: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          score: { type: Type.NUMBER },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              joy: { type: Type.NUMBER },
              trust: { type: Type.NUMBER },
              fear: { type: Type.NUMBER },
              surprise: { type: Type.NUMBER }
            }
          }
        },
        required: ["label", "score", "breakdown"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const createBrandAssistant = (systemInstruction: string) => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are the BrandCraft Senior Branding Consultant. 
      Your goal is to provide elite, professional, and creative branding advice. 
      
      CRITICAL FORMATTING RULE:
      - Do NOT use ANY Markdown characters. No asterisks (**), no underscores (_), no hash symbols (#).
      - Use ONLY clean plain text.
      - Use double line breaks between paragraphs for spacing.
      - Use UPPERCASE labels for section headers (e.g., RECOMMENDATION:).
      - Use simple bullet points like "-" or "•" if needed, but avoid complex formatting.
      
      RULES:
      1. Be professional yet inspiring.
      2. Always refer to the user's specific brand data if provided.
      3. If a user asks for designs, focus on the 'concept' and 'why' behind the design.
      4. Keep responses concise but high-impact.
      
      CONTEXT:
      ${systemInstruction}`
    }
  });
};
