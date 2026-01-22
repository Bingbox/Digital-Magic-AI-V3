
import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  MessageSquare,
  Loader2,
  Zap,
  Send,
  ArrowRight,
  Brain
} from 'lucide-react';
import { TEXT_TOOLS, ENERGY_COSTS } from '../constants';
import { GeminiService } from '../services/gemini';
import { AIModel, User } from '../types';

interface Props {
  user: User;
  setUser: (u: User) => void;
  onOpenAuth: () => void;
}

const TextStudio = ({ user, setUser, onOpenAuth }: Props) => {
  const [selectedTool, setSelectedTool] = useState(TEXT_TOOLS[0]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AIModel.PRO);

  const getCost = () => {
    return selectedModel === AIModel.PRO ? ENERGY_COSTS.TEXT_PRO : ENERGY_COSTS.TEXT_FLASH;
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;

    if (user.isGuest) {
      onOpenAuth();
      return;
    }

    const cost = getCost();
    if (user.magicEnergy < cost) {
      alert(`魔力值不足！本次施法需要 ${cost} 能量，您当前仅剩 ${user.magicEnergy}。`);
      return;
    }

    setIsGenerating(true);
    try {
      const systemInstruction = `你是一位顶尖的内容商业化专家和文案撰稿人...`;
      const result = await GeminiService.generateText(input, selectedModel, systemInstruction);
      setOutput(result || '');

      // 扣费逻辑
      setUser({
        ...user,
        magicEnergy: user.magicEnergy - cost
      });

    } catch (err) {
      console.error(err);
      alert("生成失败");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* 左侧控制台 */}
      <div className="w-full lg:w-96 space-y-6">
        <div className="bg-[#0f172a]/60 border border-slate-800 rounded-2xl p-8 space-y-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-xl font-black flex items-center gap-3 text-white">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <FileText size={20} className="text-emerald-400" />
            </div>
            文案魔法工坊
          </h2>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">文案创作技能</label>
            <div className="grid grid-cols-2 gap-2">
              {TEXT_TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl text-[11px] font-black transition-all
                    ${selectedTool.id === tool.id 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800 border border-slate-800/50'}
                  `}
                >
                  <span className="text-lg">{tool.icon}</span>
                  {tool.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">创作模型选择</label>
             <select 
               value={selectedModel} 
               onChange={e => setSelectedModel(e.target.value as any)}
               className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-bold text-slate-300"
             >
               <option value={AIModel.PRO}>Gemini 3 Pro (深度逻辑/爆款)</option>
               <option value={AIModel.FLASH}>Gemini 3 Flash (极速响应)</option>
             </select>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">创作需求</label>
             <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`输入核心卖点...`}
              className="w-full min-h-[200px] bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all resize-none placeholder:text-slate-700"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !input}
            className={`
              w-full py-5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all
              ${isGenerating || !input 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-600/20 active:scale-[0.98]'}
            `}
          >
            {isGenerating ? (
              <><Loader2 className="animate-spin" size={20} />正在深度思考中...</>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2"><Brain size={20} />开始魔法创作</div>
                <span className="text-[9px] opacity-60 mt-1">预计消耗：{getCost()} 能量</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 右侧大屏预览 */}
      <div className="flex-grow">
        <div className="bg-[#0f172a]/20 border border-slate-900 rounded-2xl min-h-[640px] flex flex-col relative overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="p-8 border-b border-slate-900 flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-3">
              <MessageSquare size={20} className="text-emerald-500" />
              文案生成预览
            </h3>
            {output && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-black uppercase tracking-widest transition-all shadow-lg border border-slate-700"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  {copied ? '已复制' : '复制全文'}
                </button>
              </div>
            )}
          </div>

          <div className="flex-grow p-8 overflow-y-auto bg-slate-950/40 custom-scrollbar">
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center gap-8 text-center animate-in fade-in duration-500">
                <div className="relative">
                  <div className="w-24 h-24 border-[4px] border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                </div>
                <p className="text-2xl font-black text-white tracking-tight">AI 正在深度撰写中...</p>
              </div>
            ) : output ? (
              <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <article className="prose prose-invert prose-emerald max-w-none whitespace-pre-wrap text-slate-300 leading-relaxed font-medium text-base">
                  {output}
                </article>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 py-20">
                <div className="w-24 h-24 rounded-2xl bg-slate-900/50 flex items-center justify-center mb-8 border border-slate-800/30">
                  <Send size={48} className="opacity-10 translate-x-1" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">等待文案灵感注入</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextStudio;
