
import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Settings, 
  Shield, 
  ChevronRight, 
  Zap, 
  QrCode,
  CheckCircle2,
  Smartphone,
  CreditCard,
  Sparkles,
  Gift,
  History as HistoryIcon,
  Crown,
  Languages,
  Lock
} from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const ProfileSettings = ({ user, setUser }: { user: User, setUser: (u: User) => void }) => {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('membership');
  const [selectedPackId, setSelectedPackId] = useState(1);
  const [payMethod, setPayMethod] = useState<'wechat' | 'alipay' | 'card'>('wechat');

  // Password Modification State
  const [passForm, setPassForm] = useState({ current: '', next: '', confirm: '' });
  const [passStatus, setPassStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const rechargePacks = [
    { id: 1, price: 10, baseEnergy: 100, bonus: 0, desc: t('all') === '全部' ? '试用魔法包' : 'Trial Pack' },
    { id: 2, price: 50, baseEnergy: 500, bonus: 50, desc: t('all') === '全部' ? '基础炼金包' : 'Basic Pack', tag: '10%' },
    { id: 3, price: 100, baseEnergy: 1000, bonus: 150, desc: t('all') === '全部' ? '高级法师包' : 'Advanced Pack', tag: '15%', popular: true },
    { id: 4, price: 200, baseEnergy: 2000, bonus: 300, desc: t('all') === '全部' ? '资深先知包' : 'Senior Pack', tag: '15%' },
    { id: 5, price: 500, baseEnergy: 5000, bonus: 1000, desc: t('all') === '全部' ? '至尊大魔导师' : 'Supreme Pack', tag: '20%' },
    { id: 6, price: 1000, baseEnergy: 10000, bonus: 2000, desc: t('all') === '全部' ? '神谕主宰者' : 'Oracle Pack', tag: '20%' },
  ];

  const handleRecharge = () => {
    const pack = rechargePacks.find(p => p.id === selectedPackId);
    if (pack) {
      const totalEnergy = pack.baseEnergy + pack.bonus;
      setUser({ ...user, magicEnergy: user.magicEnergy + totalEnergy });
      alert(t('all') === '全部' ? `注入成功！+${totalEnergy}` : `Success! +${totalEnergy}`);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.next !== passForm.confirm) {
       alert(t('all') === '全部' ? "两次输入的密码不一致" : "Passwords do not match");
       return;
    }
    setPassStatus('success');
    setTimeout(() => {
      setPassStatus('idle');
      setPassForm({ current: '', next: '', confirm: '' });
    }, 2000);
  };

  const tabs = [
    { id: 'account', name: t('profileInfo'), icon: <UserIcon size={18} /> },
    { id: 'membership', name: t('rechargeStation'), icon: <Zap size={18} /> },
    { id: 'orders', name: t('orderHistory'), icon: <HistoryIcon size={18} /> },
    { id: 'security', name: t('securityPrivacy'), icon: <Shield size={18} /> },
    { id: 'system', name: t('systemSettings'), icon: <Settings size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
             <UserIcon className="text-indigo-400" size={28} />
          </div>
          {t('userCenter')}
        </h1>
        <p className="text-slate-500 mt-2 font-medium">{t('manageAssets')}</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex flex-col gap-1 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-900 hover:text-white'}`}
            >
              {tab.icon}
              {tab.name}
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </aside>

        <main className="flex-grow">
          <div className="bg-[#0f172a]/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl min-h-[600px]">
            
            {activeTab === 'membership' && (
              <div className="space-y-10 animate-in fade-in duration-300">
                <div className="p-8 rounded-xl bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-950 border border-indigo-500/20 relative overflow-hidden">
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">{t('manaPool')}</p>
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-5xl font-black text-white">{user.magicEnergy}</h3>
                        <Zap size={24} className="text-amber-500 fill-amber-500 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t('currentLevel')}: {t('stable')}</span>
                       </div>
                    </div>
                  </div>
                  <div className="mt-10 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000" style={{ width: `${Math.min(100, (user.magicEnergy / 5000) * 100)}%` }}></div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                      <Sparkles size={18} className="text-indigo-400" />
                      {t('manaRecharge')}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-lg">{t('exchangeBase')}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {rechargePacks.map(pack => (
                      <div key={pack.id} onClick={() => setSelectedPackId(pack.id)} className={`cursor-pointer p-6 rounded-xl border-2 transition-all relative flex flex-col gap-2 ${selectedPackId === pack.id ? 'bg-indigo-600/5 border-indigo-500 shadow-xl' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                        {pack.tag && <div className="absolute -top-2 -right-2 px-2 py-1 bg-rose-600 text-white text-[9px] font-black rounded-lg">+{pack.tag}</div>}
                        {pack.popular && <div className="absolute top-0 left-0 px-3 py-1 bg-indigo-600 text-white text-[8px] font-black rounded-br-lg uppercase">{t('popular')}</div>}
                        <p className="text-[10px] font-black text-slate-500 uppercase mt-2">{pack.desc}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-2xl font-black text-white">{pack.baseEnergy + pack.bonus}</span>
                           <Zap size={14} className="text-amber-500" />
                        </div>
                        <div className="flex justify-between items-end mt-1">
                          <span className="text-xs font-black text-indigo-400">¥ {pack.price}</span>
                          {pack.bonus > 0 && <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1"><Gift size={10} /> {t('bonus')} {pack.bonus}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-slate-950 rounded-xl border border-slate-800/50">
                   <div className="space-y-6">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest">{t('payChannel')}</h4>
                      <div className="flex flex-col gap-3">
                         <button onClick={() => setPayMethod('wechat')} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${payMethod === 'wechat' ? 'border-indigo-500 bg-indigo-500/5 text-white' : 'border-slate-800 text-slate-500'}`}>
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white"><CheckCircle2 size={18}/></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('wechat')}</span>
                         </button>
                         <button onClick={() => setPayMethod('alipay')} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${payMethod === 'alipay' ? 'border-indigo-500 bg-indigo-500/5 text-white' : 'border-slate-800 text-slate-500'}`}>
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white"><CheckCircle2 size={18}/></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('alipay')}</span>
                         </button>
                      </div>
                   </div>
                   <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="p-4 bg-white rounded-xl shadow-2xl"><QrCode size={140} className="text-slate-900" /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{t('totalPayable')}</p>
                        <h5 className="text-2xl font-black text-white">¥ {rechargePacks.find(p=>p.id===selectedPackId)?.price}.00</h5>
                      </div>
                      <button onClick={handleRecharge} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl">{t('mockPay')}</button>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animate-in fade-in duration-300 max-w-md mx-auto space-y-8">
                 <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                       <Lock className="text-rose-400" size={32} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{t('modifyPassword')}</h3>
                 </div>

                 <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('oldPassword')}</label>
                       <input 
                         type="password" required
                         value={passForm.current} onChange={e => setPassForm({...passForm, current: e.target.value})}
                         className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-sm text-white focus:outline-none focus:border-rose-500 transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('newPassword')}</label>
                       <input 
                         type="password" required
                         value={passForm.next} onChange={e => setPassForm({...passForm, next: e.target.value})}
                         className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-sm text-white focus:outline-none focus:border-rose-500 transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('confirmPassword')}</label>
                       <input 
                         type="password" required
                         value={passForm.confirm} onChange={e => setPassForm({...passForm, confirm: e.target.value})}
                         className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-sm text-white focus:outline-none focus:border-rose-500 transition-all" 
                       />
                    </div>
                    <button type="submit" className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all mt-4">
                       {t('updatePassword')}
                    </button>
                    {passStatus === 'success' && <p className="text-center text-xs text-emerald-400 font-bold uppercase tracking-widest animate-pulse">Update Successful!</p>}
                 </form>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="animate-in fade-in duration-300 max-w-md mx-auto space-y-8">
                 <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                       <Languages className="text-indigo-400" size={32} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{t('changeLang')}</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('selectLang')}</label>
                       <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={() => setLanguage('zh')}
                            className={`py-6 rounded-xl border-2 font-black transition-all ${language === 'zh' ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-slate-800 text-slate-600 hover:border-slate-700'}`}
                          >
                             简体中文
                          </button>
                          <button 
                            onClick={() => setLanguage('en')}
                            className={`py-6 rounded-xl border-2 font-black transition-all ${language === 'en' ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-slate-800 text-slate-600 hover:border-slate-700'}`}
                          >
                             English
                          </button>
                       </div>
                    </div>
                    <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all">
                       {t('saveSettings')}
                    </button>
                 </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="animate-in fade-in duration-300 space-y-8">
                <div className="flex items-center gap-6 p-6 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-1">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-full h-full rounded-lg bg-slate-900" alt="avatar" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{user.name}</h3>
                    <p className="text-slate-500 text-xs font-medium">{user.email || user.phone || 'N/A'}</p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-lg border border-indigo-500/20">
                      <Crown size={12} fill="currentColor" /> {user.tier.toUpperCase()} LEVEL
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileSettings;
