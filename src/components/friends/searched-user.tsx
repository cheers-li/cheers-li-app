import { CheckCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState } from 'react';
import { Avatar } from '~/components/avatar';
import { SearchProfile } from '~/services/friends';

interface SearchedUserProps {
  friend: SearchProfile;
  onAdd: (friend: SearchProfile) => void;
}

enum FriendStatus {
  NEW = 'add',
  PENDING = 'added',
  ACCEPTED = 'friend',
}

const getInitialStatus = (friend: SearchProfile) => {
  if (!friend.friends.length) return FriendStatus.NEW;

  return friend.friends[0].accepted
    ? FriendStatus.ACCEPTED
    : FriendStatus.PENDING;
};

const SearchedUser = ({ friend, onAdd }: SearchedUserProps) => {
  const [status, setStatus] = useState(getInitialStatus(friend));

  const addHandler = () => {
    setStatus(FriendStatus.PENDING);
    onAdd(friend);
  };

  return (
    <li className="flex items-center justify-between border-b py-3">
      <div className="flex items-center justify-start gap-2">
        <Avatar profile={friend} size={12} />
        <div className="flex flex-col">
          <span className="text-md font-medium">{friend.username}</span>
          <span className="text-sm text-gray-500">
            Last active {friend.lastSeen}
          </span>
        </div>
      </div>
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
    </li>
  );
};

export default SearchedUser;
