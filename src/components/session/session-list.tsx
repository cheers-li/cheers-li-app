import { useEffect, useState } from 'react';
import { listSessions, Session } from '~/services/session';
import { ElementList } from '~/types/List';
import { AnimatedList } from '../list/animated-list';
import { SessionListItem } from './session-list-item';

export const SessionList = () => {
  const [sessions, setSessions] = useState<ElementList<Session>>();
  const [loading, setLoading] = useState(false);

  const reloadSessions = async () => {
    setLoading(true);
    const list = await listSessions(10);
    setSessions(list);
    setLoading(false);
  };

  useEffect(() => {
    reloadSessions();
  }, []);

  return (
    <div>
      <AnimatedList
        title="Sessions"
        loading={loading}
        items={sessions?.list || []}
        count={sessions?.count || 0}
        ItemComponent={SessionListItem}
        reload={reloadSessions}
      />
    </div>
  );
};
