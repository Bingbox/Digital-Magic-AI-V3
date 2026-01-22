
import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Calendar,
  Download,
  Share2,
  Eye,
  Trash2,
  ExternalLink,
  ChevronDown,
  X,
  MoreVertical,
  Layers
} from 'lucide-react';

interface MagicWork {
  id: string;
  title: string;
  type: 'image' | 'text' | 'video';
  date: string;
  previewUrl: string;
  tags: string[];
  size?: string;
}

const MOCK_WORKS: MagicWork[] = [
  { id: '1', title: '极简咖啡机海报', type: 'image', date: '2025-05-12', previewUrl: 'https://images.unsplash.com/photo-1544787210-2213d44ad53e?w=400&q=80', tags: ['E-commerce', 'Minimalist'], size: '2.4 MB' },
  { id: '2', title: '智能手表营销脚本', type: 'text', date: '2025-05-12', previewUrl: 'https://images.unsplash.com/photo-1508685096489-7aac291ba597?w=400&q=80', tags: ['Social Media', 'Marketing'] },
  { id: '3', title: '猫咪乐园宣传片', type: 'video', date: '2025-05-11', previewUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80', tags: ['Ads', 'Veo 3.1'], size: '15.8 MB' },
  { id: '4', title: '节日促销主图', type: 'image', date: '2025-05-10', previewUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80', tags: ['Sales', 'Holiday'], size: '1.9 MB' },
  { id: '5', title: '全屋软装AI预览', type: 'image', date: '2025-05-09', previewUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', tags: ['Interior', 'Realism'], size: '3.1 MB' },
  { id: '6', title: '户外运动剪辑', type: 'video', date: '2025-05-08', previewUrl: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?w=400&q=80', tags: ['Action', 'Sports'], size: '42.0 MB' },
  { id: '7', title: '新品发布会直播脚本', type: 'text', date: '2025-05-07', previewUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80', tags: ['Live', 'Script'] },
];

const HistoryStudio = () => {
  const [filterType, setFilterType] = useState<'all' | 'image' | 'text' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWork, setSelectedWork] = useState<MagicWork | null>(null);

  const filteredWorks = useMemo(() => {
    return MOCK_WORKS.filter(work => {
      const matchType = filterType === 'all' || work.type === filterType;
      const matchSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          work.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchType && matchSearch;
    });
  }, [filterType, searchQuery]);

  const typeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon size={14} className="text-indigo-400" />;
      case 'text': return <FileText size={14} className="text-orange-400" />;
      case 'video': return <Video size={14} className="text-rose-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <History size={24} className="text-indigo-400" />
            </div>
            魔法档案
          </h1>
          <p className="text-slate-500 mt-2 font-medium">管理您在魔法阵中创造的所有作品</p>
        </div>
        
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition-all">
             <Layers size={16} />
             批量导出
           </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="搜索作品名称..." 
            className="w-full bg-[#0f172a]/60 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all backdrop-blur-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex bg-[#0f172a]/60 border border-slate-800 rounded-xl p-1 gap-1 backdrop-blur-xl">
          {['all', 'image', 'text', 'video'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t as any)}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${filterType === t ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {t === 'all' ? '全部' : t === 'image' ? '图片' : t === 'text' ? '文案' : '视频'}
            </button>
          ))}
        </div>
      </div>

      {/* Works Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredWorks.map((work) => (
          <div key={work.id} className="group flex flex-col bg-slate-900/40 border border-slate-800/60 rounded-xl overflow-hidden hover:border-indigo-500/40 transition-all duration-300">
            <div className="aspect-[4/3] relative overflow-hidden bg-slate-950">
              <img src={work.previewUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" alt={work.title} />
              
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/5">
                {typeIcon(work.type)}
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{work.type}</span>
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => setSelectedWork(work)} className="p-3 bg-white text-black rounded-xl hover:bg-indigo-500 hover:text-white transition-all"><Eye size={20} /></button>
                <button className="p-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all"><Download size={20} /></button>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors truncate">{work.title}</h3>
              <div className="flex flex-wrap gap-1.5">
                {work.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-800 rounded-md text-[9px] font-bold text-slate-500 uppercase tracking-wider">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedWork && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedWork(null)} className="absolute top-6 right-6 p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all z-10"><X size={20} /></button>
            <div className="flex flex-col lg:flex-row h-full max-h-[85vh]">
              <div className="flex-grow bg-black flex items-center justify-center p-8 overflow-hidden">
                {selectedWork.type === 'image' && <img src={selectedWork.previewUrl} className="max-w-full max-h-full object-contain rounded-xl" alt="preview" />}
                {selectedWork.type === 'video' && <video controls className="relative max-w-full max-h-full rounded-xl shadow-2xl shadow-black" autoPlay src="https://www.w3schools.com/html/mov_bbb.mp4" />}
                {selectedWork.type === 'text' && (
                  <div className="w-full h-full p-8 overflow-y-auto bg-slate-950/50 rounded-xl border border-slate-800">
                    <article className="prose prose-invert prose-indigo max-w-none text-slate-300">
                      <h2 className="text-white">{selectedWork.title}</h2>
                      <p>内容存档预览...</p>
                    </article>
                  </div>
                )}
              </div>
              <div className="w-full lg:w-96 p-8 border-l border-slate-800 flex flex-col gap-8 bg-slate-900/50">
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-white leading-tight">{selectedWork.title}</h2>
                  <p className="text-sm text-slate-500">创建于 {selectedWork.date}</p>
                </div>
                <div className="mt-auto space-y-3">
                   <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3">
                     <Download size={18} />下载资源
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryStudio;
