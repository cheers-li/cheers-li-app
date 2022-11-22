import { supabase } from '~/services/supabase-client';
import { decode } from 'base64-arraybuffer';
import { useQuery } from 'react-query';
import { Profile } from '~/services/friends';

export interface Reaction {
  id: string;
  profile: Profile;
  createdAt: string;
  sessionId: string;
  imageUrl: string;
}

export const uploadReaction = async (
  sessionId: string,
  fileBase64: string,
  profileId: string,
) => {
  const { data, error } = await supabase.storage
    .from('reactions')
    .upload(
      `public/${sessionId}_${profileId}_${Date.now()}.jpeg`,
      decode(fileBase64),
      {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg',
      },
    );

  if (error || !data) {
    return { data, error };
  }

  const filePath = data.Key.replace(`/reactions`, '');
  const { publicURL } = supabase.storage
    .from('reactions')
    .getPublicUrl(filePath);

  if (publicURL) {
    return await saveReaction(sessionId, profileId, publicURL);
  }
};

export const useSessionReactions = (id: string) => {
  return useQuery(['session-reactions', id], () => getSessionReactions(id));
};

const getSessionReactions = async (id: string): Promise<Reaction[]> => {
  const { data, error } = await supabase
    .from('session_reactions')
    .select(
      'id, created_at, profile:profile_id(id, username), session_id, image_url',
    )
    .match({ session_id: id });

  if (!data || error) {
    throw error;
  }

  return data.map((item) => ({
    id: item.id,
    profile: {
      id: item.profile.id,
      username: item.profile.username,
    },
    createdAt: item.created_at,
    sessionId: item.session_id,
    imageUrl: item.image_url,
  }));
};

const saveReaction = async (
  sessionId: string,
  profileId: string,
  publicURL: string,
) => {
  const { data, error } = await supabase.from('session_reactions').insert({
    session_id: sessionId,
    profile_id: profileId,
    image_url: publicURL.replace('reactions/reactions', 'reactions'), // HACK: To make the public url work
  });

  if (error) {
    console.trace();
    console.error(error);
  }

  return { data, error };
};
