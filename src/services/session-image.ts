import { decode } from 'base64-arraybuffer';
import { supabase } from '~/services/supabase-client';

export const uploadSessionImage = async (
  sessionId: string,
  fileBase64: string,
) => {
  const { data, error } = await supabase.storage
    .from('sessions')
    .upload(`public/${sessionId}_${Date.now()}.jpeg`, decode(fileBase64), {
      cacheControl: '3600',
      upsert: false,
      contentType: 'image/jpeg',
    });

  if (error || !data) {
    return { data, error };
  }

  const filePath = data.Key.replace(`/sessions`, '');
  const { publicURL } = supabase.storage
    .from('sessions')
    .getPublicUrl(filePath);

  if (publicURL) {
    return await updateSessionImage(sessionId, publicURL);
  }
};

export const updateSessionImage = async (id: string, publicURL: string) => {
  const { data, error } = await supabase
    .from('sessions')
    .update({
      image_url: publicURL.replace('sessions/sessions', 'sessions'), // HACK: To make the public url work
    })
    .match({ id: id });

  if (error) {
    console.trace();
    console.error(error);
  }

  return { data, error };
};
