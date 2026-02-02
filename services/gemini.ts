
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { AIModel } from "../types";

export class GeminiService {
  private static getClient() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API_KEY_MISSING");
    return new GoogleGenAI({ apiKey });
  }

  static async generateText(prompt: string, model: AIModel = AIModel.PRO, systemInstruction?: string) {
    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "你是一位享誉全球的数字商业化专家。你擅长创作极具诱惑力、高转化率且符合品牌调性的专业文案。你的输出应逻辑严密，充满创意。",
          temperature: 0.8,
          topP: 0.95,
          thinkingConfig: (model.includes('pro') || model.includes('3')) ? { thinkingBudget: 16384 } : undefined 
        },
      });
      return response.text;
    } catch (error: any) {
      console.error("Text generation failed:", error);
      throw error;
    }
  }

  static async generateImage(prompt: string, options: any, referenceImage?: string) {
    const ai = this.getClient();
    const modelName = options.model || AIModel.IMAGE_PRO;
    
    const enhancedPrompt = `${prompt}. High-end commercial photography, studio lighting, 8k resolution, photorealistic, intricate textures, masterpiece.`;
    const parts: any[] = [{ text: enhancedPrompt }];

    if (referenceImage) {
      const match = referenceImage.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        parts.unshift({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: options.aspectRatio || "1:1",
          imageSize: options.imageSize || "1K"
        },
        tools: modelName === AIModel.IMAGE_PRO ? [{ googleSearch: {} }] : undefined
      }
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("模型未返回有效候选内容。");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("图像像素重组失败，未能在响应中提取到图像数据。");
  }

  static async generateVideo(prompt: string, model: AIModel = AIModel.VEO_HD, aspectRatio: string = "16:9") {
    const ai = this.getClient();
    
    let operation = await ai.models.generateVideos({
      model: model, 
      prompt: `Cinematic professional shot: ${prompt}, 1080p, ultra-detailed, smooth motion, high dynamic range, professional color grading.`,
      config: {
        numberOfVideos: 1,
        resolution: model === AIModel.VEO_HD ? '1080p' : '720p',
        aspectRatio: aspectRatio as any
      }
    });

    // 健壮的轮询机制
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
      throw new Error(operation.error.message || "视频渲染引擎异常");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("未找到生成的视频资源");

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) throw new Error(`视频下载失败: ${response.statusText}`);
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  // 辅助方法：保存生成的素材到模拟的全局历史中
  static saveToHistory(item: { title: string, type: 'image' | 'text' | 'video', content: string }) {
    const history = JSON.parse(localStorage.getItem('magic_deeds') || '[]');
    const newItem = {
      ...item,
      id: `m_${Date.now()}`,
      timestamp: new Date().toISOString(),
      preview: item.type === 'image' ? item.content : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600'
    };
    localStorage.setItem('magic_deeds', JSON.stringify([newItem, ...history]));
    return newItem;
  }
}
