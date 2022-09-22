import dayjs from 'dayjs';
import { useEffect } from 'react';
import { getLastActive } from '~/helper/time';
import store from '~/store';
import { getStoredUser } from './auth';
import { Profile } from './friends';
import { setLastActive } from './profile';
import { supabase } from './supabase-client';

export const listSessions = async (top = 2): Promise<Session[]> => {
  const { data, error } = await supabase
    .from('sessions')
    .select(
      'id, name, created_at, ended_at, location, location_name, user:user_id (id, username, avatarUrl:avatar_url)',
    )
    .order('ended_at', { ascending: false })
    .range(0, top);

  if (error) {
    console.trace();
    console.error(error);
  }
  const sessions = data?.map((item) => {
    const newSession: Session = {
      id: item.id,
      name: item.name,
      createdAt: item.created_at,
      endedAt: item.ended_at,
      user: item.user,
      location: item.location,
      lastActive: getLastActive(item.created_at),
      hasEnded: dayjs().isAfter(dayjs(item.ended_at)),
      locationName: item.location_name,
    };

    return newSession;
  });

  return sessions || [];
};

export const createNewSession = async (
  name: string,
  tagId: number,
  location?: Location,
  locationName?: string,
) => {
  const user = await getStoredUser();
  const { data, error } = await supabase.from('sessions').insert({
    name: name,
    session_tag: tagId,
    user_id: user?.id,
    ended_at: dayjs().add(2, 'hours'),
    location: location,
    location_name: locationName,
  });

  if (error) {
    console.trace();
    console.error(error);
  }

  const id = data && data[0]?.id;

  return { data, id, error };
};

export const updateSession = async (id: string, newName: string) => {
  const { data, error } = await supabase
    .from('sessions')
    .update({
      name: newName,
    })
    .match({ id: id });

  if (error) {
    console.trace();
    console.error(error);
  }

  return { data, error };
};

export const getSession = async (id: string): Promise<Session> => {
  const { data, error } = await supabase
    .from('sessions')
    .select(
      'id, name, created_at, ended_at, location, location_name, user:user_id (id, username, avatar_url, devices(device_token))',
    )
    .eq('id', id)
    .single();

  if (error) {
    console.trace();
    console.error(error);
  }

  const user = await getStoredUser();
  if (user) {
    await setLastActive(user.id);
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    endedAt: data.ended_at,
    user: data.user,
    location: data.location,
    lastActive: getLastActive(data.created_at),
    hasEnded: dayjs().isAfter(dayjs(data.ended_at)),
    locationName: data.location_name,
  };
};

export const endSession = async (id: string) => {
  const { error } = await supabase
    .from('sessions')
    .update({ ended_at: dayjs() })
    .match({ id });

  if (error) {
    console.trace();
    console.error(error);
  }
};

export const useSessionTags = () => {
  const [tags, setTags] = store.useState<Tag[]>('sessionTags');

  const loadTags = async () => {
    if (tags.length) return;

    const { data, error } = await supabase
      .from('session_tags')
      .select('id, name, emoji, type')
      .order('name', { ascending: true });

    if (error) {
      console.trace();
      console.error(error);
      return;
    }

    setTags(data);
  };

  useEffect(() => {
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return tags;
};

export interface Session {
  id: string;
  name: string;
  createdAt: string;
  endedAt: string;
  user: Profile;
  lastActive: string;
  location?: Location;
  hasEnded?: boolean;
  isYourSession?: boolean;
  locationName?: string;
}

export interface Location {
  coordinates: number[];
  type: string;
}

export interface Tag {
  id: number;
  name: string;
  emoji: string;
  type: string;
}
