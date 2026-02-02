
import React from 'react';
import { 
  ShoppingBag, 
  Globe, 
  ShoppingCart, 
  Store, 
  Video, 
  Package, 
  Layers, 
  Smartphone,
  Layout,
  MessageSquare,
  PlayCircle,
  Share2,
  Tv
} from 'lucide-react';

// --- 品牌原生 SVG 图标库 ---
const BrandIcon = ({ size = 20, d, viewBox = "0 0 1024 1024", fill = "currentColor" }: { size?: number, d: string | string[], viewBox?: string, fill?: string }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-110">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

// 淘宝: 品牌“淘”字核心
const TaobaoIcon = (props: any) => (
  <BrandIcon {...props} d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm229.4 612.3c-24.8 54.3-64.7 99.6-118.9 135.2-13.6 8.9-31.5 4.9-40.4-8.7-8.9-13.6-4.9-31.5 8.7-40.4 43.1-28.3 75.2-64.6 95.8-108.3 4.2-8.9 12.8-14.4 22.3-14.4 3.7 0 7.4.8 10.9 2.5 14.8 6.9 20.8 24.8 13.9 39.6l-2.3 4.5zM512 368.6c-79.3 0-143.4-64.1-143.4-143.4S432.7 81.8 512 81.8s143.4 64.1 143.4 143.4-64.1 143.4-143.4 143.4z" />
);

// 京东: Joy 狗头剪影
const JDIcon = (props: any) => (
  <BrandIcon {...props} d="M848.3 145.4C765.7 75.3 644.2 32 512 32 379.8 32 258.3 75.3 175.7 145.4c-85 72-143.7 172.9-143.7 286.6 0 113.7 58.7 214.6 143.7 286.6l3.5 2.9V880c0 30.9 25.1 56 56 56h31.7c30.9 0 56-25.1 56-56v-41.9c54.7 19.8 114.7 31.9 179.1 31.9 64.4 0 124.4-12.1 179.1-31.9V880c0 30.9 25.1 56 56 56H769c30.9 0 56-25.1 56-56V721.5l3.5-2.9C913.3 646.6 972 545.7 972 432c0-113.7-58.7-214.6-143.7-286.6zM512 688c-141.4 0-256-114.6-256-256s114.6-256 256-256 256 114.6 256 256-114.6 256-256 256z" />
);

// 抖音: 标志性音符
const DouyinIcon = (props: any) => (
  <BrandIcon {...props} d="M783.5 352.3c-64 0-120.7-32.3-154.5-81.5v394.3c0 142.3-115.3 257.6-257.6 257.6S113.8 807.4 113.8 665.1s115.3-257.6 257.6-257.6c31.3 0 60.9 5.6 88.2 15.8V267c-31.5-6.9-64.2-10.6-97.8-10.6-218.4 0-395.4 177.1-395.4 395.4s177.1 395.4 395.4 395.4 395.4-177.1 395.4-395.4V365.1c42.8 38.6 99.8 62.3 162.3 62.3v-75.1z" />
);

// 小红书: 抽象标志
const XiaohongshuIcon = (props: any) => (
  <BrandIcon {...props} d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm192 480c0 106-86 192-192 192s-192-86-192-192 86-192 192-192 192 86 192 192z" />
);

// Bilibili: 经典电视头
const BilibiliIcon = (props: any) => (
  <BrandIcon {...props} d="M790.2 165.4l58.1-61.9c13.7-14.6 12.8-37.4-2.1-51-14.8-13.6-37.5-12.7-51.2 1.9l-72.2 76.9c-64.8-21.6-135-33.6-210.8-33.6s-146 12-210.8 33.6l-72.2-76.9c-13.7-14.6-36.4-15.5-51.2-1.9s-15.8 36.4-2.1 51l58.1 61.9C110.1 247.9 32 376.5 32 522.2s78.1 274.3 201.8 356.8c64.8 43.1 143 68.3 227 71.9l12.4 1.1h77.6l12.4-1.1c84-3.6 162.2-28.8 227-71.9 123.7-82.5 201.8-211.1 201.8-356.8s-78.1-274.3-201.8-356.8zM352 642.1c-35.3 0-64-28.7-64-64V441.4c0-35.3 28.7-64 64-64s64 28.7 64 64v136.7c0 35.3-28.7 64-64 64zm320 0c-35.3 0-64-28.7-64-64V441.4c0-35.3 28.7-64 64-64s64 28.7 64 64v136.7c0 35.3-28.7 64-64 64z" />
);

// Shopify: S 袋标志
const ShopifyIcon = (props: any) => (
  <BrandIcon {...props} d="M784.8 316.4l-42.3-242.4C738.7 41.7 710.1 16 677.4 16h-330.8c-32.7 0-61.3 25.7-65.1 58l-42.3 242.4c-1.3 7.3-5.2 13.9-10.8 18.7l-47.5 40.5c-15.6 13.3-15.6 37.5 0 50.8l47.5 40.5c5.6 4.8 9.5 11.4 10.8 18.7l42.3 242.4c3.8 32.3 32.4 58 65.1 58h330.8c32.7 0 61.3-25.7 65.1-58l42.3-242.4c1.3-7.3 5.2-13.9 10.8-18.7l47.5-40.5c15.6-13.3 15.6-37.5 0-50.8l-47.5-40.5c-5.6-4.8-9.5-11.4-10.8-18.7z" />
);

// 拼多多: 爱心方阵
const PinduoduoIcon = (props: any) => (
  <BrandIcon {...props} d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm0 192c-106 0-192 86-192 192s86 192 192 192 192-86 192-192-86-192-192-192z" />
);

export const ENERGY_COSTS = {
  TEXT_PRO: 2,
  TEXT_FLASH: 1,
  IMAGE_PRO: 6,
  IMAGE_FLASH: 3,
  VIDEO_HD: 140,
  VIDEO_FAST: 70,
};

export type PlatformCategory = 'ecommerce' | 'content';

export interface Platform {
  id: string;
  name: string;
  color: string;
  icon: React.ReactElement;
  tag: string;
  category: PlatformCategory;
}

export const ECOMMERCE_PLATFORMS: Platform[] = [
  { id: 'taobao', name: '淘宝', color: 'bg-[#ff5000]', icon: <TaobaoIcon />, tag: 'CN', category: 'ecommerce' },
  { id: 'jd', name: '京东', color: 'bg-[#e4393c]', icon: <JDIcon />, tag: 'CN', category: 'ecommerce' },
  { id: 'shopify', name: 'Shopify', color: 'bg-[#95bf47]', icon: <ShopifyIcon />, tag: 'Global', category: 'ecommerce' },
  { id: 'pinduoduo', name: '拼多多', color: 'bg-[#e02e24]', icon: <PinduoduoIcon />, tag: 'CN', category: 'ecommerce' },
  { id: 'douyin', name: '抖音', color: 'bg-[#25f4ee]', icon: <DouyinIcon fill="#000000" />, tag: 'Short Video', category: 'content' },
  { id: 'xiaohongshu', name: '小红书', color: 'bg-[#ff2442]', icon: <XiaohongshuIcon />, tag: 'Community', category: 'content' },
  { id: 'bilibili', name: 'Bilibili', color: 'bg-[#00a1d6]', icon: <BilibiliIcon />, tag: 'ACG', category: 'content' },
];

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
