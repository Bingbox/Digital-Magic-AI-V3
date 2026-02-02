
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, 
  Settings2, 
  Zap, 
  Activity, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle, 
  Search,
  Plus,
  RefreshCw,
  Clock,
  ExternalLink,
  Globe,
  X,
  Link as LinkIcon,
  AlertCircle,
  Database,
  Store,
  Eye,
  ShieldCheck,
  Cpu,
  Unplug,
  MoreVertical,
  Download,
  Share2,
  Wand2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ECOMMERCE_PLATFORMS, Platform, PlatformCategory } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { GeminiService } from '../services/gemini';

interface DistributionTask {
  id: string;
  workTitles: string[];
  platforms: string[];
  status: 'handshaking' | 'verifying' | 'syncing' | 'optimizing' | 'completed' | 'failed';
  progress: number;
  timestamp: string;
  liveLink?: string;
}

const CommerceHub = () => {
  const { t, language } = useLanguage();
  
  const [materials, setMaterials] = useState<any[]>([]);
  const [activeMatrix, setActiveMatrix] = useState<PlatformCategory>('ecommerce');
  const [connectedIds, setConnectedIds] = useState<string[]>(['taobao', 'douyin', 'shopify', 'xiaohongshu']); 
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([]);
  const [selectedWorkIds, setSelectedWorkIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'text' | 'video'>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<any>(null);
  const [tasks, setTasks] = useState<DistributionTask[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadMaterials = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const data = GeminiService.getHistory(language);
      setMaterials(data);
      setIsSyncing(false);
    }, 600);
  };

  useEffect(() => { loadMaterials(); }, [language]);

  const activePlatforms = useMemo(() => ECOMMERCE_PLATFORMS.filter(p => p.category === activeMatrix && connectedIds.includes(p.id)), [activeMatrix, connectedIds]);
  const filteredMaterials = useMemo(() => materials.filter(w => filterType === 'all' || w.type === filterType), [filterType, materials]);

  const togglePlatform = (id: string) => setSelectedPlatformIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const toggleWork = (id: string) => setSelectedWorkIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const handleConnect = (id: string) => setConnectedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const handlePublish = () => {
    if (selectedPlatformIds.length === 0 || selectedWorkIds.length === 0) return;
    setIsPublishing(true);
    const taskId = `X-${Date.now().toString(36).toUpperCase()}`;
    const targetNames = ECOMMERCE_PLATFORMS.filter(p => selectedPlatformIds.includes(p.id)).map(p => t(p.id as any));
    const workTitles = materials.filter(w => selectedWorkIds.includes(w.id)).map(w => w.title);

    const newTask: DistributionTask = {
      id: taskId,
      workTitles,
      platforms: targetNames,
      status: 'handshaking',
      progress: 0,
      timestamp: new Date().toLocaleTimeString()
    };
    setTasks(p => [newTask, ...p]);

    let prog = 0;
    const itv = setInterval(() => {
      prog += 5;
      setTasks(p => p.map(t => {
        if (t.id === taskId) {
          let s = t.status;
          if (prog < 20) s = 'handshaking';
          else if (prog < 45) s = 'verifying';
          else if (prog < 75) s = 'syncing';
          else if (prog < 95) s = 'optimizing';
          else { s = 'completed'; t.liveLink = 'https://magic.store/item/preview'; }
          return { ...t, progress: Math.min(prog, 100), status: s as any };
        }
        return t;
      }));
      if (prog >= 100) { clearInterval(itv); setIsPublishing(false); setSelectedWorkIds([]); setSelectedPlatformIds([]); }
    }, 120);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-16">
      
      {/* 侧边配置实验室 */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsSettingsOpen(false)}>
          <div className="w-full max-w-sm h-full bg-[#020617] border-l border-white/10 shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-400" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight"><Cpu size={20} className="text-indigo-400" /> {t('shopSettings')}</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"><X size={20} /></button>
            </div>
            
            <div className="space-y-6">
              {(['ecommerce', 'content'] as const).map(cat => (
                <div key={cat} className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{t(cat)}</h3>
                  <div className="space-y-2">
                    {ECOMMERCE_PLATFORMS.filter(p => p.category === cat).map(platform => (
                      <div key={platform.id} className="p-4 bg-slate-900/40 border border-white/5 rounded-xl flex items-center justify-between group hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${platform.color} shadow-lg shadow-black/20 transition-transform group-hover:scale-105`}>{platform.icon}</div>
                          <div>
                            <p className="text-xs font-bold text-white leading-none mb-1">{t(platform.id as any)}</p>
                            <span className={`text-[8px] font-black tracking-widest ${connectedIds.includes(platform.id) ? 'text-emerald-500' : 'text-slate-600'}`}>{connectedIds.includes(platform.id) ? t('active') : t('offline')}</span>
                          </div>
                        </div>
                        <button onClick={() => handleConnect(platform.id)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${connectedIds.includes(platform.id) ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'}`}>
                          {connectedIds.includes(platform.id) ? t('unlink') : t('link')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 枢纽控制面板 */}
      <section className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-4 shrink-0 md:border-r md:border-white/5 md:pr-6">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/10"><ShoppingBag size={24} /></div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-tight mb-1">{t('ecommerceHub')}</h1>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /><span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{activePlatforms.length} {t('readyToShip')}</span></div>
          </div>
        </div>

        <div className="flex-grow flex items-center gap-3 overflow-x-auto no-scrollbar w-full py-1">
          {activePlatforms.length > 0 ? activePlatforms.map(p => (
            <button key={p.id} onClick={() => togglePlatform(p.id)} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all shrink-0 group ${selectedPlatformIds.includes(p.id) ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${selectedPlatformIds.includes(p.id) ? 'bg-white/20' : p.color} shadow-sm overflow-hidden transition-transform group-hover:scale-110`}>{React.cloneElement(p.icon as any, { size: 14 })}</div>
              <span className="text-[11px] font-black uppercase tracking-wider">{t(p.id as any)}</span>
            </button>
          )) : (
            <div className="flex items-center gap-2 text-slate-700 px-4"><Unplug size={16} /><span className="text-[10px] font-black uppercase tracking-widest italic">{t('activateChannels')}</span></div>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-4 md:pl-6 md:border-l md:border-white/5">
          <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 shadow-inner">
            <button onClick={() => setActiveMatrix('ecommerce')} className={`p-2.5 rounded-lg transition-all ${activeMatrix === 'ecommerce' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}><Store size={18} /></button>
            <button onClick={() => setActiveMatrix('content')} className={`p-2.5 rounded-lg transition-all ${activeMatrix === 'content' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}><Video size={18} /></button>
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5 group" title={t('config')}><Settings2 size={20} className="group-hover:rotate-45 transition-transform" /></button>
        </div>
      </section>

      {/* 主体内容矩阵 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-1">
            <div className="flex items-center gap-5">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3"><Database size={16} className="text-indigo-400" />{t('materials')}</h3>
              <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 shadow-inner">
                {['all', 'image', 'text', 'video'].map(type => (
                  <button key={type} onClick={() => setFilterType(type as any)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${filterType === type ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>{t(type as any)}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="relative group flex-grow sm:flex-grow-0">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input type="text" placeholder={t('searchPlaceholder')} className="bg-slate-900/40 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-[11px] font-bold text-slate-300 focus:outline-none focus:border-indigo-500 transition-all w-full sm:w-48 shadow-inner" />
               </div>
               <button onClick={loadMaterials} className={`p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-indigo-400 transition-all ${isSyncing ? 'animate-spin text-indigo-400' : ''}`}><RefreshCw size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMaterials.length > 0 ? filteredMaterials.map(work => (
              <div key={work.id} onClick={() => toggleWork(work.id)} className={`group relative bg-slate-900/20 p-3 rounded-2xl border transition-all cursor-pointer ${selectedWorkIds.includes(work.id) ? 'border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-600/5' : 'border-white/5 hover:border-white/10 hover:-translate-y-1'}`}>
                <div className="aspect-square rounded-xl overflow-hidden bg-black mb-3 border border-white/5 relative">
                  <img src={work.preview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={work.title} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={(e) => { e.stopPropagation(); setPreviewMaterial(work); }} className="p-3 bg-white text-black rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-xl scale-90 group-hover:scale-100 duration-300"><Eye size={16} /></button>
                  </div>
                  <div className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/5 shadow-lg">
                    {work.type === 'image' && <ImageIcon size={12} className="text-indigo-400" />}
                    {work.type === 'text' && <FileText size={12} className="text-amber-400" />}
                    {work.type === 'video' && <Video size={12} className="text-rose-400" />}
                  </div>
                  {selectedWorkIds.includes(work.id) && <div className="absolute top-2 right-2 w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white animate-in zoom-in-50 shadow-xl border border-white/10"><CheckCircle size={14} /></div>}
                </div>
                <h4 className="text-[12px] font-black text-white tracking-tight truncate px-1 uppercase leading-none mb-2">{work.title}</h4>
                <div className="flex items-center justify-between px-1">
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{t(work.type as any)}</span>
                   <span className="text-[8px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded tracking-tighter uppercase">{t('ready')}</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-800 bg-slate-900/10 rounded-2xl border border-dashed border-white/5">
                <Wand2 size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-black uppercase tracking-widest mb-4 opacity-40">{t('noTask')}</p>
                <div className="flex gap-4">
                   <Link to="/image" className="px-6 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 text-[10px] font-black uppercase rounded-lg transition-all border border-indigo-500/20">{t('imageMagic')}</Link>
                   <Link to="/video" className="px-6 py-2 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 text-[10px] font-black uppercase rounded-lg transition-all border border-rose-500/20">{t('videoMagic')}</Link>
                </div>
              </div>
            )}
            <div onClick={loadMaterials} className="aspect-square border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-indigo-500/5 hover:border-indigo-500/10 transition-all group bg-black/10">
               <div className={`p-4 rounded-xl bg-slate-900 border border-white/5 text-slate-600 group-hover:text-indigo-400 transition-all duration-700 ${isSyncing ? 'animate-spin' : ''}`}><RefreshCw size={24} /></div>
               <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-400">{t('restock')}</span>
            </div>
          </div>
        </div>

        {/* 枢纽任务分发栏 */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3"><Globe size={16} className="text-indigo-400" />{t('omniChannel')}</h3>
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/10 rounded-lg text-indigo-400 text-[10px] font-black">{selectedWorkIds.length}</span>
              </div>
              <div className="space-y-4">
                 <div className="p-4 bg-black/30 rounded-xl border border-white/5 min-h-[100px] flex flex-wrap gap-2 shadow-inner custom-scrollbar overflow-y-auto max-h-[180px]">
                   {selectedPlatformIds.length > 0 ? selectedPlatformIds.map(id => {
                     const p = ECOMMERCE_PLATFORMS.find(item => item.id === id);
                     return p && (
                       <div key={id} className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 border border-white/5 rounded-lg text-[10px] font-black text-white shadow-md animate-in zoom-in-95 group">
                         <div className={`w-5 h-5 rounded flex items-center justify-center text-white ${p.color} shadow-sm transition-transform group-hover:scale-110`}>{React.cloneElement(p.icon as any, { size: 10 })}</div>
                         {t(p.id as any)}
                         <button onClick={(e) => { e.stopPropagation(); togglePlatform(id); }} className="p-0.5 hover:bg-white/10 rounded-full transition-colors"><X size={10} className="text-slate-600 group-hover:text-rose-400" /></button>
                       </div>
                     );
                   }) : (
                      <div className="w-full flex flex-col items-center justify-center py-4 text-slate-700 opacity-40 italic">
                         <Unplug size={24} className="mb-2 transition-transform hover:scale-110" />
                         <p className="text-[9px] font-black uppercase tracking-widest">{t('waitingSelection')}</p>
                      </div>
                   )}
                 </div>
                 <button 
                  onClick={handlePublish} 
                  disabled={isPublishing || selectedWorkIds.length === 0 || selectedPlatformIds.length === 0} 
                  className={`w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.98] ${isPublishing || selectedWorkIds.length === 0 || selectedPlatformIds.length === 0 ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'}`}
                 >
                   {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={16} />}
                   {t('smartPublish')}
                 </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2"><Activity size={14} className="text-amber-500" />{t('publishingTasks')}</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar pb-8">
              {tasks.length > 0 ? tasks.map(task => (
                <div key={task.id} className="bg-slate-900/40 border border-white/5 rounded-xl p-4 shadow-sm group hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center ${task.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {task.status === 'completed' ? <CheckCircle size={20} /> : <Loader2 size={20} className="animate-spin" />}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-white uppercase tracking-tight truncate max-w-[120px] leading-tight mb-1">{task.workTitles[0]}</h4>
                        <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                           <Clock size={10} /> {task.timestamp}
                           <span className="text-indigo-400 font-black">@{task.platforms[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                        <span className={task.status === 'completed' ? 'text-emerald-500' : 'text-amber-400'}>{t(task.status as any)}</span>
                        <span className="text-slate-600">{task.progress}%</span>
                     </div>
                     <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-700 bg-indigo-500`} style={{ width: `${task.progress}%` }} />
                     </div>
                     {task.status === 'completed' && task.liveLink && (
                        <div className="pt-2">
                           <a href={task.liveLink} target="_blank" rel="noreferrer" className="w-full flex items-center justify-between px-3 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:bg-emerald-500/10 transition-all">
                              <div className="flex items-center gap-2"><LinkIcon size={12} />{t('liveLink')}</div>
                              <ExternalLink size={10} />
                           </a>
                        </div>
                     )}
                  </div>
                </div>
              )) : (
                <div className="rounded-xl py-16 text-center border border-dashed border-white/5 bg-black/10">
                   <Database size={28} className="mx-auto mb-4 text-slate-800" />
                   <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{t('noTask')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 预览侧面板 */}
      {previewMaterial && (
        <div className="fixed inset-0 z-[200] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setPreviewMaterial(null)}>
          <div className="w-full md:w-[480px] h-full bg-[#020617] border-l border-white/10 shadow-3xl animate-in slide-in-from-right duration-400 relative flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400"><Eye size={20} /></div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight leading-none mb-1">{previewMaterial.title}</h2>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t(previewMaterial.type as any)} {t('archive')}</p>
                  </div>
               </div>
               <button onClick={() => setPreviewMaterial(null)} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"><X size={24} /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
              <div className="w-full h-auto bg-black/40 rounded-2xl overflow-hidden border border-white/5 p-4 shadow-inner mb-8 flex items-center justify-center min-h-[320px]">
                {previewMaterial.type === 'text' ? (
                   <div className="w-full bg-slate-900/40 p-8 rounded-xl border border-white/5 prose prose-invert prose-sm max-w-none">
                      <div className="text-slate-300 whitespace-pre-wrap leading-relaxed italic">{previewMaterial.content || 'Content detail loading...'}</div>
                   </div>
                ) : (
                   <img src={previewMaterial.preview} className="max-w-full max-h-[480px] object-contain rounded-lg shadow-2xl" alt="preview" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 bg-white/[0.02] rounded-xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1"><Database size={12} /> {t('metadata')}</div>
                    <div className="space-y-2.5">
                       <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 font-bold uppercase">{t('date')}</span><span className="text-[10px] text-white font-black">2025-05-24</span></div>
                       <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 font-bold uppercase">{t('quality')}</span><span className="text-[10px] text-emerald-400 font-black">4K HDR</span></div>
                    </div>
                 </div>
                 <div className="p-5 bg-white/[0.02] rounded-xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1"><ShieldCheck size={12} /> {t('license')}</div>
                    <div className="space-y-2">
                       <div className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase rounded-md inline-block">{t('standardLicense')}</div>
                       <p className="text-[8px] text-slate-600 font-medium leading-tight">Verified for multi-platform commercial distribution.</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-slate-950/50 flex gap-4 shrink-0">
               <button className="flex-grow py-4 bg-white hover:bg-slate-100 text-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                  <Download size={18} /> {t('downloadAsset')}
               </button>
               <button 
                  onClick={() => { toggleWork(previewMaterial.id); setPreviewMaterial(null); }} 
                  className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-[0.98] ${selectedWorkIds.includes(previewMaterial.id) ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/20' : 'bg-indigo-600 text-white hover:brightness-110 shadow-xl shadow-indigo-600/20'}`}
               >
                  {selectedWorkIds.includes(previewMaterial.id) ? t('remove') : t('select')}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommerceHub;
