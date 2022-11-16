import { XMarkIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import { UserItem } from '~/components/friends/user-item';
import { RefreshableList } from '~/components/list/refreshable-list';
import { useFriends, Profile, removeFriendShip } from '~/services/friends';
import { sendSuccessFeedback } from '~/services/haptics';
import store from '~/store';

export const FriendList = () => {
  const [user] = store.useState<User>('user');
  const { data: friends, isFetching, refetch } = useFriends(user.id);

  const removeFriend = async (friend: Profile) => {
    const confirmation = confirm(
      `Are you sure you want to remove ${friend.username} from your friends?`,
    );
    if (!confirmation) return;
    const data = await removeFriendShip(friend.id, user.id);
    if (data) {
      sendSuccessFeedback();
      refetch();
    }
  };

  return (
    <RefreshableList
      title="Friends"
      loading={isFetching}
      items={friends?.list || []}
      count={friends?.count || 0}
      hasSpacer={true}
      ItemComponent={({ item }) => (
        <UserItem item={item}>
          <button onClick={() => removeFriend(item)} className="-mr-2 p-2">
            <span className="rounded-full text-xs font-semibold uppercase text-gray-800 dark:text-neutral-300">
              <XMarkIcon className="h-4 w-4" />
            </span>
          </button>
        </UserItem>
      )}
      reload={refetch}
    />
  );
};
