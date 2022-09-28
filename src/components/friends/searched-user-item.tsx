import { CheckCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState } from 'react';
import { UserItem } from '~/components/friends/user-item';
import { FriendStatus, SearchProfile } from '~/services/friends';

interface SearchedUserItemProps {
  friend: SearchProfile;
  onAdd: (friend: SearchProfile) => void;
}

const getInitialStatus = (friend: SearchProfile) => {
  if (!friend.friends.length) return FriendStatus.NEW;

  return friend.friends[0].accepted
    ? FriendStatus.ACCEPTED
    : FriendStatus.PENDING;
};

export const SearchedUserItem = ({ friend, onAdd }: SearchedUserItemProps) => {
  const [status, setStatus] = useState(getInitialStatus(friend));

  const addHandler = () => {
    setStatus(FriendStatus.PENDING);
    onAdd(friend);
  };

  return (
    <UserItem friend={friend}>
      {status === FriendStatus.ACCEPTED && (
        <div className="p-2">
          <CheckCircleIcon className="h-7 w-7 text-gray-800" />
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
                'bg-gray-200 text-gray-800': status === FriendStatus.PENDING,
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
