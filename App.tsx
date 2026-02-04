
import React, { useState, useEffect } from 'react';
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
import AuthModal from './components/AuthModal';
import NotificationPopover from './components/NotificationPopover';
import { User, Notification } from './types';
import { useLanguage } from './contexts/LanguageContext';

const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest',
  tier: 'free',
  magicEnergy: 50, 
  isGuest: true
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: '欢迎来到数字魔法 V2',
    description: '全新升级的施法界面，更强大的渲染引擎 Veo 3.1 现已上线。',
    type: 'system',
    timestamp: '2小时前',
    read: false
  },
  {
    id: '2',
    title: '新功能：批量施法队列',
    description: '现在您可以一次性生成多组图片素材，大幅提升商业创作效率。',
    type: 'feature',
    timestamp: '5小时前',
    read: false
  },
  {
    id: '3',
    title: '能量补给提醒',
    description: '检测到您的魔法能量较低，建议前往充能站进行补给。',
    type: 'alert',
    timestamp: '昨天',
    read: true
  }
];

const MagicLogo = ({ size = 'md', collapsed = false }: { size?: 'sm' | 'md' | 'lg', collapsed?: boolean }) => {
  const { t } = useLanguage();
  
  const sizeClasses = {
    sm: { container: 'gap-2', box: 'w-9 h-9', icon: 18, text: 'text-base', sub: 'text-[8px]' },
    md: { container: 'gap-3', box: 'w-11 h-11', icon: 22, text: 'text-lg', sub: 'text-[8px]' },
    lg: { container: 'gap-4', box: 'w-14 h-14', icon: 28, text: 'text-2xl', sub: 'text-[10px]' },
  };
  const config = sizeClasses[size];

  return (
    <div className={`flex items-center ${collapsed ? 'justify-center' : config.container} group relative cursor-pointer w-full`}>
      <div className={`relative ${config.box} flex-shrink-0 flex items-center justify-center transition-all duration-700`}>
        {/* 外层能量环 - 逆时针旋转 */}
        <div className="absolute inset-[-4px] border-[1px] border-dashed border-cyan-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse] group-hover:border-cyan-400 group-hover:animate-[spin_4s_linear_infinite_reverse]"></div>
        
        {/* 内层能量环 - 顺时针旋转 */}
        <div className="absolute inset-[-8px] border-[1px] border-indigo-500/10 rounded-full animate-[spin_20s_linear_infinite] group-hover:border-indigo-500/40 group-hover:animate-[spin_6s_linear_infinite]"></div>
        
        {/* 核心光晕 */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-cyan-400/20 rounded-xl blur-lg opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all duration-1000"></div>
        
        {/* Logo 容器 */}
        <div className="relative h-full w-full bg-[#03081a] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(79,70,229,0.2)] backdrop-blur-xl group-hover:border-cyan-500/50 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-500">
          {/* 数字背景扫描效果 */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>
          
          <div className="relative text-cyan-400 group-hover:text-white transition-all duration-500 transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
            <Wand2 size={config.icon} strokeWidth={1.5} className="animate-pulse" />
          </div>
        </div>
      </div>

      <div className={`flex flex-col tracking-tight overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${collapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[160px] opacity-100 ml-3'}`}>
        <span className={`${config.text} font-black leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-indigo-400 group-hover:from-cyan-300 group-hover:via-white group-hover:to-emerald-400 transition-all duration-700 whitespace-nowrap drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
          {t('appName')}
        </span>
        <span className={`${config.sub} font-black text-slate-500 uppercase tracking-[0.3em] mt-1.5 transition-colors group-hover:text-cyan-500/80 whitespace-nowrap`}>
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
      <aside className={`fixed top-0 left-0 z-50 h-screen transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isCollapsed ? 'w-16' : 'w-52'} ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} border-r border-white/5`}>
        <div className={`flex flex-col h-full bg-[#020617]/40 backdrop-blur-3xl p-3 relative group/sidebar transition-all duration-500 ${isCollapsed ? 'shadow-none' : 'shadow-[15px_0_40px_rgba(0,0,0,0.15)]'}`}>
          
          {/* 切换按钮 */}
          <button 
            onClick={toggleCollapse} 
            className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-[#0f172a] border border-white/10 backdrop-blur-md rounded-full items-center justify-center text-white z-[60] shadow-2xl opacity-100 hover:scale-125 active:scale-90 transition-all duration-300 hover:border-indigo-500/50 group-hover/sidebar:opacity-100"
          >
            {isCollapsed ? <ChevronRight size={12} className="text-indigo-400" /> : <ChevronLeft size={12} className="text-indigo-400" />}
          </button>
          
          <div className={`mb-10 mt-3 flex-shrink-0 h-12 flex items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden ${isCollapsed ? 'justify-center' : 'px-1'}`}>
             <MagicLogo size="md" collapsed={isCollapsed} />
          </div>

          <nav className="flex-grow space-y-1.5 overflow-y-auto overflow-x-hidden no-scrollbar">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`
                    relative flex items-center rounded-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group overflow-hidden
                    ${isCollapsed ? 'justify-center h-10 w-10 mx-auto p-0' : 'gap-3 px-3.5 py-2.5 w-full'} 
                    ${isActive 
                      ? `bg-indigo-600/10 ${item.color} shadow-[0_0_15px_rgba(99,102,241,0.04)]` 
                      : 'text-slate-500 hover:text-white hover:translate-x-1'}
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                  {isActive && (
                    <div className="absolute left-0 w-[2.5px] h-5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)] animate-pulse" />
                  )}
                  <div className={`relative z-10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'group-hover:scale-110 group-hover:translate-y-[-1px] group-hover:text-white'}`}>
                    {React.cloneElement(item.icon as React.ReactElement, { size: isCollapsed ? 20 : 18 })}
                  </div>
                  {!isCollapsed && (
                    <span className={`relative z-10 text-[14px] font-bold tracking-tight uppercase truncate transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}>
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className={`mt-auto pt-4 border-t border-white/5 overflow-hidden ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
             <Link 
              to="/profile" 
              className={`
                relative flex items-center rounded-xl transition-all duration-500 group overflow-hidden
                ${isCollapsed ? 'justify-center h-10 w-10 mx-auto p-0' : 'gap-3 px-3.5 py-2.5 w-full'} 
                ${location.pathname === '/profile' 
                  ? 'bg-white/5 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-white hover:translate-x-1'}
              `}
             >
                <div className={`relative z-10 transition-all duration-500 ${location.pathname === '/profile' ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <CircleUser size={isCollapsed ? 20 : 18} />
                </div>
                {!isCollapsed && (
                  <span className="relative z-10 text-[14px] font-bold uppercase tracking-tight truncate">
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

const App = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User>(GUEST_USER);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const savedSession = localStorage.getItem('magic_session');
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
    const savedNotifs = localStorage.getItem('magic_notifications');
    if (savedNotifs) {
      setNotifications(JSON.parse(savedNotifs));
    }
  }, []);

  useEffect(() => {
    if (!user.isGuest) {
      localStorage.setItem('magic_session', JSON.stringify(user));
      const storedUsers = JSON.parse(localStorage.getItem('magic_users') || '[]');
      const updatedUsers = storedUsers.map((u: any) => 
        u.id === user.id ? { ...u, ...user } : u
      );
      localStorage.setItem('magic_users', JSON.stringify(updatedUsers));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('magic_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('magic_session');
    setUser(GUEST_USER);
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 selection:text-white">
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onLoginSuccess={handleLoginSuccess} 
        />

        <NotificationPopover 
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
          notifications={notifications}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
        />
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggle={toggleSidebar} 
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={toggleCollapse}
        />
        
        <main className={`transition-all duration-500 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-52'} min-h-screen`}>
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
               <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={`p-2 transition-all relative ${isNotifOpen ? 'text-white bg-white/5 rounded-xl' : 'text-slate-400 hover:text-white'}`}
               >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-[9px] font-black text-white flex items-center justify-center rounded-full border-2 border-[#020617]">
                      {unreadCount}
                    </span>
                  )}
               </button>

               {user.isGuest ? (
                 <button 
                  onClick={() => setIsAuthOpen(true)}
                  title={t('login')}
                  className="p-2.5 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/10 hover:border-indigo-500/50 transition-all flex items-center justify-center active:scale-95"
                 >
                    <UserPlus size={20} />
                 </button>
               ) : (
                 <div className="flex items-center gap-2 pl-4 border-l border-white/10 ml-2">
                    <Link to="/profile" className="flex items-center gap-3 p-1 hover:bg-white/5 rounded-xl transition-all group">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20">
                          <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center overflow-hidden">
                             <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-full h-full object-cover" alt="avatar" />
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
              <Route path="/image" element={<ImageStudio user={user} setUser={setUser} onOpenAuth={() => setIsAuthOpen(true)} />} />
              <Route path="/text" element={<TextStudio user={user} setUser={setUser} onOpenAuth={() => setIsAuthOpen(true)} />} />
              <Route path="/video" element={<VideoStudio user={user} setUser={setUser} onOpenAuth={() => setIsAuthOpen(true)} />} />
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
