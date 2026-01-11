
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, ImageFile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RECIPE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: '料理名' },
    ingredients: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: '材料と分量 (例: "豚肉: 200g")' 
    },
    time: { type: Type.STRING, description: '調理時間' },
    steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: '手順' },
    advice: { type: Type.STRING, description: 'シェフのアドバイス' },
    portions: { type: Type.INTEGER, description: '何人前か' },
  },
  required: ["title", "ingredients", "time", "steps", "advice", "portions"],
};

export const generateRecipe = async (images: ImageFile[], portions: number): Promise<Recipe> => {
  const imageParts = images.map(img => ({
    inlineData: { mimeType: img.mimeType, data: img.base64 },
  }));

  const prompt = `
    あなたは「AI冷蔵庫シェフ」です。画像から食材を特定してください。
    【重要】画像に写っている食材を「すべて」使う必要はありません。
    写っているものの中から、相性の良いものを「選択」して、${portions}人前の美味しいレシピを作ってください。
    基本調味料（塩・醤油等）は家にある前提でOKです。
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [...imageParts, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: RECIPE_SCHEMA,
    },
  });

  return JSON.parse(response.text) as Recipe;
};
