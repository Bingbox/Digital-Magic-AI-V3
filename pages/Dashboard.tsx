
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
  CheckCircle2,
  Eye,
  Plus,
  ArrowRight,
  Flame,
  Shirt,
  Smartphone,
  LayoutGrid,
  Scissors,
  Briefcase,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const StatCard = ({ title, value, change, icon, color }: any) => (
  <div className="glass-card p-8 rounded-[2rem] group hover:border-indigo-500/30 transition-all duration-500">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl bg-white/5 ${color} group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner`}>
        {icon}
      </div>
      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-black tracking-tighter">
        {change} <TrendingUp size={14} />
      </div>
    </div>
    <h3 className="text-slate-500 text-[11px] font-black uppercase tracking-[0.15em] mb-2">{title}</h3>
    <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
  </div>
);

const QuickAction = ({ title, description, path, icon, color }: any) => (
  <Link to={path} className="flex flex-col gap-6 p-7 glass-card rounded-[2.5rem] hover:bg-white/5 transition-all group relative overflow-hidden border border-white/5">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${color} shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
      {icon}
    </div>
    <div>
      <h4 className="font-black text-white group-hover:text-indigo-300 transition-colors text-sm uppercase tracking-tight">{title}</h4>
      <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">{description}</p>
    </div>
    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
      <ArrowUpRight size={20} className="text-white/20" />
    </div>
  </Link>
);

const LatestFeatureCard = ({ title, desc, icon, path, tagColor }: any) => (
  <Link to={path} className="group flex items-center gap-5 p-6 glass-card rounded-2xl hover:border-indigo-500/40 hover:bg-white/5 transition-all relative overflow-hidden h-full">
    <div className={`p-4 rounded-xl bg-white/5 ${tagColor} shadow-inner`}>{icon}</div>
    <div className="flex-grow">
      <h4 className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{title}</h4>
      <p className="text-[11px] text-slate-500 mt-1 font-bold">{desc}</p>
    </div>
    <div className="text-right hidden sm:block">
       <span className="text-[9px] font-black bg-indigo-600 text-white px-2.5 py-1 rounded-full shadow-lg shadow-indigo-600/20">NEW</span>
    </div>
  </Link>
);

const Dashboard = () => {
  const { t } = useLanguage();
  const isEn = t('all') === 'All';

  const popularTemplates = [
    { title: isEn ? 'Smart Watch V3' : '智能腕表渲染 V3', category: t('imageMagic'), tag: 'Gadget', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600' },
    { title: isEn ? 'Premium Skincare' : '高端护肤品主图', category: t('imageMagic'), tag: 'Beauty', img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=600' },
    { title: isEn ? 'Luxury Watch' : '奢华名表微距效果', category: t('imageMagic'), tag: 'Macro', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600' },
    { title: isEn ? 'Minimalist Chair' : '极简北欧家具展示', category: t('imageMagic'), tag: 'Interior', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600' },
    { title: isEn ? 'Artisan Coffee' : '精品咖啡商业棚拍', category: t('imageMagic'), tag: 'Commercial', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600' },
    { title: isEn ? 'Tech Drone' : '科技无人机动势', category: t('imageMagic'), tag: 'Future', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=600' },
    { title: isEn ? 'Modern Sneaker' : '潮牌运动鞋特写', category: t('imageMagic'), tag: 'Fashion', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600' },
    { title: isEn ? 'Organic Juice' : '有机果汁清新风格', category: t('imageMagic'), tag: 'Food', img: 'https://images.unsplash.com/photo-1622597467827-439935b164ee?auto=format&fit=crop&q=80&w=600' },
    { title: isEn ? 'Smart Home Hub' : '智能家居中枢场景', category: t('imageMagic'), tag: 'IoT', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600' },
    { title: isEn ? 'Designer Lamp' : '设计师台灯光影', category: t('imageMagic'), tag: 'Lighting', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600' },
    { title: isEn ? 'High-end Audio' : '高端音响细腻纹理', category: t('imageMagic'), tag: 'Audio', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600' },
    { title: isEn ? 'Organic Skin' : '天然植萃护肤', category: t('imageMagic'), tag: 'Nature', img: 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?auto=format&fit=crop&q=80&w=600' },
    { title: isEn ? 'Luxury Perfume' : '奢华香水流光', category: t('imageMagic'), tag: 'Vibe', img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600' },
    { title: isEn ? 'E-sports Mouse' : '电竞外设硬核光效', category: t('imageMagic'), tag: 'Gaming', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* 欢迎区域 */}
      <section>
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-4">{t('welcome')} 👋</h1>
            <div className="flex items-center gap-3">
               <span className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">Enterprise Edition</span>
               <p className="text-slate-500 font-bold italic uppercase tracking-[0.2em] text-[10px]">{t('dashboardSub')}</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="h-12 px-6 glass-card rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2">
                <Layers size={16} /> {t('exportBatch')}
             </button>
             <button className="h-12 px-6 bg-white text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-white/10">
                + Create New Task
             </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={t('totalGenerated')} value="12.8K" change="+18.4%" icon={<Sparkles size={24} />} color="text-indigo-400" />
          <StatCard title={t('monthlyEnergy')} value="8.5K" change="+5.2%" icon={<Zap size={24} />} color="text-amber-400" />
          <StatCard title={t('avgGenTime')} value="8.2s" change="-2.4s" icon={<Clock size={24} />} color="text-cyan-400" />
          <StatCard title={t('storageUsed')} value="4.2GB" change="+0.8" icon={<BarChart3 size={24} />} color="text-rose-400" />
        </div>
      </section>

      {/* 快速工具区域 */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-4">
            <div className="w-2 h-8 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.8)]"></div>
            {t('quickTools')}
          </h2>
          <Link to="/history" className="text-[11px] font-black text-indigo-400 hover:text-white uppercase tracking-[0.25em] transition-colors">{t('browseAll')} →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          <QuickAction title={isEn ? "Main Image" : "商品主图"} description={isEn ? "Studio quality product photography" : "自动合成商业级棚拍大片"} path="/image" icon={<ImageIcon size={24} />} color="bg-gradient-to-br from-indigo-600 to-indigo-800" />
          <QuickAction title={isEn ? "HD Video" : "Veo HD 视频"} description={isEn ? "Cinematic video generation" : "1080P 高清商业广告视频"} path="/video" icon={<PlayCircle size={24} />} color="bg-gradient-to-br from-rose-600 to-rose-800" />
          <QuickAction title={isEn ? "Copywriting" : "商业文案"} description={isEn ? "Conversion-focused copywriting" : "高转化率爆款电商文案专家"} path="/text" icon={<FileText size={24} />} color="bg-gradient-to-br from-amber-600 to-amber-800" />
          <QuickAction title={isEn ? "Try-on" : "智能试衣"} description={isEn ? "Virtual fashion fitting" : "多风格模特智能上身预览"} path="/image" icon={<Shirt size={24} />} color="bg-gradient-to-br from-emerald-600 to-emerald-800" />
          <QuickAction title={isEn ? "BG Removal" : "智能抠图"} description={isEn ? "Precise transparent backgrounds" : "极致细节边缘智能透明背景"} path="/image" icon={<Scissors size={24} />} color="bg-gradient-to-br from-cyan-600 to-cyan-800" />
          <QuickAction title={isEn ? "Branding" : "品牌全案"} description={isEn ? "Full channel content strategy" : "全渠道品牌视觉与文案策略"} path="/text" icon={<Briefcase size={24} />} color="bg-gradient-to-br from-purple-600 to-purple-800" />
        </div>
      </section>

      {/* 模型更新与施法技巧（已优化对齐与字号） */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 左侧：核心模型更新 */}
        <div className="flex flex-col gap-6">
           <h3 className="font-black text-white text-2xl flex items-center gap-4 tracking-tighter">
             <Zap size={24} className="text-amber-400 fill-amber-400" />
             {t('coreUpdates')}
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
             <LatestFeatureCard title="Veo 3.1 Pro Engine" desc={isEn ? "Native 1080P Cinema" : "原生 1080P 电影级渲染"} icon={<PlayCircle size={20} />} path="/video" tagColor="text-rose-400" />
             <LatestFeatureCard title="Ultra-Res V3" desc={isEn ? "4K Texture Upscaling" : "4K 商业纹理极致增强"} icon={<ImageIcon size={20} />} path="/image" tagColor="text-cyan-400" />
           </div>
        </div>
        
        {/* 右侧：施法技巧 */}
        <div className="flex flex-col gap-6">
          <h3 className="font-black text-indigo-400 text-2xl flex items-center gap-4 tracking-tighter">
            <Sparkles size={24} />
            {t('advancedTips')}
          </h3>
          <div className="flex-grow p-10 rounded-[2.5rem] bg-indigo-600/10 border border-indigo-500/20 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 blur-[100px] group-hover:bg-indigo-500/40 transition-all"></div>
            <p className="text-base text-slate-300 leading-relaxed mb-8 font-bold relative z-10">
              {t('tipPrefix')} <span className="text-white px-2 py-0.5 bg-indigo-600 rounded text-xs font-mono">"Anamorphic Flare"</span> {t('tipSuffix')}
            </p>
            <Link to="/image" className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3 hover:gap-5 transition-all relative z-10">
              {t('goPractice')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 模版库区域 */}
      <section className="pt-10">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-4">
              <LayoutGrid size={24} className="text-indigo-500" />
              {t('templateLib')}
            </h2>
            <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.3em]">{t('selectRecipe')}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {popularTemplates.map((template, i) => (
            <div key={i} className="group flex flex-col gap-4 cursor-pointer animate-in fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="aspect-[3/4] rounded-xl overflow-hidden glass-card relative shadow-2xl border border-white/5">
                <img src={template.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={template.title} />
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-xl rounded-full text-[9px] font-black text-white border border-white/10 uppercase tracking-widest">{template.category}</div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                   <button className="px-8 py-3 bg-white text-black text-[11px] font-black uppercase rounded-2xl shadow-2xl tracking-[0.2em] active:scale-95 transition-all">{t('useThis')}</button>
                </div>
              </div>
              <div className="px-2">
                <h4 className="text-[13px] font-black text-white group-hover:text-indigo-400 transition-colors truncate uppercase tracking-tight">{template.title}</h4>
                <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-widest flex items-center gap-2 font-black"><Flame size={12} className="text-rose-500" />{template.tag}</p>
              </div>
            </div>
          ))}
          <div className="group flex flex-col gap-4 cursor-pointer">
            <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 bg-white/2 hover:border-indigo-500/40 hover:bg-white/5 transition-all min-h-[200px] shadow-inner">
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all">
                 <Plus size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{t('exploreMore')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
