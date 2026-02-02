
import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, Wand2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { User as UserType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

const AuthModal = ({ isOpen, onClose, onLoginSuccess }: Props) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 模拟后端延迟
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('magic_users') || '[]');

      if (mode === 'register') {
        // 校验
        if (formData.password.length < 6) {
          setError(t('passError'));
          setIsLoading(false);
          return;
        }
        if (storedUsers.some((u: any) => u.email === formData.email)) {
          setError('Email already exists');
          setIsLoading(false);
          return;
        }

        const newUser: UserType = {
          id: `u_${Date.now()}`,
          name: formData.username || 'Wizard',
          email: formData.email,
          tier: 'free',
          magicEnergy: 50,
          isGuest: false
        };

        const updatedUsers = [...storedUsers, { ...newUser, password: formData.password }];
        localStorage.setItem('magic_users', JSON.stringify(updatedUsers));
        
        onLoginSuccess(newUser);
        onClose();
      } else {
        // 登录逻辑
        const user = storedUsers.find((u: any) => u.email === formData.email && u.password === formData.password);
        if (user) {
          const { password, ...userWithoutPass } = user;
          onLoginSuccess(userWithoutPass);
          onClose();
        } else {
          setError(t('authError'));
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="w-full max-w-md bg-[#020617] border border-white/10 rounded-2xl p-8 relative shadow-2xl animate-in zoom-in-95 duration-400" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-all"><X size={20} /></button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
            <Wand2 className="text-indigo-400" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">{mode === 'login' ? t('login') : t('register')}</h2>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">{mode === 'login' ? 'Welcome back to the magic academy' : 'Begin your creative journey today'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('username')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="text" required
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  placeholder="Master Wizard"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="email" required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                placeholder="wizard@magic.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="password" required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[11px] font-bold text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-800 disabled:text-slate-600"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>{mode === 'login' ? t('login') : t('register')} <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            {mode === 'login' ? t('noAccount') : t('hasAccount')} {' '}
            <button 
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-indigo-400 hover:text-indigo-300 ml-1 underline underline-offset-4"
            >
              {mode === 'login' ? t('register') : t('login')}
            </button>
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-700">
             <ShieldCheck size={14} />
             <span className="text-[9px] font-black uppercase tracking-widest">Secure Magical Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
