import { useAsync } from 'react-use';
import { UserItem } from '~/components/friends/user-item';
import { getStoredUser } from '~/services/auth';
import { Profile, getFriends } from '~/services/friends';

export const FriendList = () => {
  const friends = useAsync(async () => {
    const user = await getStoredUser();
    return getFriends(user?.id);
  });

  return (
    <ul>
      {friends.value?.map((friend: Profile, i: number) => (
        <UserItem key={i} friend={friend} />
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
