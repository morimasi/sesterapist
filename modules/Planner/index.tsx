
import React, { useState } from 'react';
import SidebarLeft from '../../components/SidebarLeft';
import Timeline from '../../components/Timeline';
import SidebarRight from '../../components/SidebarRight';
import { Activity, User } from '../../types';

interface PlannerProps {
  sessionFlow: Activity[];
  setSessionFlow: (flow: Activity[]) => void;
  users: User[];
  onLaunchSession: (client: User) => void;
}

const Planner: React.FC<PlannerProps> = ({ sessionFlow, setSessionFlow, users, onLaunchSession }) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");

  const handleAddActivity = (activity: Activity) => {
    const id = `s-${Date.now()}`;
    setSessionFlow([...sessionFlow, { ...activity, id }]);
    setSelectedActivityId(id);
  };

  const handleUpdateActivity = (updated: Activity) => {
    setSessionFlow(sessionFlow.map(a => a.id === updated.id ? updated : a));
  };

  const handleRemoveActivity = (id: string) => {
    setSessionFlow(sessionFlow.filter(a => a.id !== id));
    if (selectedActivityId === id) setSelectedActivityId("");
  };

  return (
    <div className="flex flex-1 flex-col md:flex-row overflow-hidden animate-in fade-in duration-500 bg-slate-50 dark:bg-[#05070A]">
      <SidebarLeft onAddActivity={handleAddActivity} />
      <Timeline 
        sessionFlow={sessionFlow} 
        selectedId={selectedActivityId} 
        onSelect={setSelectedActivityId} 
        onRemove={handleRemoveActivity} 
        onClearAll={() => setSessionFlow([])} 
        users={users}
        onLaunchSession={onLaunchSession}
      />
      <SidebarRight 
        activity={sessionFlow.find(a => a.id === selectedActivityId)} 
        onUpdate={handleUpdateActivity} 
        onRemove={() => handleRemoveActivity(selectedActivityId)} 
      />
    </div>
  );
};

export default Planner;
