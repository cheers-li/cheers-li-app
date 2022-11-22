import dayjs from 'dayjs';
import { useEffect } from 'react';
import { getLastActive } from '~/helper/time';
import store from '~/store';
import { ElementList, ListItem } from '~/types/List';
import { Profile } from '~/services/friends';
import { supabase } from '~/services/supabase-client';
import { useQuery } from 'react-query';

const listSessions = async (
  onlyActives = false,
): Promise<ElementList<Session>> => {
  let query = supabase
    .from('sessions')
    .select(
      'id, name, created_at, ended_at, location, location_name, image_url, session_tag, user:user_id (id, username, avatarUrl:avatar_url)',
      { count: 'exact' },
    )
    .gt('ended_at', dayjs().add(-1, 'days'))
    .order('ended_at', { ascending: false });

  if (onlyActives) query = query.gte('ended_at', dayjs());

  const { data, error, count } = await query;

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
      sessionTag: item.session_tag,
      lastActive: getLastActive(item.created_at),
      hasEnded: dayjs().isAfter(dayjs(item.ended_at)),
      locationName: item.location_name,
      imageUrl: item.image_url,
    };

    return newSession;
  });

  return { list: sessions || [], count };
};

export const useSessions = (onlyActives = false) => {
  return useQuery(['sessions', onlyActives], () => listSessions(onlyActives));
};

export const createNewSession = async (
  name: string,
  tagId: number,
  userId: string,
  sessionStartTime: dayjs.Dayjs,
  location?: Location,
  locationName?: string,
) => {
  const { data, error } = await supabase.from('sessions').insert({
    name: name,
    session_tag: tagId,
    user_id: userId,
    ended_at: sessionStartTime.add(2, 'hours'),
    location: location,
    location_name: locationName,
    created_at: sessionStartTime,
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

const getSession = async (id: string): Promise<Session> => {
  const { data, error } = await supabase
    .from('sessions')
    .select(
      'id, name, created_at, ended_at, location, location_name, image_url, session_tag, user:user_id (id, username, avatarUrl:avatar_url, devices(device_token))',
    )
    .eq('id', id)
    .single();

  if (error) {
    console.trace();
    console.error(error);
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    endedAt: data.ended_at,
    user: data.user,
    location: data.location,
    sessionTag: data.session_tag,
    lastActive: getLastActive(data.created_at),
    hasEnded: dayjs().isAfter(dayjs(data.ended_at)),
    locationName: data.location_name,
    imageUrl: data.image_url,
  };
};

export const useSession = (id: string) => {
  return useQuery(['session', id], () => getSession(id));
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

    setTags(data.sort((a, b) => a.id - b.id));
  };

  useEffect(() => {
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return tags;
};

export interface Session extends ListItem {
  id: string;
  name: string;
  createdAt: string;
  endedAt: string;
  user: Profile;
  lastActive: string;
  sessionTag: number;
  location?: Location;
  hasEnded?: boolean;
  isYourSession?: boolean;
  locationName?: string;
  imageUrl?: string;
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
