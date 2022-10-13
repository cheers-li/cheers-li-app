import { useAsync } from 'react-use';
import { listSessions } from '~/services/session';
import { List } from '../list/list';
import { SessionListItem } from './session-list-item';

export const SessionList = () => {
  const sessions = useAsync(() => listSessions(10));

  return (
    <div>
      <List
        title="Sessions"
        loading={sessions.loading}
        items={sessions.value?.list || []}
        count={sessions.value?.count || 0}
        ItemComponent={SessionListItem}
      />
    </div>
  );
};
