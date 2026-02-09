
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
      const baseUrl = process.env.GEMINI_BASE_URL || 'https://aihubmix.com/v1';
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemInstruction || "你是一位数字商业化专家。你擅长创作高转化率的商业文案。" },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        })
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} - ${error}`);
      }
      
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    });
  }

  static async generateImage(prompt: string, options: any, referenceImage?: string) {
    return callWithRetry(async () => {
      const baseUrl = process.env.GEMINI_BASE_URL || 'https://aihubmix.com/v1';
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      
      const ecommercePrompt = `[ECOMMERCE HIGH-FIDELITY MODE]
      Task: ${prompt}.
      Requirement: 
      1. ABSOLUTELY PRESERVE all core features of the product/person from the reference image.
      2. DO NOT change shape, labels, colors, or textures of the primary subject.
      3. Style: Commercial high-end photography, professional studio lighting, realistic environment.
      4. Output: 4K resolution, hyper-realistic, sharp focus.`;

      const messageContent: any[] = [{ type: 'text', text: ecommercePrompt }];
      
      if (referenceImage) {
        messageContent.push({
          type: 'image_url',
          image_url: { url: referenceImage }
        });
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: options.model || AIModel.IMAGE_FLASH,
          messages: [
            { role: 'user', content: messageContent }
          ],
          temperature: 0.7,
        })
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} - ${error}`);
      }
      
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      // 如果响应中包含 base64 图像数据
      if (content && typeof content === 'string' && content.includes('data:image')) {
        return content.match(/data:image[^"]+/)?.[0] || content;
      }
      return content || '';
    });
  }


  static async generateVideo(prompt: string, model: AIModel = AIModel.VEO_FAST, aspectRatio: string = "16:9", options: any = {}) {
    const baseUrl = process.env.GEMINI_BASE_URL || 'https://aihubmix.com/v1';
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    
    // Fallback if incorrect model passed
    let videoModel = model;
    if (videoModel === AIModel.IMAGE_FLASH || videoModel === AIModel.IMAGE_PRO) {
      videoModel = AIModel.VEO_FAST;
    }

    const messageContent: any[] = [{ type: 'text', text: prompt }];
    
    if (options.image) {
      messageContent.push({
        type: 'image_url',
        image_url: { url: options.image }
      });
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: videoModel,
        messages: [
          { role: 'user', content: messageContent }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    // 返回视频 URL 或数据
    if (content) {
      return URL.createObjectURL(new Blob([content], { type: 'video/mp4' }));
    }
    throw new Error("No video data found in response");
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
