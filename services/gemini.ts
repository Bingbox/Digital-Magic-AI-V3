
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

      const modelName = options.model || AIModel.IMAGE_FLASH;
      const imageConfig: any = {
        aspectRatio: options.aspectRatio || "1:1"
      };

      // CRITICAL: imageSize is ONLY supported for gemini-3-pro-image-preview
      if (modelName === AIModel.IMAGE_PRO) {
        imageConfig.imageSize = options.imageSize || "1K";
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: {
          imageConfig: imageConfig
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

  static async generateVideo(prompt: string, model: AIModel = AIModel.VEO_FAST, aspectRatio: string = "16:9", options: any = {}) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Fallback if incorrect model passed
    let videoModel = model;
    if (videoModel === AIModel.IMAGE_FLASH || videoModel === AIModel.IMAGE_PRO) {
      videoModel = AIModel.VEO_FAST;
    }

    const config: any = {
      numberOfVideos: 1,
      resolution: videoModel === AIModel.VEO_HD ? '1080p' : '720p',
      aspectRatio: aspectRatio,
    };

    // Define initiation function for retry logic
    const initGeneration = async () => {
      if (options.image) {
        const match = options.image.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          return await ai.models.generateVideos({
            model: videoModel,
            prompt: prompt,
            image: {
              mimeType: match[1],
              imageBytes: match[2]
            },
            config
          });
        }
      }
      return await ai.models.generateVideos({
        model: videoModel,
        prompt: prompt,
        config
      });
    };

    // Step 1: Initiate Video Generation (with retry for 429s)
    let operation = await callWithRetry(initGeneration);

    // Step 2: Poll for completion
    // Note: Video generation takes time (minutes), so we poll with a longer interval
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5s interval
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    // Step 3: Retrieve Result
    const vid = operation.response?.generatedVideos?.[0]?.video;
    if (!vid?.uri) {
      throw new Error("Video generation completed but no URI returned.");
    }

    // Step 4: Fetch actual video bytes
    const response = await fetch(`${vid.uri}&key=${process.env.API_KEY}`);
    if (!response.ok) throw new Error("Failed to download video content");
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
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
