
import React from 'react';
import SessionRoom from '../../components/SessionRoom';
import { SessionMetadata } from '../../types';

interface LiveSessionProps {
  session: SessionMetadata | null;
  onEndSession: () => void;
}

const LiveSession: React.FC<LiveSessionProps> = ({ session, onEndSession }) => {
  return (
    <div className="flex-1 flex flex-col bg-[#020408]">
      <SessionRoom session={session} onEndSession={onEndSession} />
    </div>
  );
};

export default LiveSession;
