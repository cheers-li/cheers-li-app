import { Capacitor } from '@capacitor/core';
import { supabase } from '~/services/supabase-client';

export const getDevices = async (userId?: string) => {
  const { data, error } = await supabase
    .from('devices')
    .select('id, created_at, android, ios, device_token')
    .eq('profile_id', userId);

  if (error) {
    console.trace();
    console.error(error);
  }

  return { data, error };
};

export const addNewDevices = async (userId: string, deviceToken: string) => {
  const platform = Capacitor.getPlatform();

  const { data, error } = await supabase.from('devices').insert([
    {
      profile_id: userId,
      device_token: deviceToken,
      android: platform === 'android',
      ios: platform === 'ios',
    },
  ]);

  if (error) {
    console.trace();
    console.error(error);
  }

  return { data, error };
};
