import dayjs from 'dayjs';
import { Profile } from '~/services/friends';
import {
  FriendStatus,
  getFriendStatus,
  SearchProfile,
} from '~/services/friends';
import { supabase } from '~/services/supabase-client';

export const getProfile = async (userId?: string) => {
  if (!userId) {
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
      `id, username, bio, city, avatarUrl:avatar_url,
      friends!friends_user_2_fkey(user_1,user_2,accepted, accepted_at),
      friendsToo:friends!friends_user_1_fkey(user_1,user_2,accepted, accepted_at)
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

  if (data && data.length > 0) {
    const updatedProfile = {
      username: data[0].username,
      bio: data[0].bio,
      city: data[0].city,
      avatarUrl: data[0].avatar_url,
    };

    return { updatedProfile, error };
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

export interface CompleteProfile extends SearchProfile {
  id: string;
  bio: string;
  city: string;
  status: FriendStatus;
}

export const deleteUser = async (userId: string): Promise<boolean> => {
  const baseUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
  const anon = import.meta.env.VITE_SUPABASE_KEY;

  const response = await fetch(`${baseUrl}/delete-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${anon}`,
    },
    body: JSON.stringify({
      user_id: userId,
    }),
  });

  return response.ok;
};
