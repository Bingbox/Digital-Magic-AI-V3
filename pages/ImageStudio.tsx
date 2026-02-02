
import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  Settings2, 
  Loader2, 
  Download, 
  Trash2,
  Maximize2,
  Image as ImageIcon,
  Layers,
  Copy,
  Zap,
  CheckCircle2,
  Check,
  Search,
  Plus
} from 'lucide-react';
import { IMAGE_TOOLS, ENERGY_COSTS } from '../constants';
import { GeminiService } from '../services/gemini';
import { AIModel, User } from '../types';

interface Props {
  user: User;
  setUser: (u: User) => void;
  onOpenAuth: () => void;
}

const ImageStudio = ({ user, setUser, onOpenAuth }: Props) => {
  const [selectedTool, setSelectedTool] = useState(IMAGE_TOOLS[0]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBatch, setIsBatch] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
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
      alert(`魔力值不足！本次生成需要 ${cost} 能量。`);
      return;
    }

    if (typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    setIsGenerating(true);
    try {
      if (isBatch) {
        const promises = Array(4).fill(null).map(() => 
          GeminiService.generateImage(`${selectedTool.name}场景下的商业大片: ${prompt}, 电影级光影, 旗舰级细节`, options)
        );
        const newImages = await Promise.all(promises);
        setResults([...newImages, ...results]);
      } else {
        const imageUrl = await GeminiService.generateImage(`${selectedTool.name}效果: ${prompt},顶级商业摄影质感`, options);
        setResults([imageUrl, ...results]);
      }
      setUser({ ...user, magicEnergy: user.magicEnergy - cost });
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found.")) {
        if (typeof window !== 'undefined' && (window as any).aistudio) {
           await (window as any).aistudio.openSelectKey();
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* 左侧控制台 */}
      <div className="w-full lg:w-96 space-y-6">
        <div className="bg-[#0f172a]/60 border border-slate-800 rounded-2xl p-8 space-y-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[60px] pointer-events-none"></div>
          
          <h2 className="text-xl font-black flex items-center gap-3 text-white">
            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
              <ImageIcon size={20} />
            </div>
            图片魔法工坊
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">商业场景模式</label>
              <button 
                onClick={() => setIsBatch(!isBatch)}
                className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${isBatch ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-800/50 text-slate-500 hover:text-slate-300'}`}
              >
                {isBatch ? 'BATCH x4' : 'SINGLE'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {IMAGE_TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className={`
                    flex items-center gap-2 px-3 py-3 rounded-xl text-[11px] font-black transition-all border
                    ${selectedTool.id === tool.id 
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20 border-cyan-500' 
                      : 'bg-slate-800/30 border-slate-800/50 text-slate-400 hover:bg-slate-800'}
                  `}
                >
                  <span className="text-base">{tool.icon}</span>
                  {tool.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">画面咒语 (Spell)</label>
             <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`描述你想生成的 ${selectedTool.name} 视觉预期...`}
                className="w-full min-h-[160px] bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all resize-none placeholder:text-slate-700"
              />
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">核心配置</label>
             <div className="space-y-3">
                <select 
                  value={options.model} 
                  onChange={e => setOptions({...options, model: e.target.value as any})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-bold text-slate-300 outline-none"
                >
                  <option value={AIModel.IMAGE_PRO}>GEMINI 3 PRO (ULTRA)</option>
                  <option value={AIModel.IMAGE_FLASH}>GEMINI 2.5 FLASH (TURBO)</option>
                </select>
                <div className="grid grid-cols-2 gap-3">
                   <select 
                      value={options.aspectRatio} 
                      onChange={e => setOptions({...options, aspectRatio: e.target.value as any})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-[10px] font-bold text-slate-400 outline-none"
                    >
                      <option value="1:1">1:1 Square</option>
                      <option value="16:9">16:9 Wide</option>
                      <option value="9:16">9:16 Mobile</option>
                    </select>
                    <select 
                      value={options.imageSize} 
                      onChange={e => setOptions({...options, imageSize: e.target.value as any})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-[10px] font-bold text-slate-400 outline-none"
                    >
                      <option value="1K">1K Standard</option>
                      <option value="2K">2K Retina</option>
                      <option value="4K">4K Extreme</option>
                    </select>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className={`
                w-full py-5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all
                ${isGenerating || !prompt 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-xl shadow-cyan-600/20 active:scale-[0.98]'}
              `}
            >
              {isGenerating ? (
                <><Loader2 className="animate-spin" size={20} />正在重组像素粒子...</>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2"><Sparkles size={20} />开始魔法创作</div>
                  <span className="text-[9px] opacity-60 mt-1 uppercase">消耗：{getCost()} 能量</span>
                </div>
              )}
            </button>
            <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/10 flex items-center justify-center gap-2">
               <Search size={12} className="text-cyan-500" />
               <p className="text-[9px] text-cyan-500/80 font-black uppercase tracking-widest">
                 Google Search Grounding 已开启
               </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all cursor-pointer group">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-cyan-400 transition-all">
            <Upload size={20} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">上传参考原图</p>
        </div>
      </div>

      {/* 右侧大屏预览 */}
      <div className="flex-grow">
        <div className="bg-[#0f172a]/20 border border-slate-900 rounded-2xl min-h-[780px] flex flex-col relative overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="p-8 border-b border-slate-900 flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-3">
              <ImageIcon size={20} className="text-cyan-500" />
              图片产出中心
            </h3>
            {results.length > 0 && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCopied(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-black uppercase tracking-widest transition-all border border-slate-700 shadow-lg"
                >
                  {copied ? <Check size={16} className="text-cyan-400" /> : <Copy size={16} />}
                  复制图库
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg transition-all active:scale-95">
                  <Download size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="flex-grow p-8 overflow-y-auto bg-slate-950/40 custom-scrollbar">
            {isGenerating && results.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-8 text-center animate-in fade-in duration-500">
                <div className="relative">
                  <div className="w-24 h-24 border-[4px] border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin" />
                  <Sparkles size={32} className="absolute inset-0 m-auto text-cyan-400 animate-pulse" />
                </div>
                <p className="text-2xl font-black text-white tracking-tight uppercase">AI 像素渲染中...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 py-20 opacity-40">
                <div className="w-24 h-24 rounded-2xl bg-slate-900/50 flex items-center justify-center mb-8 border border-slate-800/30">
                  <ImageIcon size={48} className="opacity-10" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.2em]">等待视觉灵感召唤</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {isGenerating && (
                  <div className="aspect-square rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col items-center justify-center gap-4 animate-pulse">
                     <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                     <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">渲染中...</span>
                  </div>
                )}
                {results.map((res, idx) => (
                  <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all duration-500 hover:border-cyan-500/50 animate-in zoom-in-95">
                    <img src={res} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={`gen-${idx}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button className="p-2.5 bg-white text-black rounded-lg hover:bg-cyan-50 transition-all"><Download size={18} /></button>
                          <button className="p-2.5 bg-white/10 backdrop-blur-xl text-white rounded-lg hover:bg-white/20 transition-all"><Maximize2 size={18} /></button>
                        </div>
                        <button className="p-2.5 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-xl rounded-lg text-[9px] font-black text-white border border-white/5 tracking-widest uppercase flex items-center gap-1.5 shadow-xl">
                        <CheckCircle2 size={10} className="text-cyan-400" />
                        PRO SYNTH
                      </span>
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
