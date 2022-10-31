import { RefreshableList } from '~/components/list/refreshable-list';
import { SessionListItem } from '~/components/session/session-list-item';
import { useSessions } from '~/services/session';

export const SessionList = () => {
  const { data: sessions, refetch, isFetching } = useSessions(10);

  return (
    <RefreshableList
      title="Sessions"
      loading={isFetching}
      items={sessions?.list || []}
      count={sessions?.count || 0}
      ItemComponent={SessionListItem}
      reload={refetch}
    />
  );
};
