import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import clsx from 'clsx';
import { useState } from 'react';
import { UserItem } from '~/components/friends/user-item';
import {
  FriendStatus,
  getFriendStatus,
  SearchProfile,
} from '~/services/friends';
import store from '~/store';

interface SearchedUserItemProps {
  item: SearchProfile;
  onAdd: (friend: SearchProfile) => void;
}

export const SearchedUserItem = ({
  item: friend,
  onAdd,
}: SearchedUserItemProps) => {
  const [user] = store.useState<User>('user');
  const [status, setStatus] = useState(
    getFriendStatus(friend.friends, user.id),
  );

  const addHandler = () => {
    setStatus(FriendStatus.REQUESTED);
    onAdd(friend);
  };

  return (
    <UserItem item={friend}>
      {status === FriendStatus.ACCEPTED && (
        <div className="p-2">
          <CheckCircleIcon className="h-7 w-7 text-gray-800 dark:text-neutral-400" />
        </div>
      )}
      {status !== FriendStatus.ACCEPTED && (
        <button
          onClick={addHandler}
          className="p-2"
          disabled={status != FriendStatus.NEW}
        >
          <span
            className={clsx(
              'rounded-full px-2 py-1 text-xs font-semibold uppercase',
              {
                'bg-sky-200 text-sky-900 active:bg-sky-300':
                  status === FriendStatus.NEW,
                'bg-gray-200 text-gray-800 dark:bg-neutral-300 dark:text-neutral-900':
                  status === FriendStatus.REQUESTED ||
                  status === FriendStatus.CONFIRM,
              },
            )}
          >
            {status}
          </span>
        </button>
      )}
    </UserItem>
  );
};
