import { useAsync } from 'react-use';
import { UserItem } from '~/components/friends/user-item';
import { getStoredUser } from '~/services/auth';
import { getFriends } from '~/services/friends';
import { List } from '../list/list';

export const FriendList = () => {
  const friends = useAsync(async () => {
    const user = await getStoredUser();
    return getFriends(user?.id);
  });

  return (
    <>
      <List
        title="Friends"
        loading={friends.loading}
        items={friends.value?.list || []}
        count={friends.value?.count || 0}
        ItemComponent={UserItem}
      />
    </>
  );
};
