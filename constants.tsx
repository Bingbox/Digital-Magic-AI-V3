
import React from 'react';

// 定价逻辑：(API成本 * 1.4 利润系数) * 10 能量/元
export const ENERGY_COSTS = {
  TEXT_PRO: 2,      // Gemini 3 Pro
  TEXT_FLASH: 1,    // Gemini 3 Flash
  IMAGE_PRO: 6,     // Gemini 3 Pro Image (1K/2K/4K)
  IMAGE_FLASH: 3,   // Gemini 2.5 Flash Image
  VIDEO_HD: 140,    // Veo 3.1 Generate (1080p, 高质量)
  VIDEO_FAST: 70,   // Veo 3.1 Fast (720p, 极速)
};

export const IMAGE_TOOLS = [
  { id: 'scene', name: '场景生成', description: '将商品融入写实环境', icon: '🎨' },
  { id: 'white_bg', name: '白底/透明', description: '高精度商品抠图', icon: '✂️' },
  { id: 'main_img', name: '商品主图', description: '爆款电商主图设计', icon: '🛍️' },
  { id: 'marketing', name: '营销海报', description: '自动排版促销文案', icon: '📢' },
  { id: 'virtual_tryon', name: '智能试衣', description: 'AI模特上身效果', icon: '👕' },
  { id: 'home_scene', name: '家居场景', description: '全屋软装AI预览', icon: '🏠' },
];

export const TEXT_TOOLS = [
  { id: 'video_script', name: '视频脚本', description: '短视频分镜设计', icon: '🎬' },
  { id: 'live_script', name: '直播脚本', description: '卖点梳理与话术', icon: '🎙️' },
  { id: 'xiaohongshu', name: '种草文案', description: '小红书爆款风格', icon: '📸' },
  { id: 'product_desc', name: '详情页文案', description: '专业商品卖点提炼', icon: '📜' },
  { id: 'hot_topic', name: '热点文案', description: '实时热搜借势', icon: '🔥' },
];

export const VIDEO_TOOLS = [
  { id: 'text_to_video', name: '文生视频', description: '纯文字创作大片', icon: '🎞️' },
  { id: 'img_to_video', name: '图生视频', description: '静态图一键动起来', icon: '✨' },
  { id: 'remix', name: '视频混剪', description: '多素材批量合成', icon: '📽️' },
  { id: 'anime', name: '视频转动漫', description: '次元壁突破滤镜', icon: '👺' },
];

export const PRICING_PLANS = [
  {
    id: 'free',
    name: '免费版',
    price: '0',
    features: ['基础文字生成', '低分辨率图片', '每日 10 次额度'],
    buttonText: '当前方案',
  },
  {
    id: 'pro',
    name: '专业版',
    price: '199',
    features: ['4K 超清图像', '全功能视频工具', '批量处理支持', '优先生成通道'],
    buttonText: '立即升级',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: 'Custom',
    features: ['无限量额度', '专属模型训练', 'API 调用支持', '一对一顾问服务'],
    buttonText: '联系销售',
  },
];
