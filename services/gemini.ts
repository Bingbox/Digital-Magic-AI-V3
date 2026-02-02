
import { GoogleGenAI, GenerateContentResponse, VideoGenerationReferenceType } from "@google/genai";
import { AIModel } from "../types";

/**
 * 实现指数退避重试逻辑
 */
async function callWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorMsg = error.message || JSON.stringify(error);
    // 捕获 429 错误或配额耗尽错误
    if (retries > 0 && (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED"))) {
      console.warn(`Magic Quota exhausted. Retrying in ${delay}ms... (Retries left: ${retries})`);
      await new Promise(r => setTimeout(r, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export class GeminiService {
  static async generateText(prompt: string, model: AIModel = AIModel.FLASH, systemInstruction?: string) {
    return callWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "你是一位数字商业化专家。你擅长创作高转化率的商业文案。",
          temperature: 0.7,
        },
      });
      return response.text;
    });
  }

  static async generateImage(prompt: string, options: any, referenceImage?: string) {
    return callWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const ecommercePrompt = `[ECOMMERCE HIGH-FIDELITY MODE]
      Task: ${prompt}.
      Requirement: 
      1. ABSOLUTELY PRESERVE all core features of the product/person from the reference image.
      2. DO NOT change shape, labels, colors, or textures of the primary subject.
      3. Style: Commercial high-end photography, professional studio lighting, realistic environment.
      4. Output: 4K resolution, hyper-realistic, sharp focus.`;
      
      const parts: any[] = [{ text: ecommercePrompt }];

      if (referenceImage) {
        const match = referenceImage.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          parts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          });
        }
      }

      const response = await ai.models.generateContent({
        model: options.model || AIModel.IMAGE_FLASH,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: options.aspectRatio || "1:1",
            imageSize: options.imageSize || "1K"
          }
        }
      });

      if (!response.candidates?.[0]?.content?.parts) {
        throw new Error("Empty response from model");
      }

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data found in response");
    });
  }

  static async generateVideo(prompt: string, model: AIModel = AIModel.IMAGE_FLASH, aspectRatio: string = "16:9", options: any = {}) {
    return callWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const parts: any[] = [{ 
        text: `[MAGIC VISUAL CREATION] Create a high-quality cinematic commercial visual for: ${prompt}. 
        Style: Professional film lighting, cinematic color grading, 8k resolution, advertising quality. 
        Note: Output as a high-fidelity visual asset.` 
      }];

      if (options.image) {
        const match = options.image.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          parts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          });
        }
      }

      const response = await ai.models.generateContent({
        model: AIModel.IMAGE_FLASH, 
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as any) || "16:9",
          }
        }
      });

      if (!response.candidates?.[0]?.content?.parts) {
        throw new Error("Empty response from model");
      }

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      
      throw new Error("No visual data generated");
    });
  }

  static getHistory(lang: 'zh' | 'en' = 'zh') {
    const stored = localStorage.getItem('magic_deeds');
    if (stored) return JSON.parse(stored);
    return [];
  }

  static saveToHistory(item: { title: string, type: 'image' | 'text' | 'video', content: string }) {
    const history = this.getHistory();
    const newItem = {
      ...item,
      id: `m_${Date.now()}`,
      timestamp: new Date().toISOString(),
      preview: item.type === 'image' || item.type === 'video' ? item.content : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
      tags: ['AI-Generated', 'Commercial']
    };
    localStorage.setItem('magic_deeds', JSON.stringify([newItem, ...history]));
    return newItem;
  }
}
