import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { RefreshableList } from '~/components/list/refreshable-list';
import { SessionListItem } from '~/components/session/session-list-item';
import { listSessions, Session } from '~/services/session';
import { ElementList } from '~/types/List';

export const SessionList = () => {
  const [sessions, setSessions] = useState<ElementList<Session>>();
  const [loading, setLoading] = useState(false);

  const reloadSessions = async () => {
    setLoading(true);
    const list = await listSessions(10);
    setSessions(list);
    setLoading(false);
  };

  useEffectOnce(() => {
    reloadSessions();
  });

  return (
    <RefreshableList
      title="Sessions"
      loading={loading}
      items={sessions?.list || []}
      count={sessions?.count || 0}
      ItemComponent={SessionListItem}
      reload={reloadSessions}
    />
  );
};
