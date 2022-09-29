import { supabase } from './supabase-client';
import { decode } from 'base64-arraybuffer';

export const uploadAvatar = async (fileBase64: string, fileName: string) => {
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`public/${fileName}`, decode(fileBase64.split(',')[1]), {
      cacheControl: '3600',
      upsert: false,
      contentType: fileBase64.split(';')[0].split(':')[1],
    });

  if (data) {
    const filePath = data.Key.replace('avatars/', '');
    const { publicURL } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    return { data, error, publicURL };
  }
  return { data, error };
};

export const generateSimpleKey = () => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = 5;
  for (let i = 0; i < charactersLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
