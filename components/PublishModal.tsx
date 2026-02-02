
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Globe, ArrowRight, Share2, ExternalLink } from 'lucide-react';
import { ECOMMERCE_PLATFORMS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  content: any;
  type: 'image' | 'text' | 'video';
}

const PublishModal = ({ isOpen, onClose, content, type }: Props) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');
  const [selectedPlatform, setSelectedPlatform] = useState(ECOMMERCE_PLATFORMS[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('success'), 500);
            return 100;
          }
          return prev + 4;
        });
      }, 60);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}>
      <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-400" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all"><X size={20} /></button>
        
        {step === 'select' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-400">
            <div className="text-center">
               <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
                  <Share2 size={24} />
               </div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight">{t('publishTo')}</h3>
               <p className="text-slate-500 text-xs mt-1">{t('selectStore')}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
               {ECOMMERCE_PLATFORMS.map(platform => (
                 <button 
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`flex flex-col gap-3 p-4 rounded-xl border transition-all group relative active:scale-[0.98] ${selectedPlatform.id === platform.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'}`}
                 >
                    <div className="flex items-center justify-between w-full">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${platform.color} shadow-lg transition-transform group-hover:scale-110 overflow-hidden`}>
                          {React.cloneElement(platform.icon as React.ReactElement<any>, { size: 16 })}
                       </div>
                       {selectedPlatform.id === platform.id && <CheckCircle2 size={14} className="text-indigo-400" />}
                    </div>
                    <div className="text-left">
                       <p className="text-xs font-bold text-white tracking-tight uppercase">{platform.name}</p>
                       <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest bg-slate-800/50 px-1.5 py-0.5 rounded mt-1 inline-block">{platform.tag}</span>
                    </div>
                 </button>
               ))}
            </div>

            <button 
              onClick={() => setStep('processing')}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {t('confirm')} <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-6 animate-in zoom-in-95 duration-400 text-center">
             <div className="relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                  <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" 
                    className={`${selectedPlatform.color.replace('bg-', 'text-')} transition-all duration-300 stroke-dasharray-[276]`} 
                    style={{ strokeDasharray: '276', strokeDashoffset: 276 - (276 * progress / 100) }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className={`${selectedPlatform.color} p-3 rounded-lg text-white shadow-xl animate-pulse overflow-hidden transition-transform`}>
                      {React.cloneElement(selectedPlatform.icon as React.ReactElement<any>, { size: 24 })}
                   </div>
                </div>
             </div>
             <div>
                <h4 className="text-lg font-black text-white uppercase tracking-tight mb-1">{t('publishing')}</h4>
                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{selectedPlatform.name} SYNC {progress}%</p>
             </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-4 space-y-6 animate-in zoom-in-95 duration-400">
             <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                <CheckCircle2 size={32} />
             </div>
             <div>
                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">{t('publishSuccess')}</h4>
                <div className="flex items-center justify-center gap-2">
                   <div className={`${selectedPlatform.color} px-3 py-1 rounded-lg flex items-center gap-2 text-white shadow-md overflow-hidden`}>
                      {React.cloneElement(selectedPlatform.icon as React.ReactElement<any>, { size: 12 })}
                      <span className="text-[9px] font-black uppercase tracking-widest">{selectedPlatform.name}</span>
                   </div>
                </div>
             </div>
             <div className="flex flex-col gap-3">
                <button className="w-full py-4 bg-white hover:bg-slate-100 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]">
                   <ExternalLink size={16} /> {t('viewOnPlatform')}
                </button>
                <button onClick={onClose} className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-[0.98]">
                   {t('backToLogin')}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishModal;
