
import React from 'react';
import { 
  ShoppingBag, 
  Video, 
  ImageIcon,
  FileText
} from 'lucide-react';

const BrandIcon = ({ size = 20, d, viewBox = "0 0 1024 1024", fill = "currentColor" }: { size?: number, d: string | string[], viewBox?: string, fill?: string }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);
const TaobaoIcon = (props: any) => <BrandIcon {...props} d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z" />;
const JDIcon = (props: any) => <BrandIcon {...props} d="M848.3 145.4C765.7 75.3 644.2 32 512 32 379.8 32 258.3 75.3 175.7 145.4c-85 72-143.7 172.9-143.7 286.6 0 113.7 58.7 214.6 143.7 286.6l3.5 2.9V880h100V700z" />;
const DouyinIcon = (props: any) => <BrandIcon {...props} d="M783.5 352.3c-64 0-120.7-32.3-154.5-81.5v394.3c0 142.3-115.3 257.6-257.6 257.6S113.8 807.4 113.8 665.1z" />;
const XiaohongshuIcon = (props: any) => <BrandIcon {...props} d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z" />;
const BilibiliIcon = (props: any) => <BrandIcon {...props} d="M790.2 165.4l58.1-61.9c13.7-14.6 12.8-37.4-2.1-51-14.8-13.6-37.5-12.7-51.2 1.9l-72.2 76.9c-64.8-21.6-135-33.6-210.8-33.6z" />;
const ShopifyIcon = (props: any) => <BrandIcon {...props} d="M784.8 316.4l-42.3-242.4C738.7 41.7 710.1 16 677.4 16h-330.8c-32.7 0-61.3 25.7-65.1 58l-42.3 242.4" />;

export const ENERGY_COSTS = {
  TEXT_PRO: 1,
  TEXT_FLASH: 1,
  IMAGE_PRO: 2,
  IMAGE_FLASH: 2,
  VIDEO_HD: 50,
  VIDEO_FAST: 50,
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
  { id: 'douyin', name: '抖音', color: 'bg-[#25f4ee]', icon: <DouyinIcon fill="#000000" />, tag: 'Short Video', category: 'content' },
  { id: 'xiaohongshu', name: '小红书', color: 'bg-[#ff2442]', icon: <XiaohongshuIcon />, tag: 'Community', category: 'content' },
];

export const IMAGE_TOOLS = [
  { id: 'scene', name: '场景生成' },
  { id: 'white_bg', name: '白底/透明' },
  { id: 'main_img', name: '商品主图' },
  { id: 'poster', name: '营销海报' },
  { id: 'try_on', name: '智能试衣' },
  { id: 'home', name: '家庭场景' },
];

export const TEXT_TOOLS = [
  { id: 'video_script', name: '视频脚本', icon: '🎬' },
  { id: 'live_script', name: '直播脚本', icon: '🎙️' },
  { id: 'social_copy', name: '种草文案', icon: '📸' },
  { id: 'product_detail', name: '商品详情', icon: '📜' },
  { id: 'trending_copy', name: '热点文案', icon: '🔥' },
];

export const VIDEO_TOOLS = [
  { id: 'product_ad', name: '产品广告', icon: '🎁' },
  { id: 'lifestyle', name: '生活方式', icon: '🏔️' },
  { id: 'cinematic', name: '电影质感', icon: '🎥' },
  { id: 'short_video', name: '短视频流', icon: '📱' },
  { id: 'brand_story', name: '品牌故事', icon: '📖' },
  { id: 'dynamic_poster', name: '动态海报', icon: '✨' },
];

export const PRICING_PLANS = [
  {
    id: 'free',
    name: '免费版',
    price: '0',
    features: ['Flash 模型无限访问', '基础图像生成', '每日 50 次额度'],
    buttonText: '当前方案',
    highlight: false,
  },
  {
    id: 'pro',
    name: '专业版',
    price: '99',
    features: ['Pro 模型优先访问', '4K 图像生成', '无限施法能量'],
    buttonText: '立即升级',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: 'Custom',
    features: ['自定义 API 集成', '私有云部署', '24/7 专属支持'],
    buttonText: '联系我们',
    highlight: false,
  }
];
