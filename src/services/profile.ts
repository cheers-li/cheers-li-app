import dayjs from 'dayjs';
import { supabase } from './supabase-client';

export const getProfile = async (userId?: string) => {
  if (!userId || userId === 'UNKNOWN') {
    return { data: null, error: 'USER NOT LOADED YET' };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('username, avatarUrl:avatar_url')
    .eq('id', userId)
    .single();

  if (error) {
    console.error(error);
  }

  return { data, error };
};

export const createNewProfile = async (userId: string, userName: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      { id: userId, username: userName, avatar_url: getUserProfileImage() },
    ]);

  if (error) {
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
