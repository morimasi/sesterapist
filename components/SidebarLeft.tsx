
import React, { useState } from 'react';
import { ASSET_LIBRARY } from '../constants';
import { Activity } from '../types';

interface SidebarLeftProps {
  onAddActivity: (activity: Activity) => void;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ onAddActivity }) => {
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>(ASSET_LIBRARY.map(c => c.name));

  const toggleCategory = (name: string) => {
    setOpenCategories(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-96 bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm">
      {/* Search & Filter */}
      <div className="p-8 border-b border-slate-50 space-y-6">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Klinik Materyaller</h2>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">manage_search</span>
          <input 
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:border-primary outline-none transition-all shadow-inner placeholder:text-slate-400" 
            placeholder="Protokol veya ses ara..." 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-slate-50/30">
        {ASSET_LIBRARY.map((category) => (
          <div key={category.name} className="space-y-4">
            <div 
              className="flex items-center justify-between px-2 cursor-pointer group"
              onClick={() => toggleCategory(category.name)}
            >
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{category.name}</h3>
              <span className={`material-symbols-outlined text-slate-400 text-lg group-hover:text-primary transition-transform ${openCategories.includes(category.name) ? '' : 'rotate-180'}`}>
                keyboard_arrow_up
              </span>
            </div>
            
            {openCategories.includes(category.name) && (
              <div className="grid grid-cols-1 gap-4">
                {category.activities
                  .filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()))
                  .map((activity) => (
                    <div 
                      key={activity.id}
                      className="group bg-white border-2 border-transparent rounded-[32px] p-4 flex gap-5 cursor-pointer hover:shadow-xl hover:border-primary/20 transition-all select-none relative overflow-hidden"
                      onClick={() => onAddActivity(activity)}
                    >
                      <div 
                        className="size-20 rounded-[24px] flex-shrink-0 bg-cover bg-center shadow-lg group-hover:scale-105 transition-transform" 
                        style={{ backgroundImage: `url(${activity.image})` }}
                      ></div>
                      <div className="flex flex-col justify-center min-w-0 pr-4">
                        <h4 className="text-sm font-black text-slate-900 italic uppercase leading-tight truncate group-hover:text-primary transition-colors">{activity.title}</h4>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-[8px] bg-primary/5 text-primary px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border border-primary/10">{activity.type}</span>
                           <span className="text-[9px] text-slate-400 font-bold uppercase">{activity.duration} DK</span>
                        </div>
                      </div>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <span className="material-symbols-outlined text-primary font-black">add_circle</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarLeft;
