import { ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import clsx from 'clsx';
import { useState } from 'react';
import { Dialog } from '~/components/dialog';
import { UserItem } from '~/components/friends/user-item';
import { RefreshableList } from '~/components/list/refreshable-list';
import { List } from '~/components/list/list';
import {
  Profile,
  useRequests,
  acceptRequest,
  FriendStatus,
  removeFriendShip,
} from '~/services/friends';
import { sendSuccessFeedback } from '~/services/haptics';
import store from '~/store';

export const RequestList = () => {
  const [user] = store.useState<User>('user');
  const {
    data: requests,
    isFetching: isFetchingRequests,
    refetch: refetchRequests,
  } = useRequests(user.id, false, true);
  const {
    data: sentRequests,
    isFetching: isFetchingSentRequests,
    refetch: refetchSentRequests,
  } = useRequests(user.id, true);
  const [sentRequestDialog, setSentRequestDialog] = useState(false);

  const acceptHandler = async (friend: Profile) => {
    if (!user) return;

    const res = await acceptRequest(friend.id, user?.id);
    if (res) {
      sendSuccessFeedback();
      refetchRequests();
    }
  };

  const removeRequest = async (friend: Profile, sent = false) => {
    const confirmation = confirm(
      `Are you sure you want to cancel the friend's request ${
        sent ? 'to' : 'from'
      } ${friend.username}?`,
    );
    if (!confirmation) return;
    const data = await removeFriendShip(friend.id, user.id);
    if (data) {
      sendSuccessFeedback();

      if (sent) {
        refetchSentRequests();
      } else {
        refetchRequests();
      }
    }
  };

  const displaySentRequestDialog = async () => {
    sendSuccessFeedback();
    setSentRequestDialog(true);
  };

  return (
    <>
      <RefreshableList
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
        loading={isFetchingRequests}
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
            <button onClick={() => removeRequest(item)} className="-mr-2 p-2">
              <span className="text-gray-80 rounded-full text-xs font-semibold uppercase">
                <XMarkIcon className="h-4 w-4" />
              </span>
            </button>
          </UserItem>
        )}
        reload={refetchRequests}
      />
      <Dialog
        isShowing={sentRequestDialog}
        closeModal={() => setSentRequestDialog(false)}
        padding="py-4"
      >
        <List
          title="Sent Requests"
          loading={isFetchingSentRequests}
          items={sentRequests?.list || []}
          count={sentRequests?.count || 0}
          horizontalPadding="px-4"
          ItemComponent={({ item }) => (
            <UserItem item={item} horizontalPadding="px-4">
              <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold uppercase text-gray-800 dark:bg-neutral-300 dark:text-neutral-900">
                {FriendStatus.REQUESTED}
              </span>
              <button
                onClick={() => removeRequest(item, true)}
                className="-mr-2 p-2"
              >
                <span className="rounded-full text-xs font-semibold uppercase text-gray-800 dark:text-neutral-300">
                  <XMarkIcon className="h-4 w-4" />
                </span>
              </button>
            </UserItem>
          )}
        />
      </Dialog>
    </>
  );
};
