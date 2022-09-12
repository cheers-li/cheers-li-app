import { supabase } from './supabase-client';

export const getFriends = async (userId?: string): Promise<Friend[]> => {
  const { data, error } = await supabase
    .from('friends')
    .select(
      'user_1 ( id, username, avatar_url ), user_2 (id, username, avatar_url)',
    )
    .or(`user_1.eq.${userId},user_2.eq.${userId}`);

  if (error) {
    console.error(error);
  }

  const friendList = data?.map((friendConnection) => {
    const other =
      friendConnection.user_1.id === userId
        ? friendConnection.user_2
        : friendConnection.user_1;

    const friend: Friend = {
      id: other.id,
      username: other.username,
      avatarUrl: other.avatar_url,
    };

    return friend;
  });

  return friendList || [];
};

export interface Friend {
  id: string;
  username: string;
  avatarUrl: string;
}
