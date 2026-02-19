
import React from 'react';
import MaterialLibrary from '../../components/MaterialLibrary';
import { Activity } from '../../types';

interface ContentStudioProps {
  onAddActivity: (activity: Activity) => void;
}

const ContentStudio: React.FC<ContentStudioProps> = ({ onAddActivity }) => {
  // Gelecekte buraya "Taslaklar", "Favoriler" veya "AI Geçmişi" gibi alt bileşenler eklenebilir.
  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120]">
      <MaterialLibrary onAdd={onAddActivity} />
    </div>
  );
};

export default ContentStudio;
