
import React from 'react';
import { Activity } from '../types';

interface SidebarRightProps {
  activity?: Activity;
  onUpdate: (activity: Activity) => void;
  onRemove: () => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ activity, onUpdate, onRemove }) => {
  if (!activity) {
    return (
      <aside className="w-80 bg-surface-light border-l border-border-light flex flex-col z-10 items-center justify-center p-6 text-center text-slate-400">
        <span className="material-symbols-outlined text-5xl mb-4">touch_app</span>
        <p className="text-sm">Ayarları yapılandırmak için akıştan bir aktivite seçin.</p>
      </aside>
    );
  }

  const handleDurationChange = (val: number) => {
    onUpdate({ ...activity, duration: val });
  };

  const handleSettingsChange = (field: string, val: any) => {
    onUpdate({
      ...activity,
      settings: {
        ...(activity.settings || { targetSoundPosition: 'Karışık', difficulty: 'Orta', notes: '' }),
        [field]: val
      }
    });
  };

  return (
    <aside className="w-80 bg-surface-light border-l border-border-light flex flex-col z-10 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="size-10 rounded-lg bg-indigo-100 flex-shrink-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${activity.image})` }}
          ></div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">{activity.title}</h2>
            <span className="text-xs text-slate-500">Ayarlar</span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Süre (dk)</label>
            <div className="flex items-center gap-4">
              <input 
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" 
                max="30" 
                min="1" 
                type="range" 
                value={activity.duration}
                onChange={(e) => handleDurationChange(parseInt(e.target.value))}
              />
              <span className="text-sm font-bold w-12 text-right">{activity.duration}dk</span>
            </div>
          </div>

          <hr className="border-border-light" />

          {/* Configuration */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Oyun Yapılandırması</label>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Hedef Ses Konumu</label>
                <select 
                  className="w-full bg-background-light border border-border-light rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={activity.settings?.targetSoundPosition}
                  onChange={(e) => handleSettingsChange('targetSoundPosition', e.target.value)}
                >
                  <option>Başlangıç (örn. Araba)</option>
                  <option>Orta (örn. Havuç)</option>
                  <option>Son (örn. Kar)</option>
                  <option>Karışık</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Zorluk Seviyesi</label>
                <div className="flex bg-background-light rounded-lg p-1 border border-border-light">
                  {['Kolay', 'Orta', 'Zor'].map((level) => (
                    <button 
                      key={level}
                      onClick={() => handleSettingsChange('difficulty', level)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${activity.settings?.difficulty === level ? 'bg-white shadow-sm text-primary border border-border-light' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-border-light" />

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Terapist Notları</label>
            <textarea 
              className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-slate-700 focus:ring-1 focus:ring-yellow-400 outline-none resize-none" 
              placeholder="Bu aktivite için özel notlar ekleyin..." 
              rows={4}
              value={activity.settings?.notes}
              onChange={(e) => handleSettingsChange('notes', e.target.value)}
            />
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-8 pt-6 border-t border-border-light">
          <button 
            onClick={onRemove}
            className="w-full py-2.5 text-sm font-medium text-slate-600 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Seans Akışından Kaldır
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarRight;
