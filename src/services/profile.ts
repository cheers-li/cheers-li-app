import dayjs from 'dayjs';
import {
  FriendStatus,
  getFriendStatus,
  SearchProfile,
} from '~/services/friends';
import { supabase } from './supabase-client';

export const getProfile = async (userId?: string) => {
  if (!userId) {
    return { data: null, error: 'USER NOT LOADED YET' };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('username, avatarUrl:avatar_url')
    .eq('id', userId)
    .single();

  if (error) {
    console.trace();
    console.error(error);
  }

  return { data, error };
};

export const getCompleteProfile = async (
  searchProfileId?: string,
  loggedUserId?: string,
): Promise<{ data: CompleteProfile | null; error?: string }> => {
  if (!loggedUserId || !searchProfileId) {
    return { data: null, error: 'Profile not found' };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(
      `id, username, bio, avatarUrl:avatar_url,
      friends!friends_user_2_fkey(user_1,user_2,accepted),
      friendsToo:friends!friends_user_1_fkey(user_1,user_2,accepted)
      `,
    )
    .eq('id', searchProfileId)
    .single();

  if (error) {
    console.trace();
    console.error(error);
  }

  const completeProfile: CompleteProfile = {
    ...data,
    friends: [...data.friends, ...data.friendsToo],
  };

  completeProfile.status = getFriendStatus(
    completeProfile.friends,
    loggedUserId,
  );

  return {
    data: completeProfile,
    error: error?.message,
  };
};

export const createNewProfile = async (userId: string, userName: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      { id: userId, username: userName, avatar_url: getUserProfileImage() },
    ]);

  if (error) {
    console.trace();
    console.error(error);
  }

  return { data, error };
};

export const setLastActive = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .update([{ active_at: dayjs() }])
    .eq('id', userId);

  if (error) {
    console.trace();
    console.error(error);
  }

  return { data, error };
};

const getUserProfileImage = () => {
  const user = supabase.auth.user();

  if (user?.app_metadata.provider === 'google') {
    return user.user_metadata.avatar_url;
  }
};

interface CompleteProfile extends SearchProfile {
  id: string;
  bio: string;
  status: FriendStatus;
}
