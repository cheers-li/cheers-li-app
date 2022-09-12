import { useAsync } from 'react-use';
import { Friend, getFriends } from '~/services/friends';
import { getUserId } from '~/services/profile';

export const FriendList = () => {
  const friends = useAsync(async () => {
    return getFriends(getUserId());
  });

  return (
    <div>
      <ul>
        {friends.value?.map((friend: Friend, i: number) => (
          <li key={i} className="flex items-center justify-start gap-2 py-2">
            {friend.avatarUrl ? (
              <img
                src={friend.avatarUrl}
                alt={friend.username}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-800 text-3xl font-extralight text-white">
                {friend.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-md font-medium">{friend.username}</span>
              <span className="text-sm text-gray-500">Last Active 8h ago</span>
            </div>
          </li>
        ))}

        {friends.value?.length === 0 && (
          <li>It appears that you have no friends</li>
        )}

        {friends.loading && (
          <li className="text-sm text-gray-500">
            We are loading your friends.
          </li>
        )}
      </ul>
    </div>
  );
};
