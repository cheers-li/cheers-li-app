import { useAsync } from 'react-use';
import { Profile, getFriends } from '~/services/friends';
import { getUserId } from '~/services/profile';
import { Avatar } from './avatar';

export const FriendList = () => {
  const friends = useAsync(() => getFriends(getUserId()));

  return (
    <ul className="border-t">
      {friends.value?.map((friend: Profile, i: number) => (
        <li key={i}>
          <a
            href={`/profile/${friend.id}`}
            className="flex items-center justify-start gap-2 border-b py-3 px-8"
          >
            <Avatar profile={friend} size={12} />
            <div className="flex flex-col">
              <span className="text-md font-medium">{friend.username}</span>
              <span className="text-sm text-gray-500">
                Last active {friend.lastSeen}
              </span>
            </div>
          </a>
        </li>
      ))}

      {friends.value?.length === 0 && (
        <li className="flex items-center justify-start gap-2 border-b py-3 px-8 text-sm text-gray-500">
          It appears that you have no friends
        </li>
      )}

      {friends.loading && (
        <li className="flex items-center justify-start gap-2 border-b py-3 px-8 text-sm text-gray-500">
          We are loading your friends.
        </li>
      )}
    </ul>
  );
};
