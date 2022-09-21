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

export interface Profile {
  id: string;
  username: string;
  avatarUrl: string;
  activeAt?: string;
  lastSeen?: string;
}
