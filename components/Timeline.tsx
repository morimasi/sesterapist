
import React from 'react';
import { Activity } from '../types';

interface TimelineProps {
  sessionFlow: Activity[];
  selectedId: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ sessionFlow, selectedId, onSelect, onRemove, onClearAll }) => {
  const totalDuration = sessionFlow.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <main className="flex-1 bg-background-light relative flex flex-col min-w-0">
      {/* Canvas Header */}
      <div className="h-14 flex items-center justify-between px-8 border-b border-border-light bg-background-light/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-700">Seans Akışı</h2>
          <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{sessionFlow.length} Öğe</span>
          <span className="ml-2 text-xs text-slate-500">~ {totalDuration} dk toplam</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors" title="Geri Al">
            <span className="material-symbols-outlined text-[20px]">undo</span>
          </button>
          <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors" title="İleri Al">
            <span className="material-symbols-outlined text-[20px]">redo</span>
          </button>
          <div className="h-4 w-px bg-slate-300 mx-1"></div>
          <button onClick={onClearAll} className="text-xs font-medium text-primary hover:underline">Tümünü Temizle</button>
        </div>
      </div>

      {/* Scrollable Timeline Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        {/* Timeline Line Visual */}
        <div className="absolute left-[59px] top-8 bottom-8 w-0.5 bg-slate-200 -z-0"></div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {sessionFlow.map((activity, index) => {
            const isSelected = activity.id === selectedId;
            return (
              <div key={activity.id} className="relative flex gap-6 group">
                {/* Sequence Number */}
                <div className="flex-shrink-0 z-10">
                  <div className={`size-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-background-light transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {index + 1}
                  </div>
                </div>

                {/* Card */}
                <div 
                  className={`flex-1 bg-surface-light rounded-xl p-4 shadow-sm transition-all cursor-pointer ring-2 ${isSelected ? 'ring-primary border-2 border-primary' : 'ring-transparent border border-border-light hover:ring-primary/20 hover:shadow-lg'}`}
                  onClick={() => onSelect(activity.id)}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 p-2 bg-primary/10 rounded-bl-xl">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wide px-1">Seçili</span>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div 
                      className="size-20 rounded-lg bg-slate-100 flex-shrink-0 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${activity.image})` }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-slate-800">{activity.title}</h3>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-1">{activity.description}</p>
                        </div>
                        <div className={`flex items-center gap-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onRemove(activity.id); }}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-primary cursor-grab">
                            <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                          <span className="material-symbols-outlined text-[14px]">timer</span>
                          {activity.duration} dk
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded ${activity.type === 'Egzersiz' ? 'bg-green-50 text-green-700' : 'bg-indigo-50 text-indigo-700'}`}>
                          <span className="material-symbols-outlined text-[14px]">{activity.type === 'Egzersiz' ? 'spa' : 'videogame_asset'}</span>
                          {activity.category}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Drop Target */}
          <div className="relative flex gap-6">
            <div className="flex-shrink-0 z-10">
              <div className="size-8 rounded-full border-2 border-dashed border-slate-300 bg-transparent flex items-center justify-center font-bold text-sm ring-4 ring-background-light">
                <span className="material-symbols-outlined text-slate-300 text-sm">add</span>
              </div>
            </div>
            <div className="flex-1 h-24 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 gap-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-copy">
              <span className="material-symbols-outlined">add_circle_outline</span>
              <span className="text-sm font-medium">Sıradaki aktiviteyi buraya sürükleyin</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Timeline;
