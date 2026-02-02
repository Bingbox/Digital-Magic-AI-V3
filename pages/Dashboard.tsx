
import React from 'react';
import { 
  Zap, 
  Clock, 
  BarChart3, 
  ArrowUpRight, 
  TrendingUp, 
  Sparkles,
  PlayCircle,
  FileText,
  ImageIcon,
  Plus,
  ArrowRight,
  Shirt,
  Scissors,
  Briefcase,
  Layers,
  LayoutGrid
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const StatCard = ({ title, value, change, icon, color }: any) => (
  <div className="glass-card p-6 rounded-3xl group hover:border-indigo-500/30 transition-all duration-500">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl bg-white/5 ${color} shadow-inner group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold tracking-tight">
        {change} <TrendingUp size={14} />
      </div>
    </div>
    <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.15em] mb-2">{title}</h3>
    <p className="text-4xl font-black text-white tracking-tight text-glow-sm">{value}</p>
  </div>
);

const QuickAction = ({ title, description, path, icon, color }: any) => (
  <Link to={path} className="flex flex-col gap-5 p-6 glass-card rounded-3xl hover:bg-white/5 transition-all group relative overflow-hidden min-w-[220px] lg:min-w-0 flex-shrink-0">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${color} shadow-lg group-hover:scale-105 transition-transform duration-500`}>
      {icon}
    </div>
    <div>
      <h4 className="text-[15px] font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">{description}</p>
    </div>
    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-40 translate-x-2 group-hover:translate-x-0 transition-all">
      <ArrowUpRight size={20} className="text-white" />
    </div>
  </Link>
);

const LatestFeatureCard = ({ title, desc, icon, path, tagColor }: any) => (
  <Link to={path} className="group flex items-center gap-5 p-5 glass-card rounded-2xl hover:border-indigo-500/40 transition-all h-full">
    <div className={`p-3.5 rounded-xl bg-white/5 ${tagColor} transition-transform group-hover:scale-110`}>{icon}</div>
    <div className="flex-grow">
      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 font-medium">{desc}</p>
    </div>
    <div className="hidden sm:block">
       <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">NEW</span>
    </div>
  </Link>
);

const Dashboard = () => {
  const { t } = useLanguage();
  const isEn = t('all') === 'All';

  // 14 个精选模版，用于 3x5 布局（第 15 位是“探索更多”）
  const popularTemplates = [
    { title: isEn ? 'Smart Watch V3' : '智能腕表渲染 V3', category: t('imageMagic'), tag: 'Gadget', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400' },
    { title: isEn ? 'Premium Skincare' : '高端护肤品主图', category: t('imageMagic'), tag: 'Beauty', img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=400' },
    { title: isEn ? 'Luxury Watch' : '奢华名表微距效果', category: t('imageMagic'), tag: 'Macro', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400' },
    { title: isEn ? 'Minimalist Chair' : '极简北欧家具展示', category: t('imageMagic'), tag: 'Interior', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400' },
    { title: isEn ? 'Artisan Coffee' : '精品咖啡商业棚拍', category: t('imageMagic'), tag: 'Commercial', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400' },
    { title: isEn ? 'Sport Sneaker' : '运动鞋爆炸视图', category: t('imageMagic'), tag: 'Fashion', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' },
    { title: isEn ? 'Electric Vehicle' : '智能电车动态光效', category: t('imageMagic'), tag: 'Auto', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400' },
    { title: isEn ? 'Wireless Earbuds' : '真无线耳机渲染', category: t('imageMagic'), tag: 'Audio', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400' },
    { title: isEn ? 'Organic Juice' : '有机果汁清新质感', category: t('imageMagic'), tag: 'Drink', img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400' },
    { title: isEn ? 'Modern Sofa' : '现代简约沙发场景', category: t('imageMagic'), tag: 'Furniture', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400' },
    { title: isEn ? 'Smart Home Hub' : '智能家居中控面板', category: t('imageMagic'), tag: 'Smart', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=400' },
    { title: isEn ? 'Gaming Setup' : '电竞外设全家桶', category: t('imageMagic'), tag: 'Gaming', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400' },
    { title: isEn ? 'Designer Bag' : '设计师名包质感', category: t('imageMagic'), tag: 'Luxury', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400' },
    { title: isEn ? 'Gourmet Dish' : '高端分子料理棚拍', category: t('imageMagic'), tag: 'Food', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-16">
      <section>
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-4 text-glow-sm">{t('welcome')} 👋</h1>
            <div className="flex items-center gap-3">
               <span className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/20 rounded-lg text-[11px] font-black text-indigo-400 uppercase tracking-widest">Enterprise Edition</span>
               <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[11px] opacity-80">{t('dashboardSub')}</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="h-12 px-6 glass-card rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2.5">
                <Layers size={18} /> {t('exportBatch')}
             </button>
             <button className="h-12 px-8 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                + New Creation
             </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={t('totalGenerated')} value="12.8K" change="+18%" icon={<Sparkles size={24} />} color="text-indigo-400" />
          <StatCard title={t('monthlyEnergy')} value="8.5K" change="+5%" icon={<Zap size={24} />} color="text-amber-400" />
          <StatCard title={t('avgGenTime')} value="8.2s" change="-2s" icon={<Clock size={24} />} color="text-cyan-400" />
          <StatCard title={t('storageUsed')} value="4.2GB" change="+0.8" icon={<BarChart3 size={24} />} color="text-rose-400" />
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
            <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
            {t('quickTools')}
          </h2>
          <Link to="/history" className="text-xs font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-colors">{t('browseAll')} →</Link>
        </div>
        
        {/* 将 grid 布局改为 flex + 横向溢出，在 xl 屏回归 grid */}
        <div className="flex overflow-x-auto xl:grid xl:grid-cols-6 gap-6 pb-6 xl:pb-0 hide-scrollbar no-scrollbar scroll-smooth">
          <QuickAction title={isEn ? "Main Image" : "商品主图"} description={isEn ? "Studio quality photos" : "合成商业大片"} path="/image" icon={<ImageIcon size={24} />} color="bg-gradient-to-br from-indigo-600 to-indigo-800" />
          <QuickAction title={isEn ? "HD Video" : "Veo HD 视频"} description={isEn ? "Cinema quality video" : "高清广告视频"} path="/video" icon={<PlayCircle size={24} />} color="bg-gradient-to-br from-rose-600 to-rose-800" />
          <QuickAction title={isEn ? "Copywriting" : "商业文案"} description={isEn ? "High conversion copy" : "爆款电商专家"} path="/text" icon={<FileText size={24} />} color="bg-gradient-to-br from-amber-600 to-amber-800" />
          <QuickAction title={isEn ? "Virtual Try-on" : "智能试衣"} description={isEn ? "Realistic AI fitting" : "模特智能上身"} path="/image" icon={<Shirt size={24} />} color="bg-gradient-to-br from-emerald-600 to-emerald-800" />
          <QuickAction title={isEn ? "Background" : "智能抠图"} description={isEn ? "Ultra-clean cutout" : "极致透明背景"} path="/image" icon={<Scissors size={24} />} color="bg-gradient-to-br from-cyan-600 to-cyan-800" />
          <QuickAction title={isEn ? "Branding" : "品牌全案"} description={isEn ? "Strategic content" : "全渠道视觉策略"} path="/text" icon={<Briefcase size={24} />} color="bg-gradient-to-br from-purple-600 to-purple-800" />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
           <h3 className="font-black text-white text-xl flex items-center gap-4 tracking-tight">
             <Zap size={24} className="text-amber-400 fill-amber-400" />
             {t('coreUpdates')}
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <LatestFeatureCard title="Veo 3.1 Cinema" desc={isEn ? "1080P Frame Render" : "1080P 电影级渲染"} icon={<PlayCircle size={20} />} path="/video" tagColor="text-rose-400" />
             <LatestFeatureCard title="Ultra-Texture V3" desc={isEn ? "4K Pixel Precision" : "4K 纹理极致增强"} icon={<ImageIcon size={20} />} path="/image" tagColor="text-cyan-400" />
           </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="font-black text-indigo-400 text-xl flex items-center gap-4 tracking-tight">
            <Sparkles size={24} />
            {t('advancedTips')}
          </h3>
          <div className="p-8 rounded-3xl bg-indigo-600/5 border border-indigo-500/10 flex flex-col justify-center relative overflow-hidden group">
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium relative z-10">
              {t('tipPrefix')} <span className="text-white bg-indigo-600/30 px-2 py-0.5 rounded text-[11px] font-bold tracking-wider">"ANAMORPHIC FLARE"</span> {t('tipSuffix')}
            </p>
            <Link to="/image" className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
              {t('goPractice')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
            <LayoutGrid size={24} className="text-indigo-500" />
            {t('templateLib')}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {popularTemplates.map((template, i) => (
            <div key={i} className="group flex flex-col gap-4 cursor-pointer animate-in fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden glass-card relative border border-white/5 shadow-xl shadow-indigo-500/5">
                <img src={template.img} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110" alt={template.title} />
                <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest shadow-lg">{template.category}</div>
              </div>
              <div className="px-1">
                <h4 className="text-[13px] font-bold text-white truncate tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{template.title}</h4>
                <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-widest font-black flex items-center gap-2">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                  {template.tag}
                </p>
              </div>
            </div>
          ))}
          
          <div className="group flex flex-col gap-4 cursor-pointer">
            <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 bg-white/[0.02] hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all shadow-inner group-active:scale-95 duration-500">
              <div className="w-14 h-14 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500">
                <Plus size={28} />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{t('exploreMore')}</p>
                <div className="w-8 h-0.5 bg-indigo-500/30 mx-auto mt-2 rounded-full group-hover:w-12 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
