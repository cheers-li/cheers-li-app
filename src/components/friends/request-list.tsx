import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import clsx from 'clsx';
import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { Dialog } from '~/components/dialog';
import { UserItem } from '~/components/friends/user-item';
import {
  Profile,
  getRequests,
  acceptRequest,
  FriendStatus,
} from '~/services/friends';
import { sendSuccessFeedback } from '~/services/haptics';
import store from '~/store';
import { ElementList } from '~/types/List';
import { List } from '../list/list';

export const RequestList = () => {
  const [user] = store.useState<User>('user');
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<ElementList<Profile>>();
  const [sentRequests, setSentRequests] = useState<ElementList<Profile>>();
  const [sentRequestDialog, setSentRequestDialog] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    const req = await getRequests(user.id);
    if (req) {
      setRequests(req);
    }
    setLoading(false);
  };

  const loadSentRequests = async () => {
    const req = await getRequests(user.id, true);
    if (req) {
      setSentRequests(req);
    }
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

  const displaySentRequestDialog = async () => {
    await loadSentRequests();
    setSentRequestDialog(true);
  };

  return (
    <>
      <List
        title="Friend Requests"
        titleContent={
          <button
            onClick={displaySentRequestDialog}
            className="flex items-center"
          >
            Sent
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </button>
        }
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
      <Dialog
        isShowing={sentRequestDialog}
        closeModal={() => setSentRequestDialog(false)}
      >
        <List
          title="Sent Requests"
          loading={loading}
          items={sentRequests?.list || []}
          count={sentRequests?.count || 0}
          ItemComponent={({ item }) => (
            <UserItem item={item}>
              <span className="text-gray-80 rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold uppercase">
                {FriendStatus.REQUESTED}
              </span>
            </UserItem>
          )}
        />
      </Dialog>
    </>
  );
};
