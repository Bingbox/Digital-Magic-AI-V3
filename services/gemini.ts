
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { AIModel } from "../types";

export class GeminiService {
  private static getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Generate text content using Gemini models
  static async generateText(prompt: string, model: AIModel = AIModel.PRO, systemInstruction?: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: model, // Use the user-selected model
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "你是一位专业的数字商业化专家，擅长撰写高转化率的文案。",
        temperature: 0.7,
        // Only Gemini 3 and 2.5 series models support thinkingConfig
        thinkingConfig: model === AIModel.PRO ? { thinkingBudget: 4096 } : undefined 
      },
    });
    return response.text;
  }

  // Generate image content using nano banana series models
  static async generateImage(prompt: string, options: any) {
    const ai = this.getClient();
    const modelName = options.model || AIModel.IMAGE_PRO;
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: options.aspectRatio || "1:1",
          imageSize: options.imageSize || "1K"
        },
        // Google Search is only available for gemini-3-pro-image-preview
        tools: modelName === AIModel.IMAGE_PRO ? [{ googleSearch: {} }] : undefined
      }
    });

    // Iterate through all parts to find the image part as per guidelines
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  }

  // Generate video content using Veo models
  static async generateVideo(prompt: string, aspectRatio: string = "16:9") {
    const ai = this.getClient();
    let operation = await ai.models.generateVideos({
      model: AIModel.VEO_HD, 
      prompt: `商业电影级镜头: ${prompt}, 1080p, 高动态范围, 细腻纹理`,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: aspectRatio as any
      }
    });

    // Poll the operation until completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    // Append API key when fetching from the download link as per guidelines
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
