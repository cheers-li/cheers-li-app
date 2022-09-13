import dayjs from 'dayjs';
import { getLastActive } from '~/helper/time';
import store from '~/store';
import { Profile } from './friends';
import { supabase } from './supabase-client';

export const listSessions = async (
  userId: string,
  top = 2,
): Promise<Session[]> => {
  const { data, error } = await supabase
    .from('sessions')
    .select(
      'id, name, created_at, ended_at, user:user_id (id, username, avatar_url)',
    )
    .order('ended_at', { ascending: false })
    .range(0, top)
    .eq('user_id', userId);

  if (error) {
    console.error(error);
  }
  const sessions = data?.map((item) => {
    const newSession: Session = {
      id: item.id,
      name: item.name,
      createdAt: item.created_at,
      endedAt: item.ended_at,
      user: item.user,
      lastActive: getLastActive(item.created_at),
    };

    return newSession;
  });

  return sessions || [];
};

export const createNewSession = async (name: string, userId: string) => {
  const { data, error } = await supabase.from('sessions').insert({
    name: name,
    user_id: userId,
    ended_at: dayjs().add(2, 'hours'),
  });

  if (error) {
    console.error(error);
  }

  const id = data && data[0]?.id;

  return { data, id, error };
};

export const getSession = async (id: string): Promise<Session> => {
  const { data, error } = await supabase
    .from('sessions')
    .select(
      'id, name, created_at, ended_at, user:user_id (id, username, avatar_url)',
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    endedAt: data.ended_at,
    user: data.user,
    lastActive: getLastActive(data.created_at),
  };
};

export const endSession = async (id: string) => {
  const { error } = await supabase
    .from('sessions')
    .update({ ended_at: dayjs() })
    .match({ id });

  if (error) {
    console.error(error);
  }
};

export const hasEnded = (endedAt?: string) => dayjs().isAfter(dayjs(endedAt));

export const useSessionTags = () => {
  const [tags, setTags] = store.useState<Tag[]>('sessionTags');

  const loadTags = async () => {
    if (tags.length) return;

    const { data, error } = await supabase
      .from('session_tags')
      .select('name, emoji')
      .order('name', { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setTags(data);
  };

  return { tags, loadTags };
};

export interface Session {
  id: string;
  name: string;
  createdAt: string;
  endedAt: string;
  user: Profile;
  lastActive: string;
}

export interface Tag {
  id: number;
  name: string;
  emoji: string;
}
