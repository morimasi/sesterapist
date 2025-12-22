
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
    <aside className="w-80 bg-surface-light border-r border-border-light flex flex-col z-10">
      {/* Search & Filter */}
      <div className="p-4 border-b border-border-light space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Materyal Kütüphanesi</h2>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">search</span>
          <input 
            className="w-full bg-background-light border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
            placeholder="Egzersiz, oyun ara..." 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-light px-2">
        <button className="flex-1 py-3 text-sm font-medium text-primary border-b-2 border-primary">Materyaller</button>
        <button className="flex-1 py-3 text-sm font-medium text-slate-500 hover:text-slate-800 border-b-2 border-transparent">Favoriler</button>
        <button className="flex-1 py-3 text-sm font-medium text-slate-500 hover:text-slate-800 border-b-2 border-transparent">Geçmiş</button>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {ASSET_LIBRARY.map((category) => (
          <div key={category.name}>
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer group"
              onClick={() => toggleCategory(category.name)}
            >
              <h3 className="text-sm font-bold text-slate-700">{category.name}</h3>
              <span className={`material-symbols-outlined text-slate-400 text-sm group-hover:text-primary transition-transform ${openCategories.includes(category.name) ? '' : 'rotate-180'}`}>
                expand_less
              </span>
            </div>
            
            {openCategories.includes(category.name) && (
              <div className="grid grid-cols-1 gap-3">
                {category.activities
                  .filter(a => a.title.toLowerCase().includes(search.toLowerCase()))
                  .map((activity) => (
                    <div 
                      key={activity.id}
                      className="group bg-white border border-border-light rounded-lg p-2 flex gap-3 cursor-grab hover:shadow-md hover:border-primary/50 transition-all select-none"
                      onClick={() => onAddActivity(activity)}
                    >
                      <div 
                        className="size-16 rounded bg-slate-100 flex-shrink-0 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${activity.image})` }}
                      ></div>
                      <div className="flex flex-col justify-center min-w-0">
                        <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{activity.title}</h4>
                        <p className="text-xs text-slate-500 truncate">{activity.category} • {activity.duration ? `${activity.duration} dk` : 'N/A'}</p>
                        <div className="flex gap-1 mt-1">
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{activity.type}</span>
                        </div>
                      </div>
                      <div className="ml-auto flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-slate-400">add_circle</span>
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
