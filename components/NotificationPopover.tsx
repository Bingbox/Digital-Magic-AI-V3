
import React from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Info, 
  Sparkles, 
  Zap, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Notification } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const NotificationPopover = ({ isOpen, onClose, notifications, onMarkRead, onMarkAllRead }: Props) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'feature': return <Sparkles size={16} className="text-cyan-400" />;
      case 'update': return <Zap size={16} className="text-amber-400" />;
      case 'alert': return <AlertCircle size={16} className="text-rose-400" />;
      default: return <Info size={16} className="text-indigo-400" />;
    }
  };

  const getBadge = (type: Notification['type']) => {
    switch (type) {
      case 'feature': return t('notifFeature');
      case 'update': return t('notifUpdate');
      case 'alert': return t('notifAlert');
      default: return t('notifSystem');
    }
  };

  return (
    <div className="fixed inset-0 z-[400] lg:absolute lg:inset-auto lg:top-16 lg:right-8 lg:w-96 animate-in fade-in slide-in-from-top-2 duration-300" onClick={onClose}>
      <div 
        className="w-full h-full lg:h-auto lg:max-h-[600px] bg-[#020617] border border-white/10 lg:rounded-2xl flex flex-col shadow-2xl overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-indigo-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-tight">{t('notifications')}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onMarkAllRead}
              className="p-2 text-slate-500 hover:text-indigo-400 transition-colors"
              title={t('markAllRead')}
            >
              <CheckCheck size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar py-2">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={`group p-5 hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0 relative cursor-pointer ${!n.read ? 'bg-indigo-500/[0.02]' : ''}`}
                onClick={() => onMarkRead(n.id)}
              >
                {!n.read && (
                  <div className="absolute top-6 left-2 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                )}
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                      {getIcon(n.type)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${n.type === 'alert' ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                         {getBadge(n.type)}
                       </span>
                       <span className="text-[9px] font-bold text-slate-600 flex items-center gap-1">
                         <Clock size={10} />
                         {n.timestamp}
                       </span>
                    </div>
                    <h4 className={`text-xs font-black tracking-tight leading-snug transition-colors ${!n.read ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                      {n.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {n.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-700">
               <Bell size={48} className="opacity-10 mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('noNotifications')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopover;
