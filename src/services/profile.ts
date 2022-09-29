import dayjs from 'dayjs';
import { Profile } from './friends';
import { supabase } from './supabase-client';

export const getProfile = async (userId?: string) => {
  if (!userId || userId === 'UNKNOWN') {
    return { data: null, error: 'USER NOT LOADED YET' };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatarUrl:avatar_url, bio, city')
    .eq('id', userId)
    .single();

  if (error) {
    console.trace();
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
    console.trace();
    console.error(error);
  }

  return { data, error };
};

export const updateProfile = async (profile: Profile) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      username: profile.username,
      bio: profile.bio,
      city: profile.city,
      avatar_url: profile.avatarUrl,
    })
    .eq('id', profile.id);

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
