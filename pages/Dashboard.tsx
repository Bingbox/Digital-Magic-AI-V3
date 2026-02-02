
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
  LayoutGrid,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ECOMMERCE_PLATFORMS } from '../constants';

const StatCard = ({ title, value, change, icon, color }: any) => (
  <div className="glass-card p-6 rounded-2xl group hover:border-indigo-500/30 transition-all duration-500">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-xl bg-white/5 ${color} shadow-inner group-hover:scale-110 transition-transform`}>
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
  <Link to={path} className="flex flex-col gap-5 p-6 glass-card rounded-2xl hover:bg-white/5 transition-all group relative overflow-hidden min-w-[220px] lg:min-w-0 flex-shrink-0">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${color} shadow-lg group-hover:scale-105 transition-transform duration-500`}>
      {icon}
    </div>
    <div>
      <h4 className="text-[15px] font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight uppercase">{title}</h4>
      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">{description}</p>
    </div>
    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-40 translate-x-2 group-hover:translate-x-0 transition-all">
      <ArrowUpRight size={20} className="text-white" />
    </div>
  </Link>
);

const LatestFeatureCard = ({ title, desc, icon, path, tagColor }: any) => {
  const { t } = useLanguage();
  return (
    <Link to={path} className="group flex items-center gap-5 p-5 glass-card rounded-2xl hover:border-indigo-500/40 transition-all h-full">
      <div className={`p-3.5 rounded-xl bg-white/5 ${tagColor} transition-transform group-hover:scale-110`}>{icon}</div>
      <div className="flex-grow">
        <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight uppercase">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 font-medium">{desc}</p>
      </div>
      <div className="hidden sm:block">
        <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">{t('new')}</span>
      </div>
    </Link>
  );
};

const Dashboard = () => {
  const { t, language } = useLanguage();

  const popularTemplates = [
    { title: language === 'en' ? 'Smart Watch V3' : '智能腕表渲染 V3', category: t('imageMagic'), tag: 'Gadget', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
    { title: language === 'en' ? 'Premium Skincare' : '高端护肤品主图', category: t('imageMagic'), tag: 'Beauty', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800' },
    { title: language === 'en' ? 'Luxury Watch' : '奢华名表微距效果', category: t('imageMagic'), tag: 'Macro', img: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800' },
    { title: language === 'en' ? 'Minimalist Chair' : '极简北欧家具展示', category: t('imageMagic'), tag: 'Interior', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800' },
    { title: language === 'en' ? 'Artisan Coffee' : '精品咖啡商业棚拍', category: t('imageMagic'), tag: 'Commercial', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800' },
    { title: language === 'en' ? 'Fashion Sneaker' : '潮牌运动鞋特写', category: t('imageMagic'), tag: 'Apparel', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
    { title: language === 'en' ? 'Organic Tea' : '有机茶饮自然光', category: t('imageMagic'), tag: 'Food', img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=800' },
    { title: language === 'en' ? 'Wireless Audio' : '降噪耳机旗舰渲染', category: t('imageMagic'), tag: 'Tech', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800' },
    { title: language === 'en' ? 'Designer Bag' : '手工皮具质感呈现', category: t('imageMagic'), tag: 'Luxury', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800' },
    { title: language === 'en' ? 'Modern Sofa' : '现代简约客厅预览', category: t('imageMagic'), tag: 'Home', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
    { title: language === 'en' ? 'Gourmet Burger' : '垂涎美食海报', category: t('imageMagic'), tag: 'F&B', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800' },
    { title: language === 'en' ? 'Smart Home Hub' : '全屋智能中控面板', category: t('imageMagic'), tag: 'IoT', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800' },
    { title: language === 'en' ? 'Yoga Collection' : '瑜伽装备户外拍摄', category: t('imageMagic'), tag: 'Sport', img: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&q=80&w=800' },
    { title: language === 'en' ? 'Sunglasses Art' : '时尚墨镜艺术排版', category: t('imageMagic'), tag: 'Acc', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-16">
      <section>
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-4 text-glow-sm">{t('welcome')} 👋</h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/20 rounded-lg text-[11px] font-black text-indigo-400 uppercase tracking-widest">{t('enterpriseEdition')}</span>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[11px] opacity-80">{t('dashboardSub')}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="h-12 px-6 glass-card rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2.5 active:scale-[0.98]">
              <Layers size={18} /> {t('exportBatch')}
            </button>
            <button className="h-12 px-8 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-[0.98]">
              {t('newCreation')}
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
        
        <div className="flex overflow-x-auto xl:grid xl:grid-cols-6 gap-6 pb-6 xl:pb-0 hide-scrollbar no-scrollbar scroll-smooth">
          <QuickAction title={t('mainImage')} description={t('mainImageDesc')} path="/image" icon={<ImageIcon size={24} />} color="bg-gradient-to-br from-indigo-600 to-indigo-800" />
          <QuickAction title={t('hdVideo')} description={t('hdVideoDesc')} path="/video" icon={<PlayCircle size={24} />} color="bg-gradient-to-br from-rose-600 to-rose-800" />
          <QuickAction title={t('copywriting')} description={t('copywritingDesc')} path="/text" icon={<FileText size={24} />} color="bg-gradient-to-br from-amber-600 to-amber-800" />
          <QuickAction title={t('virtualTryon')} description={t('virtualTryonDesc')} path="/image" icon={<Shirt size={24} />} color="bg-gradient-to-br from-emerald-600 to-emerald-800" />
          <QuickAction title={t('backgroundRemove')} description={t('backgroundRemoveDesc')} path="/image" icon={<Scissors size={24} />} color="bg-gradient-to-br from-cyan-600 to-cyan-800" />
          <QuickAction title={t('branding')} description={t('brandingDesc')} path="/text" icon={<Briefcase size={24} />} color="bg-gradient-to-br from-purple-600 to-purple-800" />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="font-black text-white text-xl flex items-center gap-4 tracking-tight uppercase">
            <Zap size={24} className="text-amber-400 fill-amber-400" />
            {t('coreUpdates')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LatestFeatureCard title={t('veoCinema')} desc={t('veoCinemaDesc')} icon={<PlayCircle size={20} />} path="/video" tagColor="text-rose-400" />
            <LatestFeatureCard title={t('ultraTexture')} desc={t('ultraTextureDesc')} icon={<ImageIcon size={20} />} path="/image" tagColor="text-cyan-400" />
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="font-black text-indigo-400 text-xl flex items-center gap-4 tracking-tight uppercase">
            <Sparkles size={24} />
            {t('advancedTips')}
          </h3>
          <div className="p-8 rounded-2xl bg-indigo-600/5 border border-indigo-500/10 flex flex-col justify-center relative overflow-hidden group shadow-xl">
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium relative z-10">
              {t('tipPrefix')} <span className="text-white bg-indigo-600/30 px-2 py-0.5 rounded text-[11px] font-bold tracking-wider">"ANAMORPHIC FLARE"</span> {t('tipSuffix')}
            </p>
            <Link to="/image" className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
              {t('goPractice')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 商流枢纽概览快捷入口 - 已移动到此处 */}
      <section className="space-y-8 animate-in fade-in duration-1000 delay-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <ShoppingBag size={24} className="text-emerald-400" />
            </div>
            {t('ecommerceHub')}
          </h2>
          <Link to="/commerce" className="text-xs font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-colors">{t('enterHub')} →</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ECOMMERCE_PLATFORMS.slice(0, 4).map(p => (
            <Link key={p.id} to="/commerce" className="glass-card p-6 rounded-2xl flex items-center gap-4 group hover:bg-white/5 transition-all active:scale-[0.98]">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${p.color} shadow-lg transition-transform group-hover:scale-110`}>
                {p.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight uppercase">{t(p.id as any)}</h4>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">{t('connectedStatus')}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4 uppercase">
            <LayoutGrid size={24} className="text-indigo-500" />
            {t('templateLib')}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {popularTemplates.map((template, i) => (
            <div key={i} className="group flex flex-col gap-4 cursor-pointer animate-in fade-in" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden glass-card relative border border-white/5 shadow-xl shadow-indigo-500/5 bg-slate-900">
                <img 
                  src={template.img} 
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110" 
                  alt={template.title} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800';
                  }}
                />
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
              <div className="w-14 h-14 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500 shadow-xl">
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
