
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

  static getHistory(lang: 'zh' | 'en' = 'zh') {
    const stored = localStorage.getItem('magic_deeds');
    if (stored) return JSON.parse(stored);

    // 返回内置样例素材 (3x3 矩阵)
    const samples = [
      // IMAGE SAMPLES
      {
        id: 's_img_1',
        title: lang === 'zh' ? '旗舰款机械表海报' : 'Flagship Mechanical Watch',
        type: 'image',
        timestamp: new Date().toISOString(),
        preview: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
        tags: ['Watch', 'Luxury'],
        content: ''
      },
      {
        id: 's_img_2',
        title: lang === 'zh' ? '全效护肤系列全集' : 'Skincare Glow Collection',
        type: 'image',
        timestamp: new Date().toISOString(),
        preview: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800',
        tags: ['Beauty', 'Clean'],
        content: ''
      },
      {
        id: 's_img_3',
        title: lang === 'zh' ? '未来主义运动鞋渲染' : 'Cyber Runner 2025',
        type: 'image',
        timestamp: new Date().toISOString(),
        preview: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
        tags: ['Sneaker', 'Future'],
        content: ''
      },
      // TEXT SAMPLES
      {
        id: 's_txt_1',
        title: lang === 'zh' ? '精品咖啡小红书种草文' : 'Craft Coffee Social Post',
        type: 'text',
        timestamp: new Date().toISOString(),
        preview: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
        tags: ['Coffee', 'Viral'],
        content: lang === 'zh' 
          ? '【早起打工人续命神器☕️】\n口感顺滑不酸涩，每一口都是浓郁的坚果香气。唤醒早晨的不是闹钟，而是这杯手冲咖啡的治愈感... #我的咖啡日记 #咖啡控' 
          : '【Morning Survival Guide☕️】\nSmooth, non-acidic, with a rich nutty aroma in every sip. It\'s not the alarm that wakes me up, it\'s the healing power of this pour-over coffee... #CoffeeDaily #Caffeine'
      },
      {
        id: 's_txt_2',
        title: lang === 'zh' ? '智能家居系统 30s 广告脚本' : 'Smart Home 30s Script',
        type: 'text',
        timestamp: new Date().toISOString(),
        preview: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
        tags: ['IoT', 'Script'],
        content: lang === 'zh'
          ? '[画面：清晨阳光洒入]\n旁白：只需一句话，唤醒全家。灯光渐亮，咖啡机自动启动。\n[画面：主角推开房门]\n旁白：智联生活，懂你更懂家。'
          : '[Visual: Sunlight streaming in]\nVoiceover: One word to wake up the whole family. Lights on, coffee starts brewing.\n[Visual: Protagonist walking out]\nVoiceover: Connected life, knows you better.'
      },
      {
        id: 's_txt_3',
        title: lang === 'zh' ? '人体工学椅详情页核心卖点' : 'Ergonomic Chair USP',
        type: 'text',
        timestamp: new Date().toISOString(),
        preview: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
        tags: ['Office', 'Design'],
        content: lang === 'zh'
          ? '1. 双背弹性分区设计：精准支撑脊柱压力\n2. 高密度透气网布：久坐不闷热\n3. 4D可调节扶手：满足不同姿势需求'
          : '1. Dual-back elastic partition: Precise spine support\n2. High-density breathable mesh: No more stuffiness\n3. 4D adjustable armrests: Fits every posture'
      },
      // VIDEO SAMPLES
      {
        id: 's_vid_1',
        title: lang === 'zh' ? '赛博朋克城市霓虹延时' : 'Cyberpunk City Neon',
        type: 'video',
        timestamp: new Date().toISOString(),
        preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
        tags: ['VFX', 'Night'],
        content: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
      },
      {
        id: 's_vid_2',
        title: lang === 'zh' ? '高端面霜质感流体展示' : 'Luxury Cream Texture',
        type: 'video',
        timestamp: new Date().toISOString(),
        preview: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800',
        tags: ['Beauty', 'Macro'],
        content: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
      },
      {
        id: 's_vid_3',
        title: lang === 'zh' ? '户外运动装备动态特写' : 'Outdoor Gear Dynamic',
        type: 'video',
        timestamp: new Date().toISOString(),
        preview: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&q=80&w=800',
        tags: ['Sport', 'Nature'],
        content: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
      }
    ];

    return samples;
  }

  static saveToHistory(item: { title: string, type: 'image' | 'text' | 'video', content: string }) {
    const history = this.getHistory();
    const newItem = {
      ...item,
      id: `m_${Date.now()}`,
      timestamp: new Date().toISOString(),
      preview: item.type === 'image' ? item.content : (item.type === 'video' ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600' : 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=600'),
      tags: ['Created']
    };
    localStorage.setItem('magic_deeds', JSON.stringify([newItem, ...history]));
    return newItem;
  }
}
