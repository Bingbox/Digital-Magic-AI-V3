
import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Loader2,
  Zap,
  RefreshCw,
  Brain,
  Download,
  Archive,
  CheckCircle2,
  X,
  Maximize2,
  Lightbulb,
  Target,
  Feather
} from 'lucide-react';
import { TEXT_TOOLS, ENERGY_COSTS } from '../constants';
import { GeminiService } from '../services/gemini';
import { AIModel, User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  user: User;
  setUser: (u: User) => void;
  onOpenAuth: () => void;
}

const TextStudio = ({ user, setUser, onOpenAuth }: Props) => {
  const { t } = useLanguage();
  const [selectedTool, setSelectedTool] = useState(TEXT_TOOLS[0]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputs, setOutputs] = useState<{content: string, style: string}[]>([]);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState(AIModel.FLASH);
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  const getCost = () => {
    return selectedModel === AIModel.PRO ? ENERGY_COSTS.TEXT_PRO : ENERGY_COSTS.TEXT_FLASH;
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    if (user.isGuest) { onOpenAuth(); return; }

    const singleTextCost = getCost();
    const totalCost = singleTextCost * 3; 
    if (user.magicEnergy < totalCost) {
      alert(`${t('insufficientMana')}`);
      return;
    }

    setIsGenerating(true);
    setOutputs([]);
    setSavedIds(new Set());
    
    try {
      const styles = [
        { 
          label: t('styleProfessional'), 
          icon: <Target size={14} />,
          instruction: "你是一位资深品牌营销官。请针对用户需求撰写一篇正式、专业、逻辑严密的商业文案。要求：语言沉稳、突出品牌实力与产品可靠性。严禁输出任何分析、建议或前言，直接输出文案内容。" 
        },
        { 
          label: t('styleCreative'), 
          icon: <Feather size={14} />,
          instruction: "你是一位顶级广告创意总监。请针对用户需求撰写一篇富有想象力、触动情感、画面感极强的创意文案。要求：文字灵动、能够引发受众共鸣。严禁输出任何逻辑说明，直接输出文案内容。" 
        },
        { 
          label: t('styleConcise'), 
          icon: <Lightbulb size={14} />,
          instruction: "你是一位爆款短视频/社交媒体运营专家。请针对用户需求撰写一篇高对比度、利益点直戳痛点、带有强行动指令的爆款文案。要求：简洁有力、适合快速阅读。严禁输出任何解释性文字，直接输出文案正文。" 
        }
      ];

      const generateTasks = styles.map(async (style) => {
        const res = await GeminiService.generateText(
          `[TASK: ${selectedTool.name.toUpperCase()}]\n[USER_BRIEF: ${input}]\n[RULE: ONLY OUTPUT THE COPY CONTENT, NO LOGIC, NO EXPLANATION]`,
          selectedModel,
          style.instruction
        );
        return { content: res || '', style: style.label };
      });
      
      const results = await Promise.all(generateTasks);
      setOutputs(results.filter(r => r.content));
      setUser({ ...user, magicEnergy: user.magicEnergy - totalCost });
    } catch (err) {
      console.error(err);
      alert("文案生成失败，请检查配额或网络连接。");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadAsTxt = (text: string, index: number) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `magic-copy-${selectedTool.id}-${Date.now()}-${index}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const manualArchive = (text: string, index: number, styleLabel: string) => {
    GeminiService.saveToHistory({ 
      title: `${selectedTool.name} (${styleLabel}) - ${input.slice(0, 10)}`,
      type: 'text', 
      content: text 
    });
    setSavedIds(prev => new Set(prev).add(index));
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 animate-in fade-in slide-in-from-right-4 duration-500 max-h-[calc(100vh-100px)] overflow-hidden">
      
      {/* 沉浸式文案预览灯箱 */}
      {previewContent && (
        <div className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-2xl flex flex-col animate-in fade-in duration-300" onClick={() => setPreviewContent(null)}>
           <div className="px-6 py-4 flex items-center justify-between relative z-10 bg-black/40 border-b border-white/5">
             <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/10 rounded-lg text-white"><FileText size={16} /></div>
                <p className="text-xs font-black text-white uppercase tracking-widest">{t('viewWork')}</p>
             </div>
             <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); copyToClipboard(previewContent, 999); }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
                >
                  {copiedId === 999 ? <Check size={14} /> : <Copy size={14} />} 
                  {copiedId === 999 ? t('copied') : t('copyFull')}
                </button>
                <button className="p-2 bg-white/10 text-white/50 hover:text-white rounded-lg transition-all border border-white/10"><X size={20} /></button>
             </div>
           </div>

           <div className="flex-grow flex items-center justify-center p-6 lg:p-20 overflow-hidden">
             <div className="w-full max-w-4xl max-h-full overflow-y-auto bg-slate-900/50 p-10 rounded-xl border border-white/5 shadow-2xl custom-scrollbar" onClick={e => e.stopPropagation()}>
                <article className="prose prose-invert prose-emerald max-w-none whitespace-pre-wrap text-slate-200 leading-relaxed font-medium text-lg">
                  {previewContent}
                </article>
             </div>
           </div>
        </div>
      )}

      {/* 左侧：文案控制面板 */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-full overflow-hidden">
        <div className="flex-grow bg-[#0f172a]/80 border border-slate-800 rounded-xl flex flex-col backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <header className="px-6 py-4 border-b border-slate-800 shrink-0 relative z-10 bg-slate-900/40">
            <h2 className="text-base font-black flex items-center gap-2 text-white">
              <FileText size={18} className="text-emerald-400" />
              {t('textStudioTitle')}
            </h2>
          </header>

          <div className="flex-grow overflow-y-auto no-scrollbar p-6 space-y-6 relative z-10 custom-scrollbar">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('textSkills')}</label>
              <div className="grid grid-cols-2 gap-2">
                {TEXT_TOOLS.map(tool => (
                  <button 
                    key={tool.id} 
                    onClick={() => setSelectedTool(tool)} 
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[10px] font-black transition-all border ${selectedTool.id === tool.id ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-slate-800/30 text-slate-400 border-slate-800/50 hover:bg-slate-800'}`}
                  >
                    <span>{tool.icon}</span>
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('textRequirements')}</label>
               <textarea 
                 value={input} 
                 onChange={(e) => setInput(e.target.value)} 
                 placeholder={t('textPlaceholder')} 
                 className="w-full min-h-[160px] bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all resize-none placeholder:text-slate-700 font-medium" 
               />
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('textModelSelect')}</label>
              <div className="grid grid-cols-1 gap-2">
                 <select 
                   value={selectedModel} 
                   onChange={e => setSelectedModel(e.target.value as any)}
                   className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-bold text-slate-300 focus:border-emerald-500 focus:outline-none"
                 >
                   <option value={AIModel.FLASH}>Gemini 3 Flash (Fast)</option>
                   <option value={AIModel.PRO}>Gemini 3 Pro (High Quality)</option>
                 </select>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-800 shrink-0 relative z-10">
            <button 
              onClick={handleGenerate} 
              disabled={isGenerating || !input} 
              className="w-full py-4 rounded-lg font-black uppercase tracking-widest flex flex-col items-center justify-center gap-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl active:scale-[0.98] disabled:opacity-40 transition-all"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2 text-xs"><Loader2 className="animate-spin" size={16} /><span>{t('generatingVariants')}</span></div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs"><Brain size={16} /><span>{t('startMagic')} (x3)</span></div>
                  <span className="text-[8px] opacity-60 font-bold">{getCost() * 3} {t('energy')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 右侧：文案产出区 */}
      <div className="flex-grow flex flex-col bg-[#0f172a]/40 border border-white/5 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md h-full">
        <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-emerald-500" />
            <h3 className="text-sm font-black tracking-tight text-white uppercase">{t('textOutputPreview')}</h3>
            {outputs.length > 0 && <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-black text-emerald-400 uppercase tracking-widest">Multi-Style Sync</span>}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleGenerate} 
              disabled={isGenerating || !input}
              className="p-2 bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-white/10 border border-white/5 rounded-lg transition-all disabled:opacity-20" 
              title={t('startMagic')}
            >
              <RefreshCw size={18} className={isGenerating ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        <div className="flex-grow p-6 overflow-y-auto no-scrollbar scroll-smooth custom-scrollbar bg-slate-950/20">
          {isGenerating && outputs.length === 0 ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-full h-48 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center justify-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin" />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{t('generatingVariants')}</p>
                </div>
              ))}
            </div>
          ) : outputs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-800 py-24 space-y-6">
              <div className="w-32 h-32 rounded-2xl bg-slate-900/30 border border-white/5 flex items-center justify-center shadow-inner group transition-all duration-700 hover:scale-105">
                <FileText size={64} className="opacity-5 group-hover:opacity-10 transition-all duration-700" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40">{t('waitText')}</p>
                <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest max-w-xs leading-relaxed">描述您的创意蓝图，三位专家将为您效劳</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {outputs.map((item, idx) => (
                <div key={idx} className={`group relative w-full bg-slate-900/40 border rounded-lg p-8 shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 ${
                  idx === 0 ? 'border-indigo-500/20 hover:border-indigo-500/50' : 
                  idx === 1 ? 'border-emerald-500/20 hover:border-emerald-500/50' : 
                  'border-amber-500/20 hover:border-amber-500/50'
                }`}>
                  {/* 风格标识 */}
                  <div className="absolute top-0 left-8 -translate-y-1/2 flex items-center gap-2 px-3 py-1 bg-[#020617] border border-white/10 rounded-full shadow-lg">
                    <span className={`p-1 rounded-full ${
                      idx === 0 ? 'text-indigo-400 bg-indigo-500/10' : 
                      idx === 1 ? 'text-emerald-400 bg-emerald-500/10' : 
                      'text-amber-400 bg-amber-500/10'
                    }`}>
                      {idx === 0 ? <Target size={12} /> : idx === 1 ? <Feather size={12} /> : <Zap size={12} />}
                    </span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.style}</span>
                  </div>

                  <article className="prose prose-invert prose-emerald max-w-none whitespace-pre-wrap text-slate-300 leading-relaxed font-medium text-sm">
                    {item.content}
                  </article>
                  
                  {/* 操作栏 */}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <div className="flex items-center justify-center gap-3">
                       <button 
                        onClick={() => setPreviewContent(item.content)} 
                        className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-white hover:text-black transition-all shadow-xl hover:scale-110"
                        title={t('viewWork')}
                       >
                         <Maximize2 size={16} />
                       </button>
                       <button 
                        onClick={() => copyToClipboard(item.content, idx)} 
                        className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-white hover:text-black transition-all shadow-xl hover:scale-110"
                        title={t('copyFull')}
                       >
                         {copiedId === idx ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                       </button>
                       <button 
                        onClick={() => downloadAsTxt(item.content, idx)} 
                        className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-white hover:text-black transition-all shadow-xl hover:scale-110"
                        title={t('saveToLocal')}
                       >
                         <Download size={16} />
                       </button>
                       <button 
                        onClick={() => manualArchive(item.content, idx, item.style)} 
                        className={`p-3 backdrop-blur-xl border transition-all shadow-xl hover:scale-110 active:scale-90 rounded-xl ${savedIds.has(idx) ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/10 border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-500'}`}
                        title={t('archive')}
                       >
                         {savedIds.has(idx) ? <CheckCircle2 size={16} /> : <Archive size={16} />}
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

export default TextStudio;
