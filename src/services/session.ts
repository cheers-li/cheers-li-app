import { supabase } from './supabase-client';

export const createNewSession = async (name: string, userId: string) => {
  console.log(name);
  const { error } = await supabase
    .from('sessions')
    .insert({ name: name, user_id: userId });

  if (error) {
    console.error(error);
  }

  return { error };
};
