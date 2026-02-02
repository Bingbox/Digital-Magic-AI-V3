
import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  Loader2, 
  Download, 
  Trash2,
  Maximize2,
  Image as ImageIcon,
  Copy,
  Check,
  Search,
  FileText,
  ImageIcon as ImageToolIcon,
  CheckCircle2,
  Brain,
  Share2,
  X
} from 'lucide-react';
import { IMAGE_TOOLS, ENERGY_COSTS } from '../constants';
import { GeminiService } from '../services/gemini';
import { AIModel, User } from '../types';
import PublishModal from '../components/PublishModal';
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
  const [isBatch, setIsBatch] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [currentPublishContent, setCurrentPublishContent] = useState<any>(null);
  const [options, setOptions] = useState({
    aspectRatio: '1:1',
    imageSize: '1K',
    model: AIModel.IMAGE_PRO
  });

  const getCost = () => {
    const base = options.model === AIModel.IMAGE_PRO ? ENERGY_COSTS.IMAGE_PRO : ENERGY_COSTS.IMAGE_FLASH;
    return isBatch ? base * 4 : base;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (user.isGuest) {
      onOpenAuth();
      return;
    }

    const cost = getCost();
    if (user.magicEnergy < cost) {
      alert(`${t('insufficientMana')} 本次施法需要 ${cost} 能量。`);
      return;
    }

    // 检查并提示 API Key
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    setIsGenerating(true);
    try {
      let newImages: string[] = [];
      if (isBatch) {
        const promises = Array(4).fill(null).map(() => 
          GeminiService.generateImage(`${selectedTool.name}场景下的商业大片: ${prompt}`, options, referenceImage || undefined)
        );
        newImages = await Promise.all(promises);
      } else {
        const imageUrl = await GeminiService.generateImage(`${selectedTool.name}效果: ${prompt}`, options, referenceImage || undefined);
        newImages = [imageUrl];
      }
      
      setResults(prev => [...newImages, ...prev]);
      
      // 保存到本地历史记录（供 CommerceHub 使用）
      newImages.forEach(img => {
        GeminiService.saveToHistory({
          title: prompt.slice(0, 15),
          type: 'image',
          content: img
        });
      });

      // 扣除能量
      setUser({ ...user, magicEnergy: user.magicEnergy - cost });
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found.")) {
        if (typeof window !== 'undefined' && (window as any).aistudio) {
           await (window as any).aistudio.openSelectKey();
        }
      } else {
        alert(err.message || "生成失败，请稍后重试。");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = (res: string) => {
    setCurrentPublishContent(res);
    setIsPublishOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <PublishModal isOpen={isPublishOpen} onClose={() => setIsPublishOpen(false)} content={currentPublishContent} type="image" />
      
      {/* 左侧控制台 */}
      <div className="w-full lg:w-96 space-y-6">
        <div className="bg-[#0f172a]/60 border border-slate-800 rounded-2xl p-8 space-y-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-xl font-black flex items-center gap-3 text-white">
            <div className="p-2 bg-cyan-500/20 rounded-lg"><ImageIcon size={20} className="text-cyan-400" /></div>
            {t('imgStudioTitle')}
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('templates')}</label>
              <button onClick={() => setIsBatch(!isBatch)} className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${isBatch ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-800/50 text-slate-500'}`}>{isBatch ? t('batchMode') : t('singleMode')}</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {IMAGE_TOOLS.map(tool => (
                <button key={tool.id} onClick={() => setSelectedTool(tool)} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[11px] font-black transition-all ${selectedTool.id === tool.id ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800 border border-slate-800/50'}`}>
                  <span className="text-lg">{tool.icon}</span>{tool.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('renderCore')}</label>
             <select value={options.model} onChange={e => setOptions({...options, model: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-bold text-slate-300 outline-none appearance-none">
               <option value={AIModel.IMAGE_PRO}>Gemini 3 Pro (极致渲染)</option>
               <option value={AIModel.IMAGE_FLASH}>Gemini 2.5 Flash (快速生成)</option>
             </select>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('promptLabel')}</label>
             <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t('promptPlaceholder')} className="w-full min-h-[160px] bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all resize-none placeholder:text-slate-700 leading-relaxed" />
          </div>

          <button onClick={handleGenerate} disabled={isGenerating || !prompt} className={`w-full py-5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isGenerating || !prompt ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-xl shadow-cyan-600/20 active:scale-[0.98]'}`}>
            {isGenerating ? <><Loader2 className="animate-spin" size={20} />{t('pixelReconstruct')}</> : <div className="flex flex-col items-center"><div className="flex items-center gap-2"><Brain size={20} />{t('startMagic')}</div><span className="text-[9px] opacity-60 mt-1 uppercase tracking-widest">{t('expectedCost')}：{getCost()} {t('energy')}</span></div>}
          </button>
        </div>

        {/* 上传区域 */}
        <div onClick={() => fileInputRef.current?.click()} className={`w-full h-48 bg-slate-950/40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group relative overflow-hidden ${referenceImage ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-800 hover:border-cyan-500/30 hover:bg-cyan-500/5'}`}>
          <input type="file" ref={fileInputRef} onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setReferenceImage(reader.result as string);
              reader.readAsDataURL(file);
            }
          }} accept="image/*" className="hidden" />
          {referenceImage ? (
            <><img src={referenceImage} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px]" alt="ref-bg" /><div className="relative z-10 flex flex-col items-center gap-2"><div className="w-16 h-16 rounded-xl border-2 border-white/20 overflow-hidden shadow-2xl"><img src={referenceImage} className="w-full h-full object-cover" alt="ref-preview" /></div><p className="text-[10px] font-black text-white uppercase tracking-widest shadow-sm">点击更换图片</p></div><button onClick={(e) => { e.stopPropagation(); setReferenceImage(null); }} className="absolute top-3 right-3 z-20 p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all shadow-lg"><Trash2 size={14} /></button></>
          ) : (
            <><div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-cyan-400 transition-all"><Upload size={20} /></div><div className="text-center"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{t('uploadReference')}</p><p className="text-[8px] text-slate-600 mt-1 uppercase font-bold">{t('uploadNotice')}</p></div></>
          )}
        </div>
      </div>

      {/* 右侧预览区 */}
      <div className="flex-grow">
        <div className="bg-[#0f172a]/20 border border-slate-900 rounded-2xl min-h-[780px] flex flex-col relative overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="p-8 border-b border-slate-900 flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-3"><ImageIcon size={20} className="text-cyan-500" />{t('genVisuals')}</h3>
          </div>
          <div className="flex-grow p-8 overflow-y-auto bg-slate-950/40 custom-scrollbar">
            {isGenerating && results.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-8 text-center"><div className="relative"><div className="w-24 h-24 border-[4px] border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin" /><Sparkles size={32} className="absolute inset-0 m-auto text-cyan-400 animate-pulse" /></div><p className="text-2xl font-black text-white tracking-tight uppercase">{t('pixelReconstruct')}</p></div>
            ) : results.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 py-20"><div className="w-24 h-24 rounded-2xl bg-slate-900/50 flex items-center justify-center mb-8 border border-slate-800/30"><ImageIcon size={48} className="opacity-10" /></div><p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">{t('waitingMagic')}</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {results.map((res, idx) => (
                  <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all duration-500 hover:border-cyan-500/50">
                    <img src={res} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="result" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                      <button onClick={() => handlePublish(res)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20"><Share2 size={16} /> {t('smartPublish')}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;
