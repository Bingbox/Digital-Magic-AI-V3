
import React, { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  Play, 
  Settings2, 
  Download, 
  Clock, 
  Loader2,
  Clapperboard,
  Film,
  Zap,
  CheckCircle2,
  MonitorPlay,
  ZapIcon
} from 'lucide-react';
import { VIDEO_TOOLS, ENERGY_COSTS } from '../constants';
import { GeminiService } from '../services/gemini';
import { User, AIModel } from '../types';

interface Props {
  user: User;
  setUser: (u: User) => void;
  onOpenAuth: () => void;
}

const LOADING_MESSAGES = [
  "正在编织魔法帧...",
  "通过 Veo 3.1 引擎重塑光影...",
  "渲染商业级数字奇迹...",
  "正在打磨镜头动态...",
  "同步物理引擎与光影效果..."
];

const VideoStudio = ({ user, setUser, onOpenAuth }: Props) => {
  const [selectedTool, setSelectedTool] = useState(VIDEO_TOOLS[0]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [renderMode, setRenderMode] = useState<'HD' | 'FAST'>('HD');
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  const getCost = () => {
    return renderMode === 'HD' ? ENERGY_COSTS.VIDEO_HD : ENERGY_COSTS.VIDEO_FAST;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (user.isGuest) {
      onOpenAuth();
      return;
    }

    const cost = getCost();
    if (user.magicEnergy < cost) {
      alert(`魔力值不足！${renderMode === 'HD' ? '高清渲染' : '快速渲染'}需要 ${cost} 能量，您当前剩余 ${user.magicEnergy}。`);
      return;
    }
    
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    setIsGenerating(true);
    setVideoUrl(null);
    
    const msgInterval = setInterval(() => {
      setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 4500);

    try {
      const model = renderMode === 'HD' ? AIModel.VEO_HD : AIModel.VEO_FAST;
      const url = await GeminiService.generateVideo(`${selectedTool.name}: ${prompt}`, aspectRatio);
      setVideoUrl(url);

      setUser({
        ...user,
        magicEnergy: user.magicEnergy - cost
      });

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found.")) {
        if (typeof window !== 'undefined' && (window as any).aistudio) {
           await (window as any).aistudio.openSelectKey();
        }
      }
    } finally {
      setIsGenerating(false);
      clearInterval(msgInterval);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="w-full lg:w-96 space-y-6">
        <div className="bg-[#0f172a]/60 border border-slate-800 rounded-2xl p-8 space-y-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-xl font-black flex items-center gap-3 text-white">
            <div className="p-2 bg-rose-500/20 rounded-lg">
              <Video size={20} className="text-rose-400" />
            </div>
            视频魔法工坊
          </h2>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">渲染引擎模式</label>
            <div className="grid grid-cols-2 gap-2">
               <button 
                onClick={() => setRenderMode('HD')}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl text-[11px] font-black transition-all border
                  ${renderMode === 'HD' 
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 border-rose-500' 
                    : 'bg-slate-800/30 border-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
               >
                 <MonitorPlay size={18} />
                 <div className="flex flex-col items-start leading-none">
                    <span>高清旗舰</span>
                    <span className={`text-[8px] mt-1 ${renderMode === 'HD' ? 'text-rose-200' : 'text-slate-600'}`}>{ENERGY_COSTS.VIDEO_HD} 能量</span>
                 </div>
               </button>
               <button 
                onClick={() => setRenderMode('FAST')}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl text-[11px] font-black transition-all border
                  ${renderMode === 'FAST' 
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 border-rose-500' 
                    : 'bg-slate-800/30 border-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
               >
                 <ZapIcon size={18} />
                 <div className="flex flex-col items-start leading-none">
                    <span>快速预览</span>
                    <span className={`text-[8px] mt-1 ${renderMode === 'FAST' ? 'text-rose-200' : 'text-slate-600'}`}>{ENERGY_COSTS.VIDEO_FAST} 能量</span>
                 </div>
               </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">镜头画幅</label>
            <div className="flex gap-3">
               {['16:9', '9:16'].map(ratio => (
                 <button
                   key={ratio}
                   onClick={() => setAspectRatio(ratio)}
                   className={`
                     flex-grow py-3 rounded-lg text-[10px] font-black border transition-all uppercase tracking-widest
                     ${aspectRatio === ratio 
                       ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                       : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}
                   `}
                 >
                   {ratio === '16:9' ? '16:9 宽屏' : '9:16 竖屏'}
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">视频剧本</label>
             <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`描绘创意场景...`}
              className="w-full min-h-[160px] bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-rose-500 transition-all resize-none placeholder:text-slate-700"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className={`
              w-full py-5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all
              ${isGenerating || !prompt 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-xl shadow-rose-600/20 active:scale-[0.98]'}
            `}
          >
            {isGenerating ? (
              <><Loader2 className="animate-spin" size={20} />正在处理帧序列...</>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2"><Clapperboard size={20} />开启{renderMode === 'HD' ? '高清' : '快速'}渲染</div>
                <span className="text-[9px] opacity-60 mt-1 uppercase tracking-tighter">预计消耗：{getCost()} 魔法能量</span>
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="flex-grow">
        <div className="bg-[#0f172a]/20 border border-slate-900 rounded-2xl min-h-[640px] flex flex-col relative overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="p-8 border-b border-slate-900 flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-3">
              <Film size={20} className="text-rose-500" />
              渲染预览窗口
              <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-full uppercase tracking-widest">{renderMode} MODE</span>
            </h3>
            {videoUrl && (
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                <Download size={16} />保存到本地
              </button>
            )}
          </div>

          <div className="flex-grow flex items-center justify-center bg-black/60 relative">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-8 p-10 text-center animate-pulse">
                <p className="text-2xl font-black text-white tracking-tight">{LOADING_MESSAGES[loadingMsgIdx]}</p>
                <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-rose-500 animate-[loading_20s_ease-in-out_infinite]" />
                </div>
              </div>
            ) : videoUrl ? (
              <div className="w-full h-full p-8 flex items-center justify-center">
                <video src={videoUrl} controls className="w-full max-w-4xl rounded-xl shadow-2xl shadow-black border border-white/5" autoPlay loop />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-700">
                <Play size={48} className="opacity-10" />
                <p className="text-sm font-black uppercase tracking-widest mt-4 opacity-40">等待法术生效</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;
