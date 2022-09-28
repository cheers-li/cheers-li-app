import { User } from '@supabase/supabase-js';
import clsx from 'clsx';
import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { UserItem } from '~/components/friends/user-item';
import { getStoredUser } from '~/services/auth';
import { Profile, getRequests, acceptRequest } from '~/services/friends';
import { sendSuccessFeedback } from '~/services/haptics';
import { ElementList } from '~/types/List';
import { List } from '../list/list';

export const RequestList = () => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<ElementList<Profile>>();

  const loadRequests = async () => {
    setLoading(true);
    const storedUser = await getStoredUser();
    if (!storedUser) {
      setLoading(false);
      return;
    }
    setUser(storedUser);
    const req = await getRequests(storedUser.id);
    if (req) {
      setRequests(req);
    }
    setLoading(false);
  };

  useEffectOnce(() => {
    loadRequests();
  });

  const acceptHandler = async (friend: Profile) => {
    if (!user) return;

    const res = await acceptRequest(friend.id, user?.id);
    if (res) {
      sendSuccessFeedback();
      setRequests({
        list: requests?.list.filter((r) => r.id !== friend.id) || [],
        count: requests?.count || 0,
      });
    }
  };

  return (
    <List
      title="Friend Requests"
      loading={loading}
      items={requests?.list || []}
      count={requests?.count || 0}
      ItemComponent={({ item }) => (
        <UserItem item={item}>
          <button onClick={() => acceptHandler(item)} className="p-2">
            <span
              className={clsx(
                'rounded-full bg-sky-200 px-2 py-1 text-xs font-semibold uppercase text-sky-900 active:bg-sky-300',
                {},
              )}
            >
              Accept
            </span>
          </button>
        </UserItem>
      )}
    />
  );
};
