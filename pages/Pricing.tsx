
import React from 'react';
import { Check, Zap, Shield, Crown, Star } from 'lucide-react';
import { PRICING_PLANS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const Pricing = () => {
  const { t } = useLanguage();
  return (
    <div className="max-w-6xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight">{t('pricingTitle')}</h1>
        <p className="text-slate-400 max-w-2xl mx-auto font-medium">
          {t('pricingSub')}
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 overflow-hidden shadow-xl">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" />
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('trustedBy')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRICING_PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`
              relative flex flex-col p-10 rounded-2xl border transition-all duration-500 hover:-translate-y-2 group
              ${plan.highlight 
                ? 'bg-gradient-to-b from-indigo-900/40 to-slate-950 border-indigo-500 shadow-2xl shadow-indigo-600/20' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'}
            `}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-2 shadow-2xl uppercase tracking-widest">
                <Crown size={12} fill="white" />
                {t('recommended')}
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">¥{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/{t('month')}</span>}
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-4 text-sm text-slate-300 font-medium">
                  <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Check size={12} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`
              w-full py-5 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl active:scale-[0.98]
              ${plan.highlight 
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20' 
                : 'bg-slate-800 hover:bg-slate-700 text-white'}
            `}>
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 p-12 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl shadow-2xl">
        <h3 className="text-2xl font-black text-white text-center mb-12 uppercase tracking-tight">{t('faq')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest">{t('copyrightQ')}</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{t('copyrightA')}</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest">{t('batchQ')}</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{t('batchA')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
