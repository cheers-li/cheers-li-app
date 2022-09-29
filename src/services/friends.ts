import { getLastActive } from '~/helper/time';
import { ElementList } from '~/types/List';
import { supabase } from './supabase-client';

export const getFriends = async (
  userId?: string,
): Promise<ElementList<Profile>> => {
  const { data, error, count } = await supabase
    .from('friends')
    .select(
      'user_1 (id, username, avatar_url, active_at), user_2 (id, username, avatar_url, active_at)',
      { count: 'exact' },
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

  return { list: friendList || [], count };
};

export const searchUsers = async (
  username: string,
  userId?: string,
): Promise<SearchProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      id, username, avatarUrl:avatar_url, activeAt:active_at, 
      friends!friends_user_2_fkey(user_1,user_2,accepted),
      friendsToo:friends!friends_user_1_fkey(user_1,user_2,accepted)
      `,
    )
    .neq('id', userId)
    .ilike('username', `%${username}%`);

  if (error) {
    console.trace();
    console.error(error);
  }

  return (
    data?.map((friend) => ({
      ...friend,
      friends: [...friend.friends, ...friend.friendsToo],
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

export const getRequests = async (
  userId?: string,
): Promise<ElementList<Profile>> => {
  const { data, error, count } = await supabase
    .from('friends')
    .select('user_1 (id, username, avatar_url, active_at), user_2', {
      count: 'exact',
    })
    .eq('accepted', false)
    .eq('user_2', userId);

  if (error) {
    console.trace();
    console.error(error);
  }

  const requests = data?.map((row) => {
    return {
      id: row.user_1.id,
      username: row.user_1.username,
      avatarUrl: row.user_1.avatar_url,
      activeAt: row.user_1.active_at,
      lastSeen: getLastActive(row.user_1.active_at),
    } as Profile;
  });

  return { list: requests || [], count };
};

export const acceptRequest = async (requestor: string, acceptor: string) => {
  const { data, error } = await supabase
    .from('friends')
    .update({ accepted: true })
    .eq('user_1', requestor)
    .eq('user_2', acceptor);

  if (error) {
    console.trace();
    console.error(error);
  }

  return data;
};

export interface Profile {
  id: string;
  username: string;
  avatarUrl?: string;
  city?: string;
  bio?: string;
  activeAt?: string;
  lastSeen?: string;
  devices?: Device[];
}

export interface Device {
  id: string;
  device_token: string;
}

export interface Friend {
  user_1: string;
  user_2: string;
  accepted: boolean;
}

export interface SearchProfile extends Profile {
  friends: Friend[];
}
