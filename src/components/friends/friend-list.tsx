import { XMarkIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { UserItem } from '~/components/friends/user-item';
import { getFriends, Profile, removeFriendShip } from '~/services/friends';
import { sendSuccessFeedback } from '~/services/haptics';
import store from '~/store';
import { ElementList } from '~/types/List';
import { List } from '../list/list';

export const FriendList = () => {
  const [user] = store.useState<User>('user');
  const [friends, setFriends] = useState<ElementList<Profile>>();
  const [loading, setLoading] = useState(false);

  const loadFriends = async () => {
    setLoading(true);
    const res = await getFriends(user.id);
    if (res) {
      setFriends(res);
    }
    setLoading(false);
  };

  useEffectOnce(() => {
    loadFriends();
  });

  const removeFriend = async (friend: Profile) => {
    const data = await removeFriendShip(friend.id, user.id);
    if (data) {
      sendSuccessFeedback();
      loadFriends();
    }
  };

  return (
    <>
      <List
        title="Friends"
        loading={loading}
        items={friends?.list || []}
        count={friends?.count || 0}
        ItemComponent={({ item }) => (
          <UserItem item={item}>
            <button onClick={() => removeFriend(item)} className="-mr-2 p-2">
              <span className="rounded-full text-xs font-semibold uppercase text-gray-800 dark:text-neutral-300">
                <XMarkIcon className="h-4 w-4" />
              </span>
            </button>
          </UserItem>
        )}
      />
    </>
  );
};
