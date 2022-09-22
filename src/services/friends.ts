import { getLastActive } from '~/helper/time';
import { supabase } from './supabase-client';

export const getFriends = async (userId?: string): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('friends')
    .select(
      'user_1 (id, username, avatar_url, active_at), user_2 (id, username, avatar_url, active_at)',
    )
    .eq('accepted', true)
    .or(`user_1.eq.${userId},user_2.eq.${userId}`);

  if (error) {
    console.trace();
    console.error(error);
  }

  const friendList = data?.map((friendConnection) => {
    const other =
      friendConnection.user_1.id === userId
        ? friendConnection.user_2
        : friendConnection.user_1;

    const friend: Profile = {
      id: other.id,
      username: other.username,
      avatarUrl: other.avatar_url,
      activeAt: other.active_at,
      lastSeen: getLastActive(other.active_at),
    };

    return friend;
  });

  return friendList || [];
};

export const searchUsers = async (
  userId: string,
  username: string,
): Promise<SearchProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id, username, avatarUrl:avatar_url, activeAt:active_at, friends!friends_user_2_fkey(user_1,user_2,accepted)',
    )
    // .eq('user_1', userId)
    .ilike('username', `%${username}%`);
  // .eq(`user_1.eq.${userId},user_2.username.eq.${username}`);

  if (error) {
    console.trace();
    console.error(error);
  }

  return (
    data?.map((friend) => ({
      ...friend,
      lastSeen: getLastActive(friend.activeAt),
    })) || []
  );
};

export const addFriend = async (userId: string, friendId: string) => {
  const { data, error } = await supabase
    .from('friends')
    .insert([{ user_1: userId, user_2: friendId }]);

  if (error) {
    console.trace();
    console.error(error);
  }

  return data;
};

export interface Profile {
  id: string;
  username: string;
  avatarUrl: string;
  activeAt?: string;
  lastSeen?: string;
}

export interface Friend {
  user_1: string;
  user_2: string;
  accepted: boolean;
}

export interface SearchProfile extends Profile {
  friends: Friend[];
}
