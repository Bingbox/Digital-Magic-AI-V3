
import React from 'react';
import { Check, Zap, Shield, Crown, Star } from 'lucide-react';
import { PRICING_PLANS } from '../constants';

const Pricing = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">开启您的商业创意新纪元</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          选择最适合您业务规模的方案，解锁更多 AI 高级功能和更快的生成速度。
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 overflow-hidden">
                <img src={`https://picsum.photos/seed/${i+50}/32/32`} alt="user" />
              </div>
            ))}
          </div>
          <span className="text-xs text-slate-500">已有超过 10,000+ 品牌创作者选择我们</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRICING_PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`
              relative flex flex-col p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2
              ${plan.highlight 
                ? 'bg-gradient-to-b from-indigo-900/40 to-slate-900 border-indigo-500 shadow-2xl shadow-indigo-600/20' 
                : 'bg-slate-900 border-slate-800'}
            `}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Crown size={12} fill="white" />
                RECOMMENDED
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">¥{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-slate-500 text-sm">/月</span>}
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Check size={12} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`
              w-full py-4 rounded-2xl font-bold transition-all
              ${plan.highlight 
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg' 
                : 'bg-slate-800 hover:bg-slate-700 text-white'}
            `}>
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-6">
        <h3 className="text-xl font-bold">常见问题</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">生成的内容有版权风险吗？</h4>
            <p className="text-sm text-slate-500">OmniContent AI 生成的内容均为原创，用户拥有生成的商业用途使用权，具体请参考我们的商业授权协议。</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">支持批量处理吗？</h4>
            <p className="text-sm text-slate-500">是的，专业版及以上用户可以通过我们的“批量队列”功能，一次性处理多达 50 个生成任务。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
