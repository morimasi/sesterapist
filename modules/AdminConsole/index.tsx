
import React from 'react';
import AdminPortal from '../../components/AdminPortal';
import { User, PlatformModule } from '../../types';

interface AdminConsoleProps {
  modules: PlatformModule[];
  onUpdateModules: (newModules: PlatformModule[]) => void;
  users: User[];
  onUpdateUsers: (newUsers: User[]) => void;
}

const AdminConsole: React.FC<AdminConsoleProps> = (props) => {
  return (
    <div className="flex-1 flex flex-col bg-[#020408]">
      <AdminPortal {...props} />
    </div>
  );
};

export default AdminConsole;
