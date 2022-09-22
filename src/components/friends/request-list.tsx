import { User } from '@supabase/supabase-js';
import clsx from 'clsx';
import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { UserItem } from '~/components/friends/user-item';
import { getStoredUser } from '~/services/auth';
import { Profile, getRequests, acceptRequest } from '~/services/friends';
import { sendSuccessFeedback } from '~/services/haptics';

export const RequestList = () => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<Profile[]>([]);

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
      setRequests((old) => old.filter((r) => r.id !== friend.id));
    }
  };

  return (
    <>
      <h2 className="text-gray-800">Requests ({requests?.length || 0})</h2>
      <ul>
        {requests.map((friend: Profile, i: number) => (
          <UserItem friend={friend} key={i}>
            <button onClick={() => acceptHandler(friend)} className="p-2">
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
        ))}
      </ul>
      {!loading && requests.length === 0 && (
        <div className="mt-6 space-y-2 rounded-2xl bg-gray-100 py-3 px-8 text-center text-sm text-gray-600">
          <div className="font-semibold">No pending requests</div>
          <div>You don{"'"}t have any pending requests</div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-start gap-2 py-3 px-8 text-sm text-gray-500">
          We are loading your requests.
        </div>
      )}
    </>
  );
};
