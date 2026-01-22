
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  History, 
  User as UserIcon,
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
  Smartphone,
  Fingerprint,
  Lock,
  ShieldCheck,
  Send,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ArrowRight,
  HelpCircle,
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
    sm: { container: 'gap-2', box: 'w-8 h-8', icon: 16, text: 'text-lg', sub: 'text-[7px]' },
    md: { container: 'gap-3', box: 'w-10 h-10', icon: 20, text: 'text-xl', sub: 'text-[8px]' },
    lg: { container: 'gap-4', box: 'w-12 h-12', icon: 26, text: 'text-3xl', sub: 'text-[10px]' },
  };
  const config = sizeClasses[size];

  return (
    <div className={`flex items-center ${config.container} ${collapsed ? 'justify-center' : ''} group relative cursor-pointer`}>
      <div className={`relative ${config.box} flex-shrink-0 transition-transform duration-500 group-hover:scale-110`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 rounded-xl blur-lg opacity-40 group-hover:opacity-80 transition-all duration-700"></div>
        <div className="relative h-full w-full bg-[#020617] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-cyan-500/20 animate-[spin_10s_linear_infinite]"></div>
          <div className="relative text-white group-hover:rotate-12 transition-transform duration-500">
            <Wand2 size={config.icon} className="drop-shadow-[0_0_8px_rgba(99,102,241,1)]" />
            <Sparkles size={config.icon / 1.8} className="absolute -top-1 -right-1 text-cyan-300 animate-pulse" />
          </div>
        </div>
      </div>
      {showText && !collapsed && (
        <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-700">
          <span className={`${config.text} font-black tracking-tighter leading-none bg-gradient-to-r from-white via-indigo-100 to-cyan-200 bg-clip-text text-transparent group-hover:tracking-normal transition-all duration-500`}>
            {t('appName')}
          </span>
          <span className={`${config.sub} font-black text-indigo-500/80 uppercase tracking-[0.4em] mt-2 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all`}>
            {t('appSubName')}
          </span>
        </div>
      )}
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (u: User) => void }) => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => { onLogin({ id: 'user_123', name: 'MagicMage', tier: 'pro', magicEnergy: 2500, isGuest: false }); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="w-full max-w-[480px] glass-card rounded-[3rem] p-12 sm:p-14 relative overflow-hidden transition-all duration-700">
        <button onClick={onClose} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-all p-3 hover:bg-white/5 rounded-full"><X size={24} /></button>
        <div className="text-center mb-12">
          <div className="flex justify-center mb-12"><MagicLogo size="lg" /></div>
          <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 mb-10">
            <button onClick={() => setTab('login')} className={`flex-grow py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === 'login' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300'}`}>{t('login')}</button>
            <button onClick={() => setTab('register')} className={`flex-grow py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === 'register' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300'}`}>{t('register')}</button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input type="email" placeholder={t('emailAddress')} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 text-base text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700" />
          </div>
          <div className="relative group">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input type="password" placeholder={t('password')} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 text-base text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700" />
          </div>
          <button onClick={handleLogin} disabled={isLoading} className="btn-shine w-full h-16 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-[12px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-2xl shadow-indigo-600/40 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <><Fingerprint size={24} />{t('login')}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ user, isOpen, toggle, isCollapsed, toggleCollapse, onOpenAuth }: any) => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/', name: t('dashboard'), icon: <LayoutDashboard size={22} />, color: 'text-indigo-400', bgColor: 'bg-indigo-400/10', glow: 'shadow-indigo-500/20' },
    { path: '/image', name: t('imageMagic'), icon: <ImageIcon size={22} />, color: 'text-cyan-400', bgColor: 'bg-cyan-400/10', glow: 'shadow-cyan-500/20' },
    { path: '/text', name: t('textMagic'), icon: <FileText size={22} />, color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', glow: 'shadow-emerald-500/20' },
    { path: '/video', name: t('videoMagic'), icon: <Video size={22} />, color: 'text-rose-400', bgColor: 'bg-rose-400/10', glow: 'shadow-rose-500/20' },
    { path: '/history', name: t('historyArchive'), icon: <History size={22} />, color: 'text-amber-400', bgColor: 'bg-amber-400/10', glow: 'shadow-amber-500/20' },
    { path: '/pricing', name: t('upgrade'), icon: <Crown size={22} />, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', glow: 'shadow-yellow-500/20' },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={toggle} />}
      <aside className={`fixed top-0 left-0 z-50 h-screen transition-all duration-700 ease-[var(--sidebar-ease)] ${isCollapsed ? 'w-24' : 'w-72'} ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full m-4 bg-[#020617]/80 backdrop-blur-3xl border border-white/5 rounded-[2rem] px-4 py-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
          
          {/* 装饰性光斑 */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-600/10 blur-[50px] pointer-events-none" />
          
          <button onClick={toggleCollapse} className="hidden lg:flex absolute -right-2 top-24 w-8 h-8 bg-indigo-600 rounded-full items-center justify-center text-white z-10 shadow-2xl hover:scale-110 active:scale-95 transition-all">
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          
          <div className="mb-12 px-2 flex-shrink-0">
             <MagicLogo size="md" collapsed={isCollapsed} />
          </div>

          <nav className="flex-grow space-y-3 custom-scrollbar overflow-y-auto px-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`
                    relative flex items-center rounded-2xl transition-all duration-500 group overflow-hidden
                    ${isCollapsed ? 'justify-center p-4' : 'gap-4 px-5 py-3.5'} 
                    ${isActive 
                      ? `bg-white/5 ${item.color} shadow-inner aurora-border` 
                      : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}
                  `}
                >
                  <div className={`transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_10px_currentColor]' : 'group-hover:scale-110 group-hover:text-slate-200 group-hover:rotate-6'}`}>
                    {item.icon}
                  </div>
                  
                  {!isCollapsed && (
                    <span className={`text-sm font-black tracking-tight uppercase truncate transition-all duration-500 ${isActive ? 'translate-x-2 opacity-100' : 'group-hover:translate-x-1 opacity-70 group-hover:opacity-100'}`}>
                      {item.name}
                    </span>
                  )}

                  {isActive && !isCollapsed && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
            {user.isGuest ? (
               <button onClick={onOpenAuth} className="flex items-center gap-4 w-full p-4 rounded-2xl bg-white/5 hover:bg-indigo-600/20 text-indigo-400 transition-all border border-white/5 group relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/5 to-indigo-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                 <CircleUser size={24} className="group-hover:rotate-12 transition-transform relative z-10" />
                 {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-[0.2em] relative z-10">{t('login')}</span>}
               </button>
            ) : (
              <div onClick={() => navigate('/profile')} className="flex items-center gap-4 cursor-pointer group p-3 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                <div className="relative w-12 h-12 shrink-0">
                  <div className="absolute inset-0 bg-indigo-600 blur-md opacity-0 group-hover:opacity-40 transition-opacity rounded-full" />
                  <div className="relative w-full h-full rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 group-hover:border-indigo-500/50 transition-all overflow-hidden shadow-inner">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-full h-full scale-110 group-hover:scale-125 transition-transform duration-500" alt="avatar" />
                  </div>
                </div>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className="text-[13px] font-black text-white truncate leading-tight group-hover:text-indigo-300 transition-colors">{user.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Zap size={10} className="text-amber-500 fill-amber-500 animate-pulse" />
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.magicEnergy}</span>
                    </div>
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

// Internal component to handle layout and navigation logic within HashRouter context
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
      
      <div className={`transition-all duration-700 ease-[var(--sidebar-ease)] flex flex-col min-h-screen ${isCollapsed ? 'lg:pl-28' : 'lg:pl-80'}`}>
        <header className="sticky top-0 z-40 flex items-center px-8 h-20 bg-[#020617]/40 backdrop-blur-3xl border-b border-white/5">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 text-slate-400 bg-white/5 rounded-xl mr-4"><Menu size={22} /></button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex flex-col items-end mr-2">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('manaPool')}</span>
               <span className="text-sm font-black text-white flex items-center gap-2"><Zap size={14} className="text-amber-500 fill-amber-500 animate-pulse" />{user.magicEnergy}</span>
            </div>
            
            <button onClick={() => user.isGuest ? setIsAuthModalOpen(true) : navigate('/profile')} className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-indigo-500/30 transition-all group">
              <Bell size={20} className="text-slate-400 group-hover:text-indigo-400 group-hover:rotate-12 transition-all" />
            </button>
            
            {!user.isGuest ? (
              <button 
                onClick={() => { setUser(GUEST_USER); navigate('/'); }} 
                className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all" 
                title={t('logout')}
              >
                <LogOut size={20} />
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)} 
                className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all" 
                title={t('login')}
              >
                <LogIn size={20} />
              </button>
            )}
          </div>
        </header>

        <main className="flex-grow p-8 md:p-12 max-w-[1700px] mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/image" element={<ImageStudio user={user} setUser={setUser} onOpenAuth={() => setIsAuthModalOpen(true)} />} />
            <Route path="/text" element={<TextStudio user={user} setUser={setUser} onOpenAuth={() => setIsAuthModalOpen(true)} />} />
            <Route path="/video" element={<VideoStudio user={user} setUser={setUser} onOpenAuth={() => setIsAuthModalOpen(true)} />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/profile" element={<ProfileSettings user={user} setUser={setUser} />} />
            <Route path="/history" element={<HistoryStudio />} />
          </Routes>
        </main>
        
        <footer className="py-12 px-10 border-t border-white/5 text-center">
           <div className="flex justify-center mb-6"><MagicLogo size="sm" showText={false} /></div>
           <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.6em] mb-2">© 2025 {t('appSubName')}. POWERED BY GEMINI PRO ENGINE.</p>
           <div className="flex justify-center gap-6 text-[9px] font-black text-slate-700 uppercase tracking-widest">
             <span className="hover:text-indigo-400 cursor-pointer transition-colors">Terms of Service</span>
             <span className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy Policy</span>
             <span className="hover:text-indigo-400 cursor-pointer transition-colors">Contact Expert</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<User>(GUEST_USER);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <HashRouter>
      <AppContent 
        user={user} 
        setUser={setUser} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isAuthModalOpen={isAuthModalOpen} 
        setIsAuthModalOpen={setIsAuthModalOpen} 
      />
    </HashRouter>
  );
};

export default App;
