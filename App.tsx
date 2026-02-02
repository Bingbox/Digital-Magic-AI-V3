
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  History, 
  CircleUser,
  Menu,
  Zap,
  Wand2,
  Bell,
  ChevronLeft,
  ChevronRight,
  Crown,
  ShoppingBag,
  LogOut,
  UserPlus
} from 'lucide-react';
import ImageStudio from './pages/ImageStudio';
import TextStudio from './pages/TextStudio';
import VideoStudio from './pages/VideoStudio';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import ProfileSettings from './pages/ProfileSettings';
import HistoryStudio from './pages/HistoryStudio';
import CommerceHub from './pages/CommerceHub';
import { User } from './types';
import { useLanguage } from './contexts/LanguageContext';

const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest',
  tier: 'free',
  magicEnergy: 50, 
  isGuest: true
};

const MagicLogo = ({ size = 'md', collapsed = false }: { size?: 'sm' | 'md' | 'lg', collapsed?: boolean }) => {
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
        <div className="absolute inset-[-4px] border border-dashed border-indigo-500/20 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-indigo-500/50 group-hover:animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute inset-0 bg-indigo-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="relative h-full w-full bg-[#020617] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-md group-hover:border-indigo-500/40 transition-colors">
          <div className="relative text-indigo-400 group-hover:text-white transition-all duration-500 transform group-hover:scale-110">
            <Wand2 size={config.icon} strokeWidth={1.5} className="animate-pulse" />
          </div>
        </div>
      </div>

      <div className={`flex flex-col tracking-tight overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${collapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-0'}`}>
        <span className={`${config.text} font-black leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-indigo-400 group-hover:to-cyan-400 transition-all duration-700 text-glow-sm whitespace-nowrap`}>
          {t('appName')}
        </span>
        <span className={`${config.sub} font-bold text-slate-500 uppercase tracking-[0.3em] mt-1 transition-colors group-hover:text-indigo-400 whitespace-nowrap`}>
          {t('appSubName')}
        </span>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, toggle, isCollapsed, toggleCollapse }: any) => {
  const { t } = useLanguage();
  const location = useLocation();
  
  const navItems = [
    { path: '/', name: t('dashboard'), icon: <LayoutDashboard size={18} />, color: 'text-indigo-400' },
    { path: '/image', name: t('imageMagic'), icon: <ImageIcon size={18} />, color: 'text-cyan-400' },
    { path: '/text', name: t('textMagic'), icon: <FileText size={18} />, color: 'text-emerald-400' },
    { path: '/video', name: t('videoMagic'), icon: <Video size={18} />, color: 'text-rose-400' },
    { path: '/history', name: t('historyArchive'), icon: <History size={18} />, color: 'text-amber-400' },
    { path: '/commerce', name: t('ecommerceHub'), icon: <ShoppingBag size={18} />, color: 'text-emerald-400' },
    { path: '/pricing', name: t('upgrade'), icon: <Crown size={18} />, color: 'text-yellow-400' },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={toggle} />}
      <aside className={`fixed top-0 left-0 z-50 h-screen transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isCollapsed ? 'w-20' : 'w-64'} ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} border-r border-white/5`}>
        <div className={`flex flex-col h-full bg-[#020617]/40 backdrop-blur-3xl p-4 relative group/sidebar transition-all duration-500 ${isCollapsed ? 'shadow-none' : 'shadow-[20px_0_50px_rgba(0,0,0,0.2)]'}`}>
          <button 
            onClick={toggleCollapse} 
            className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-[#020617] border border-white/10 backdrop-blur-md rounded-full items-center justify-center text-white z-20 shadow-2xl opacity-0 group-hover/sidebar:opacity-100 hover:scale-125 active:scale-90 transition-all duration-300 hover:border-indigo-500/50"
          >
            {isCollapsed ? <ChevronRight size={12} className="text-indigo-400" /> : <ChevronLeft size={12} className="text-indigo-400" />}
          </button>
          
          <div className={`mb-12 flex-shrink-0 h-12 flex items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isCollapsed ? 'justify-center' : 'px-2'}`}>
             <MagicLogo size="md" collapsed={isCollapsed} />
          </div>

          <nav className="flex-grow space-y-2 overflow-y-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`
                    relative flex items-center rounded-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group overflow-hidden
                    ${isCollapsed ? 'justify-center h-12 w-12 mx-auto p-0' : 'gap-4 px-4 py-3 w-full'} 
                    ${isActive 
                      ? `bg-indigo-600/10 ${item.color} shadow-[0_0_20px_rgba(99,102,241,0.05)]` 
                      : 'text-slate-500 hover:text-white hover:translate-x-1'}
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                  {isActive && (
                    <div className="absolute left-0 w-[3px] h-6 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)] animate-pulse" />
                  )}
                  <div className={`relative z-10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'group-hover:scale-125 group-hover:translate-y-[-2px] group-hover:text-white'}`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className={`relative z-10 text-[13px] font-bold tracking-tight uppercase truncate transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}>
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 底部独立个人信息菜单 */}
          <div className={`mt-auto pt-6 border-t border-white/5 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
             <Link 
              to="/profile" 
              className={`
                relative flex items-center rounded-xl transition-all duration-500 group overflow-hidden
                ${isCollapsed ? 'justify-center h-12 w-12 mx-auto p-0' : 'gap-4 px-4 py-3 w-full'} 
                ${location.pathname === '/profile' 
                  ? 'bg-white/5 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-white hover:translate-x-1'}
              `}
             >
                <div className={`relative z-10 transition-all duration-500 ${location.pathname === '/profile' ? 'scale-110' : 'group-hover:scale-125'}`}>
                  <CircleUser size={18} />
                </div>
                {!isCollapsed && (
                  <span className="relative z-10 text-[13px] font-bold uppercase tracking-tight truncate">
                    {t('profileInfo')}
                  </span>
                )}
             </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

// Main App Component
const App = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User>(GUEST_USER);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleLogin = () => {
    setUser({
      id: 'user_1',
      name: 'Magic Master',
      tier: 'pro',
      magicEnergy: 5000,
      isGuest: false
    });
  };

  const handleLogout = () => {
    setUser(GUEST_USER);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 selection:text-white">
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggle={toggleSidebar} 
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={toggleCollapse}
        />
        
        <main className={`transition-all duration-500 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} min-h-screen`}>
          <header className="sticky top-0 z-30 h-16 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 flex items-center justify-between">
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
               <Menu size={24} />
            </button>
            
            <div className="hidden lg:flex items-center gap-6">
               <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                  <Zap size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">{user.magicEnergy} {t('energy')}</span>
               </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
               <button className="p-2 text-slate-400 hover:text-white transition-colors relative hidden sm:block">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020617]"></span>
               </button>

               {user.isGuest ? (
                 <button 
                  onClick={handleLogin}
                  title={t('login')}
                  className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all active:scale-95 group"
                 >
                    <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                 </button>
               ) : (
                 <div className="flex items-center gap-2 pl-4 border-l border-white/10 ml-2">
                    <Link to="/profile" className="flex items-center gap-3 p-1 hover:bg-white/5 rounded-xl transition-all group">
                       <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                          <div className="w-full h-full rounded-[7px] bg-[#020617] flex items-center justify-center overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-full h-full object-cover" alt="avatar" />
                          </div>
                       </div>
                       <div className="hidden md:block">
                          <p className="text-[11px] font-black text-white leading-none uppercase">{user.name}</p>
                          <p className="text-[8px] font-bold text-slate-500 uppercase mt-1 tracking-tighter">{user.tier} level</p>
                       </div>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      title={t('logout')}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                    >
                       <LogOut size={18} />
                    </button>
                 </div>
               )}
            </div>
          </header>

          <div className="p-4 lg:p-10 max-w-[1600px] mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/image" element={<ImageStudio user={user} setUser={setUser} onOpenAuth={handleLogin} />} />
              <Route path="/text" element={<TextStudio user={user} setUser={setUser} onOpenAuth={handleLogin} />} />
              <Route path="/video" element={<VideoStudio user={user} setUser={setUser} onOpenAuth={handleLogin} />} />
              <Route path="/history" element={<HistoryStudio />} />
              <Route path="/commerce" element={<CommerceHub />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/profile" element={<ProfileSettings user={user} setUser={setUser} />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
