
import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  Loader2, 
  Image as ImageIcon,
  Brain,
  Download,
  Archive,
  CheckCircle2,
  X,
  RefreshCw,
  Eye,
  AlertCircle,
  Key
} from 'lucide-react';
import { IMAGE_TOOLS, ENERGY_COSTS } from '../constants';
import { GeminiService } from '../services/gemini';
import { AIModel, User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  user: User;
  setUser: (u: User) => void;
  onOpenAuth: () => void;
}

const ImageStudio = ({ user, setUser, onOpenAuth }: Props) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTool, setSelectedTool] = useState(IMAGE_TOOLS[0]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [previewImage, setPreviewImage] = useState<{url: string, index: number} | null>(null);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const options = {
    aspectRatio: '1:1',
    model: AIModel.IMAGE_FLASH
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
    if (user.isGuest) { onOpenAuth(); return; }

    const cost = ENERGY_COSTS.IMAGE_FLASH * 4;
    if (user.magicEnergy < cost) {
      alert(`${t('insufficientMana')}`);
      return;
    }

    setIsGenerating(true);
    setResults([]); 
    setSavedIds(new Set());
    setRateLimitError(false);
    setError(null);
    
    try {
      const generateTasks = Array(4).fill(null).map(() => 
        GeminiService.generateImage(`${selectedTool.name}: ${prompt}`, options, referenceImage || undefined)
      );
      
      const imageUrls = await Promise.all(generateTasks);
      setResults(imageUrls);
      
      setUser({ ...user, magicEnergy: user.magicEnergy - cost });
    } catch (err: any) {
      console.error("Image Studio Error:", err);
      const msg = err.message || JSON.stringify(err);
      if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
        setRateLimitError(true);
      } else if (err.message === "API_PERMISSION_ERROR") {
        setError("API 权限错误，请检查您的 Key 是否有效。");
      } else {
        setError(msg || "生成失败");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (base64: string, index: number) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = `magic-commerce-${Date.now()}-${index}.png`;
    link.click();
  };

  const manualArchive = (url: string, index: number) => {
    GeminiService.saveToHistory({ 
      title: `${selectedTool.name}-${prompt.slice(0, 10)}`, 
      type: 'image', 
      content: url 
    });
    setSavedIds(prev => new Set(prev).add(index));
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 animate-in fade-in slide-in-from-right-4 duration-500 max-h-[calc(100vh-100px)] overflow-hidden">
      
      {/* 沉浸式灯箱预览 */}
      {previewImage && (
        <div className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-2xl flex flex-col animate-in fade-in duration-300" onClick={() => setPreviewImage(null)}>
           <div className="px-6 py-4 flex items-center justify-between relative z-10 bg-black/40 border-b border-white/5">
             <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/10 rounded-lg text-white"><ImageIcon size={16} /></div>
                <p className="text-xs font-black text-white uppercase tracking-widest">{t('viewWork')}</p>
             </div>
             <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); downloadImage(previewImage.url, previewImage.index); }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
                >
                  <Download size={14} /> {t('downloadAsset')}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); manualArchive(previewImage.url, previewImage.index); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${savedIds.has(previewImage.index) ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/10 border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-500'}`}
                >
                  {savedIds.has(previewImage.index) ? <CheckCircle2 size={14} /> : <Archive size={14} />}
                  {savedIds.has(previewImage.index) ? t('completed') : t('archive')}
                </button>
                <button className="p-2 bg-white/10 text-white/50 hover:text-white rounded-lg transition-all border border-white/10"><X size={20} /></button>
             </div>
           </div>

           <div className="flex-grow flex items-center justify-center p-6 lg:p-10 overflow-hidden">
             <img src={previewImage.url} className="max-w-full max-h-full rounded-lg shadow-2xl border border-white/5 object-contain animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()} alt="preview" />
           </div>
        </div>
      )}

      {/* 左侧：专业级控制台 */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-full overflow-hidden">
        <div className="flex-grow bg-[#0f172a]/80 border border-slate-800 rounded-xl flex flex-col backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <header className="px-6 py-4 border-b border-slate-800 shrink-0 relative z-10 bg-slate-900/40">
            <h2 className="text-base font-black flex items-center gap-2 text-white">
              <ImageIcon size={18} className="text-cyan-400" />
              {t('imgStudioTitle')}
            </h2>
          </header>

          <div className="flex-grow overflow-y-auto no-scrollbar p-6 space-y-6 relative z-10 custom-scrollbar">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('templates')}</label>
              <div className="grid grid-cols-2 gap-2">
                {IMAGE_TOOLS.map(tool => (
                  <button 
                    key={tool.id} 
                    onClick={() => setSelectedTool(tool)} 
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[10px] font-black transition-all border ${selectedTool.id === tool.id ? 'bg-cyan-600 text-white border-cyan-500 shadow-md' : 'bg-slate-800/30 text-slate-400 border-slate-800/50 hover:bg-slate-800'}`}
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('promptLabel')}</label>
               <textarea 
                 value={prompt} 
                 onChange={(e) => setPrompt(e.target.value)} 
                 placeholder={t('promptPlaceholder')} 
                 className="w-full min-h-[120px] bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all resize-none placeholder:text-slate-700 font-medium" 
               />
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('uploadReference')}</label>
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className={`w-full h-32 bg-slate-950/40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group relative overflow-hidden ${referenceImage ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-800 hover:border-cyan-500/30'}`}
              >
                <input type="file" ref={fileInputRef} onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setReferenceImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} accept="image/*" className="hidden" />
                
                {referenceImage ? (
                  <>
                    <img src={referenceImage} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[1px]" alt="ref" />
                    <div className="relative z-10 w-20 h-20 rounded-lg border border-white/20 overflow-hidden shadow-xl">
                      <img src={referenceImage} className="w-full h-full object-cover" alt="ref-mini" />
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setReferenceImage(null); }} className="absolute top-2 right-2 z-20 p-1 bg-rose-500/80 text-white rounded-md hover:bg-rose-500 shadow-lg"><X size={12} /></button>
                  </>
                ) : (
                  <>
                    <Upload size={20} className="text-slate-700 group-hover:text-cyan-400" />
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{t('uploadNotice')}</p>
                  </>
                )}
              </div>
            </div>

            {/* 配额错误提示 */}
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
              className="w-full py-4 rounded-lg font-black uppercase tracking-widest flex flex-col items-center justify-center gap-0.5 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-xl active:scale-[0.98] disabled:opacity-40 transition-all"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2 text-xs"><Loader2 className="animate-spin" size={16} /><span>{t('pixelReconstruct')}</span></div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs"><Brain size={16} /><span>{t('startMagic')} (x4)</span></div>
                  <span className="text-[8px] opacity-60 font-bold">{ENERGY_COSTS.IMAGE_FLASH * 4} {t('energy')}</span>
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
            <Sparkles size={18} className="text-cyan-500" />
            <h3 className="text-sm font-black tracking-tight text-white uppercase">{t('genVisuals')}</h3>
            {results.length > 0 && <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-[9px] font-black text-cyan-400 uppercase tracking-widest">BATCH READY</span>}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt}
              className="p-2 bg-white/5 text-slate-400 hover:text-cyan-400 hover:bg-white/10 border border-white/5 rounded-lg transition-all disabled:opacity-20" 
              title={t('startMagic')}
            >
              <RefreshCw size={18} className={isGenerating ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        <div className="flex-grow p-6 overflow-y-auto no-scrollbar scroll-smooth custom-scrollbar">
          {isGenerating && results.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4).fill(null).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-3 animate-pulse relative overflow-hidden">
                   <div className="w-12 h-12 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin" />
                   <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em]">Processing {i+1}</p>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-800 py-24 space-y-6">
              <div className="w-32 h-32 rounded-2xl bg-slate-900/30 border border-white/5 flex items-center justify-center shadow-inner group transition-all duration-700 hover:scale-105">
                <ImageIcon size={64} className="opacity-5 group-hover:opacity-10 transition-all duration-700" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40">{t('waitingMagic')}</p>
                <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest max-w-xs leading-relaxed">{t('uploadNotice')}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((res, idx) => (
                <div key={`${res}-${idx}`} className="group relative aspect-square rounded-lg overflow-hidden bg-slate-950 border border-white/5 shadow-xl transition-all duration-500 hover:border-cyan-500/30 animate-in zoom-in-95 duration-500">
                  <img src={res} className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105" alt="result" />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="flex items-center justify-center gap-3">
                       <button 
                        onClick={() => setPreviewImage({url: res, index: idx})} 
                        className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-white hover:text-black transition-all shadow-xl hover:scale-110 active:scale-90"
                        title={t('viewWork')}
                       >
                         <Eye size={18} />
                       </button>
                       <button 
                        onClick={() => downloadImage(res, idx)} 
                        className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-white hover:text-black transition-all shadow-xl hover:scale-110 active:scale-90"
                        title={t('downloadAsset')}
                       >
                         <Download size={18} />
                       </button>
                       <button 
                        onClick={() => manualArchive(res, idx)} 
                        className={`p-3 backdrop-blur-xl border transition-all shadow-xl hover:scale-110 active:scale-90 rounded-xl ${savedIds.has(idx) ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/10 border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-500'}`}
                        title={t('archive')}
                       >
                         {savedIds.has(idx) ? <CheckCircle2 size={18} /> : <Archive size={18} />}
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;
