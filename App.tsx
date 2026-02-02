
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  History, 
  CircleUser,
  Menu,
  X,
  Zap,
  Wand2,
  Bell,
  ChevronLeft,
  ChevronRight,
  Crown,
  LogOut,
  LogIn,
  Mail,
  Lock,
  Loader2,
  Sparkles
} from 'lucide-react';
import ImageStudio from './pages/ImageStudio';
import TextStudio from './pages/TextStudio';
import VideoStudio from './pages/VideoStudio';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import ProfileSettings from './pages/ProfileSettings';
import HistoryStudio from './pages/HistoryStudio';
import { User } from './types';
import { useLanguage } from './contexts/LanguageContext';

const GUEST_USER: User = {
  id: 'guest',
  name: '游客用户',
  tier: 'free',
  magicEnergy: 0,
  isGuest: true
};

const MagicLogo = ({ size = 'md', showText = true, collapsed = false }: { size?: 'sm' | 'md' | 'lg', showText?: boolean, collapsed?: boolean }) => {
  const { t } = useLanguage();
  
  const sizeClasses = {
    sm: { container: 'gap-2', box: 'w-8 h-8', icon: 16, text: 'text-base', sub: 'text-[7px]' },
    md: { container: 'gap-3', box: 'w-10 h-10', icon: 20, text: 'text-lg', sub: 'text-[8px]' },
    lg: { container: 'gap-4', box: 'w-14 h-14', icon: 28, text: 'text-2xl', sub: 'text-[10px]' },
  };
  const config = sizeClasses[size];

  return (
    <div className={`flex items-center ${collapsed ? 'justify-center' : config.container} group relative cursor-pointer w-full`}>
      <div className={`relative ${config.box} flex-shrink-0 flex items-center justify-center transition-all duration-700 group-hover:rotate-[360deg]`}>
        {/* 外层科技环 */}
        <div className="absolute inset-[-4px] border border-dashed border-indigo-500/20 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-indigo-500/50 group-hover:animate-[spin_3s_linear_infinite]"></div>
        
        <div className="absolute inset-0 bg-indigo-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="relative h-full w-full bg-[#020617] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-md group-hover:border-indigo-500/40 transition-colors">
          <div className="relative text-indigo-400 group-hover:text-white transition-all duration-500 transform group-hover:scale-110">
            <Wand2 size={config.icon} strokeWidth={1.5} className="animate-pulse" />
          </div>
        </div>
      </div>

      {showText && !collapsed && (
        <div className="flex flex-col tracking-tight text-slide-in overflow-hidden transition-all duration-500">
          <span className={`${config.text} font-black leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-indigo-400 group-hover:to-cyan-400 transition-all duration-700 text-glow-sm whitespace-nowrap`}>
            {t('appName')}
          </span>
          <span className={`${config.sub} font-bold text-slate-500 uppercase tracking-[0.3em] mt-1 transition-colors group-hover:text-indigo-400 whitespace-nowrap`}>
            {t('appSubName')}
          </span>
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ user, isOpen, toggle, isCollapsed, toggleCollapse, onOpenAuth }: any) => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/', name: t('dashboard'), icon: <LayoutDashboard size={18} />, color: 'text-indigo-400' },
    { path: '/image', name: t('imageMagic'), icon: <ImageIcon size={18} />, color: 'text-cyan-400' },
    { path: '/text', name: t('textMagic'), icon: <FileText size={18} />, color: 'text-emerald-400' },
    { path: '/video', name: t('videoMagic'), icon: <Video size={18} />, color: 'text-rose-400' },
    { path: '/history', name: t('historyArchive'), icon: <History size={18} />, color: 'text-amber-400' },
    { path: '/pricing', name: t('upgrade'), icon: <Crown size={18} />, color: 'text-yellow-400' },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={toggle} />}
      <aside className={`fixed top-0 left-0 z-50 h-screen transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isCollapsed ? 'w-20' : 'w-64'} ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full bg-[#020617]/40 backdrop-blur-3xl p-4 relative group/sidebar">
          
          <button onClick={toggleCollapse} className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-indigo-600 border border-white/20 rounded-full items-center justify-center text-white z-20 shadow-xl opacity-0 group-hover/sidebar:opacity-100 hover:scale-125 active:scale-90 transition-all duration-300">
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
          
          <div className={`mb-12 flex-shrink-0 h-12 flex items-center transition-all duration-500 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
             <MagicLogo size="md" collapsed={isCollapsed} />
          </div>

          <nav className="flex-grow space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`
                    relative flex items-center rounded-xl transition-all duration-500 group overflow-hidden
                    ${isCollapsed ? 'justify-center h-12 w-12 mx-auto p-0' : 'gap-4 px-4 py-3 w-full'} 
                    ${isActive 
                      ? `bg-indigo-600/10 ${item.color} shadow-[0_0_20px_rgba(99,102,241,0.05)]` 
                      : 'text-slate-500 hover:text-white hover:translate-x-1'}
                  `}
                >
                  {/* 悬浮背景流光 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />

                  {/* 激活状态激光条 - 已修改为白色高亮 */}
                  {isActive && (
                    <div className="absolute left-0 w-[3px] h-6 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)] animate-pulse" />
                  )}

                  <div className={`relative z-10 transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'group-hover:scale-125 group-hover:translate-y-[-2px] group-hover:text-white'}`}>
                    {item.icon}
                  </div>
                  
                  {!isCollapsed ? (
                    <span className={`relative z-10 text-[13px] font-bold tracking-tight uppercase truncate transition-all duration-500 ${isActive ? 'opacity-100 translate-x-1' : 'opacity-50 group-hover:opacity-100'}`}>
                      {item.name}
                    </span>
                  ) : (
                    /* 科技感 Tooltip */
                    <div className="absolute left-full ml-4 px-3 py-2 bg-[#020617]/90 backdrop-blur-xl text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none translate-x-[-15px] group-hover:translate-x-0 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60] whitespace-nowrap">
                       <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#020617] border-l border-t border-white/10 rotate-[-45deg]" />
                       {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className={`mt-auto pt-6 border-t border-white/5 ${isCollapsed ? 'flex flex-col items-center gap-6' : 'px-2'}`}>
            {user.isGuest ? (
               <button onClick={onOpenAuth} className={`flex items-center rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 transition-all duration-500 border border-indigo-500/10 group relative ${isCollapsed ? 'w-12 h-12 justify-center' : 'gap-4 w-full p-3.5'}`}>
                 <CircleUser size={20} className="group-hover:scale-125 transition-transform duration-500" />
                 {!isCollapsed ? (
                   <span className="text-xs font-bold uppercase tracking-wider">{t('login')}</span>
                 ) : (
                   <div className="absolute left-full ml-4 px-3 py-2 bg-[#020617]/90 backdrop-blur-xl text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none translate-x-[-15px] group-hover:translate-x-0 transition-all duration-500 shadow-2xl z-[60] whitespace-nowrap">
                     {t('login')}
                   </div>
                 )}
               </button>
            ) : (
              <div onClick={() => navigate('/profile')} className={`flex items-center cursor-pointer group rounded-xl hover:bg-white/5 transition-all duration-500 relative ${isCollapsed ? 'justify-center w-full' : 'gap-3 p-2'}`}>
                <div className={`relative shrink-0 w-10 h-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <div className="relative w-full h-full rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-full h-full" alt="avatar" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-[#020617] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  </div>
                </div>
                {!isCollapsed ? (
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate leading-tight group-hover:text-indigo-400 transition-colors">{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">E: {user.magicEnergy}</p>
                  </div>
                ) : (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-[#020617]/90 backdrop-blur-xl text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none translate-x-[-15px] group-hover:translate-x-0 transition-all duration-500 shadow-2xl z-[60] whitespace-nowrap">
                    {user.name}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

const AuthModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (u: User) => void }) => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => { onLogin({ id: 'user_123', name: 'MagicMage', tier: 'pro', magicEnergy: 2500, isGuest: false }); onClose(); }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-[420px] glass-card rounded-[2.5rem] p-10 relative overflow-hidden border border-white/10">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all"><X size={20} /></button>
        <div className="text-center mb-10">
          <div className="flex justify-center mb-8"><MagicLogo size="lg" /></div>
          <div className="flex bg-slate-950/50 p-1.5 rounded-xl border border-white/5">
            <button onClick={() => setTab('login')} className={`flex-grow py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${tab === 'login' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>{t('login')}</button>
            <button onClick={() => setTab('register')} className={`flex-grow py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${tab === 'register' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>{t('register')}</button>
          </div>
        </div>
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('emailAddress')}</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
              <input type="email" placeholder="mail@example.com" className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('password')}</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
              <input type="password" placeholder="••••••••" className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all" />
            </div>
          </div>
          <button onClick={handleLogin} disabled={isLoading} className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 mt-4">
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : t('login')}
          </button>
        </div>
      </div>
    </div>
  );
};

const AppContent = ({ 
  user, 
  setUser, 
  sidebarOpen, 
  setSidebarOpen, 
  isCollapsed, 
  setIsCollapsed, 
  isAuthModalOpen, 
  setIsAuthModalOpen 
}: any) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-slate-200 selection:bg-indigo-500/30">
      <Sidebar user={user} isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} onOpenAuth={() => setIsAuthModalOpen(true)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={setUser} />
      
      <div className={`transition-all duration-500 flex flex-col min-h-screen ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <header className="sticky top-0 z-40 flex items-center px-8 h-16 bg-[#020617]/40 backdrop-blur-3xl">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 text-slate-400 bg-white/5 rounded-xl mr-4"><Menu size={20} /></button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex flex-col items-end mr-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{t('manaPool')}</span>
               <span className="text-sm font-black text-white flex items-center gap-1.5 leading-none text-glow-sm transition-all hover:scale-110"><Zap size={14} className="text-amber-500 fill-amber-500 animate-pulse" />{user.magicEnergy}</span>
            </div>
            
            <button onClick={() => user.isGuest ? setIsAuthModalOpen(true) : navigate('/profile')} className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all hover:rotate-12 group">
              <Bell size={18} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
            </button>
            
            {!user.isGuest ? (
              <button 
                onClick={() => { setUser(GUEST_USER); navigate('/'); }} 
                className="h-10 w-10 flex items-center justify-center bg-transparent text-slate-500 hover:text-rose-400 hover:bg-white/5 rounded-xl transition-all hover:scale-110 active:scale-95"
                title={t('logout')}
              >
                <LogOut size={18} />
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)} 
                className="h-