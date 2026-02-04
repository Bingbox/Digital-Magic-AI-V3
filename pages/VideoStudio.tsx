
import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Sparkles, 
  Play, 
  Download, 
  Loader2,
  Clapperboard,
  Film, 
  Zap,
  CheckCircle2,
  MonitorPlay,
  ZapIcon,
  AlertCircle,
  Upload,
  X,
  RefreshCw,
  Maximize2,
  Brain,
  Plus,
  ExternalLink,
  Key,
  Info,
  ChevronRight,
  ImageIcon,
  Archive,
  Crown
} from 'lucide-react';
import { VIDEO_TOOLS, ENERGY_COSTS } from '../constants';
import { GeminiService } from '../services/gemini';
import { User, AIModel } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  user: User;
  setUser: (u: User) => void;
  onOpenAuth: () => void;
}

const VideoStudio = ({ user, setUser, onOpenAuth }: Props) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTool, setSelectedTool] = useState(VIDEO_TOOLS[0]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [visualUrl, setVisualUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [error, setError] = useState<string | null>(null);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [referenceAssets, setReferenceAssets] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // New state for Veo model selection
  const [selectedModel, setSelectedModel] = useState<AIModel>(AIModel.VEO_FAST);

  const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Veo only supports 1 image for image-to-video usually, but instructions mention referenceImages.
        // For simplicity in UI, we allow uploading but will use the first one as primary image input.
        setReferenceAssets(prev => [...prev, reader.result as string].slice(0, 3));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAsset = (index: number) => {
    setReferenceAssets(prev => prev.filter((_, i) => i !== index));
  };

  const openKeySelection = async () => {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      setError(null);
      setRateLimitError(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError(null);
    setRateLimitError(false);

    if (user.isGuest) { onOpenAuth(); return; }

    // Check API Key for Veo
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
          try {
             await (window as any).aistudio.openSelectKey();
          } catch (e) {
             setError("API Key selection is required for Veo video generation.");
             return;
          }
      }
    }

    const cost = selectedModel === AIModel.VEO_HD ? ENERGY_COSTS.VIDEO_HD : ENERGY_COSTS.VIDEO_FAST;
    if (user.magicEnergy < cost) {
      setError(`${t('insufficientMana')} ${t('expectedCost')}: ${cost}`);
      return;
    }
    
    setIsGenerating(true);
    setVisualUrl(null);
    setIsSaved(false);
    
    try {
      const options = {
        image: referenceAssets[0] || null,
        // referenceImages: referenceAssets.length > 0 ? referenceAssets : [] // Pass ref images if needed for future
      };
      
      const url = await GeminiService.generateVideo(`${selectedTool.name}: ${prompt}`, selectedModel, aspectRatio, options);
      setVisualUrl(url);
      setUser({ ...user, magicEnergy: user.magicEnergy - cost });
    } catch (err: any) {
      console.error("Video Studio Error:", err);
      const msg = err.message || JSON.stringify(err);
      if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
        setRateLimitError(true);
      } else {
        setError(msg || "Magic failed. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const manualArchive = () => {
    if (!visualUrl) return;
    GeminiService.saveToHistory({
      title: `${selectedTool.name}-${prompt.slice(0, 10)}`,
      type: 'video',
      content: visualUrl
    });
    setIsSaved(true);
  };

  const isVideo = visualUrl?.startsWith('blob:') || visualUrl?.includes('.mp4');

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 animate-in fade-in slide-in-from-right-4 duration-500 max-h-[calc(100vh-100px)] overflow-hidden">
      
      {/* 沉浸式预览灯箱 */}
      {isPreviewOpen && visualUrl && (
        <div className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-2xl flex flex-col animate-in fade-in duration-300" onClick={() => setIsPreviewOpen(false)}>
           <div className="px-6 py-4 flex items-center justify-between relative z-10 bg-black/40 border-b border-white/5">
             <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/10 rounded-lg text-white"><Sparkles size={16} /></div>
                <p className="text-xs font-black text-white uppercase tracking-widest">{t('viewWork')}</p>
             </div>
             <div className="flex items-center gap-3">
                <a href={visualUrl} download="magic_visual.mp4" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
                   <Download size={14} /> {t('saveToLocal')}
                </a>
                <button 
                  onClick={(e) => { e.stopPropagation(); manualArchive(); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${isSaved ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/10 border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-500'}`}
                >
                  {isSaved ? <CheckCircle2 size={14} /> : <Archive size={14} />}
                  {isSaved ? t('completed') : t('archive')}
                </button>
                <button className="p-2 bg-white/10 text-white/50 hover:text-white rounded-lg transition-all border border-white/10"><X size={20} /></button>
             </div>
           </div>
           <div className="flex-grow flex items-center justify-center p-6 lg:p-10 overflow-hidden" onClick={e => e.stopPropagation()}>
             {isVideo ? (
               <video src={visualUrl} controls autoPlay loop className="max-w-full max-h-full rounded-lg shadow-2xl border border-white/5" />
             ) : (
               <img src={visualUrl} className="max-w-full max-h-full rounded-lg shadow-2xl border border-white/5 object-contain" />
             )}
           </div>
        </div>
      )}

      {/* 左侧控制台 */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-full overflow-hidden">
        <div className="flex-grow bg-[#0f172a]/80 border border-slate-800 rounded-xl flex flex-col backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <header className="px-6 py-4 border-b border-slate-800 shrink-0 relative z-10 bg-slate-900/40">
            <h2 className="text-base font-black flex items-center gap-2 text-white">
              <Sparkles size={18} className="text-rose-400" />
              {t('videoStudioTitle')}
            </h2>
          </header>

          <div className="flex-grow overflow-y-auto no-scrollbar p-6 space-y-6 relative z-10 custom-scrollbar">
            
            {/* 引擎选择器 */}
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('engineSelect')}</label>
              <div className="space-y-2">
                 <button 
                  onClick={() => setSelectedModel(AIModel.VEO_FAST)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left group ${selectedModel === AIModel.VEO_FAST ? 'bg-rose-600/10 border-rose-500 shadow-lg' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                 >
                    <div className={`p-2 rounded-lg ${selectedModel === AIModel.VEO_FAST ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-600 group-hover:text-slate-400'}`}>
                       <Zap size={14} />
                    </div>
                    <div>
                      <p className={`text-[11px] font-black uppercase tracking-tight ${selectedModel === AIModel.VEO_FAST ? 'text-white' : 'text-slate-500'}`}>Veo Fast (720p)</p>
                      <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5">Rapid generation, standard quality.</p>
                    </div>
                 </button>

                 <button 
                  onClick={() => setSelectedModel(AIModel.VEO_HD)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left group ${selectedModel === AIModel.VEO_HD ? 'bg-indigo-600/10 border-indigo-500 shadow-lg' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                 >
                    <div className={`p-2 rounded-lg ${selectedModel === AIModel.VEO_HD ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-600 group-hover:text-slate-400'}`}>
                       <Crown size={14} />
                    </div>
                    <div>
                      <p className={`text-[11px] font-black uppercase tracking-tight ${selectedModel === AIModel.VEO_HD ? 'text-white' : 'text-slate-500'}`}>Veo HD (1080p)</p>
                      <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5">Cinema quality, slower generation.</p>
                    </div>
                 </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('templates')}</label>
              <div className="grid grid-cols-2 gap-2">
                {VIDEO_TOOLS.map(tool => (
                  <button 
                    key={tool.id} 
                    onClick={() => setSelectedTool(tool)} 
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[10px] font-black transition-all border ${selectedTool.id === tool.id ? 'bg-rose-600 text-white border-rose-500 shadow-md' : 'bg-slate-800/30 text-slate-400 border-slate-800/50 hover:bg-slate-800'}`}
                  >
                    <span className="text-[14px]">{tool.icon}</span>
                    <span className="truncate">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('videoAspect')}</label>
              <div className="grid grid-cols-2 gap-2">
                 {['16:9', '9:16'].map(ratio => (
                   <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`px-3 py-2 rounded-lg text-[10px] font-black border transition-all ${aspectRatio === ratio ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      {ratio}
                   </button>
                 ))}
              </div>
            </div>

            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('videoScript')}</label>
               <textarea 
                 value={prompt} 
                 onChange={(e) => setPrompt(e.target.value)} 
                 placeholder={t('videoPlaceholder')} 
                 className="w-full min-h-[100px] bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 transition-all resize-none placeholder:text-slate-700 font-medium" 
               />
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('uploadReference')}</label>
              <div className="grid grid-cols-3 gap-2">
                {referenceAssets.map((asset, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg border border-white/10 overflow-hidden bg-slate-950 group/item">
                    <img src={asset} className="w-full h-full object-cover" alt="ref" />
                    <button onClick={() => removeAsset(idx)} className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-md opacity-0 group-hover/item:opacity-100 transition-all"><X size={10} /></button>
                  </div>
                ))}
                {referenceAssets.length < 1 && (
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="aspect-square border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center hover:border-rose-500/40 hover:bg-rose-500/5 transition-all cursor-pointer group"
                  >
                    <Plus size={16} className="text-slate-700 group-hover:text-rose-400" />
                    <input type="file" ref={fileInputRef} onChange={handleAssetUpload} accept="image/*" className="hidden" />
                  </div>
                )}
              </div>
            </div>

            {/* 错误显示区域 */}
            {rateLimitError && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3 animate-in fade-in">
                 <div className="flex items-start gap-2 text-amber-500">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold leading-tight uppercase tracking-tight">{t('rateLimitError')}</p>
                 </div>
                 <p className="text-[9px] text-slate-500 leading-normal font-medium">{t('rateLimitSub')}</p>
                 <button onClick={openKeySelection} className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[9px] font-black uppercase rounded-lg border border-amber-500/30 transition-all flex items-center justify-center gap-2">
                    <Key size={12} /> 切换 API Key
                 </button>
              </div>
            )}

            {error && !rateLimitError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-3 animate-in fade-in">
                 <div className="flex items-start gap-2 text-rose-500">
                   <AlertCircle size={14} className="shrink-0 mt-0.5" />
                   <p className="text-[10px] font-bold leading-tight">{error}</p>
                 </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-800 shrink-0 relative z-10">
            <button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt} 
              className="w-full py-4 rounded-lg font-black uppercase tracking-widest flex flex-col items-center justify-center gap-0.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xl active:scale-[0.98] disabled:opacity-40 transition-all"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2 text-xs"><Loader2 className="animate-spin" size={16} /><span>Generating Video...</span></div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs"><Brain size={16} /><span>{t('startMagic')}</span></div>
                  <span className="text-[8px] opacity-60 font-bold">{selectedModel === AIModel.VEO_HD ? ENERGY_COSTS.VIDEO_HD : ENERGY_COSTS.VIDEO_FAST} {t('energy')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 右侧：预览区域 */}
      <div className="flex-grow flex flex-col bg-[#0f172a]/40 border border-white/5 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md h-full">
        <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-rose-500" />
            <h3 className="text-sm font-black tracking-tight text-white uppercase">{t('videoOutputPreview')}</h3>
            {visualUrl && <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded text-[9px] font-black text-rose-400 uppercase tracking-widest">Veo 3.1 READY</span>}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt}
              className="p-2 bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-white/10 border border-white/5 rounded-lg transition-all disabled:opacity-20" 
              title={t('startMagic')}
            >
              <RefreshCw size={18} className={isGenerating ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        <div className="flex-grow p-6 overflow-hidden flex items-center justify-center bg-slate-950/20 relative">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-6 animate-pulse text-center p-10">
                <div className="w-16 h-16 rounded-full border-4 border-rose-500/10 border-t-rose-500 animate-spin" />
                <div className="space-y-2">
                  <p className="text-sm font-black text-white uppercase tracking-widest">Generating Video Magic...</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">Powered by Veo 3.1. This may take 1-2 minutes. Please wait.</p>
                </div>
            </div>
          ) : visualUrl ? (
            <div className="w-full h-full flex flex-col items-center justify-center group relative">
               {isVideo ? (
                 <video src={visualUrl} controls className="max-w-full max-h-[90%] rounded-lg shadow-2xl border border-white/5" loop />
               ) : (
                 <img src={visualUrl} className="max-w-full max-h-[90%] rounded-lg shadow-2xl border border-white/5 object-contain" />
               )}
               
               <div className="absolute inset-x-0 bottom-10 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <button onClick={() => setIsPreviewOpen(true)} className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-white hover:text-black transition-all shadow-xl hover:scale-110"><Maximize2 size={18} /></button>
                  <a href={visualUrl} download="magic_visual.mp4" className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-white hover:text-black transition-all shadow-xl hover:scale-110"><Download size={18} /></a>
                  <button 
                    onClick={manualArchive}
                    className={`p-3 backdrop-blur-xl border transition-all shadow-xl hover:scale-110 active:scale-90 rounded-xl ${isSaved ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/10 border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-500'}`}
                    title={t('archive')}
                  >
                    {isSaved ? <CheckCircle2 size={18} /> : <Archive size={18} />}
                  </button>
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-800 py-24 space-y-6">
              <div className="w-32 h-32 rounded-2xl bg-slate-900/30 border border-white/5 flex items-center justify-center shadow-inner group transition-all duration-700 hover:scale-105">
                <Film size={64} className="opacity-5 group-hover:opacity-10 transition-all duration-700" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40">{t('waitVideo')}</p>
                <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest max-w-xs leading-relaxed">Describe your vision to see the magic happen</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;
