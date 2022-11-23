import { useQuery } from 'react-query';
import { getFriends, Profile } from '~/services/friends';
import { supabase } from '~/services/supabase-client';
import { ElementList } from '~/types/List';

export const inviteFriend = async (sessionId: string, profileId: string) => {
  const { data, error } = await supabase.from('session_participants').insert([
    {
      session_id: sessionId,
      profile_id: profileId,
      accepted_by_host: true,
    },
  ]);

  if (error) {
    console.trace();
    console.error(error);
  }

  return data;
};

export const askToJoin = async (sessionId: string, profileId: string) => {
  const { data, error } = await supabase.from('session_participants').insert([
    {
      session_id: sessionId,
      profile_id: profileId,
      accepted_by_participant: true,
    },
  ]);

  if (error) {
    console.trace();
    console.error(error);
  }

  return data;
};

export const acceptInvitationByHost = async (participationId: string) => {
  const { data, error } = await supabase
    .from('session_participants')
    .update([
      {
        accepted_by_participant: true,
      },
    ])
    .match({ id: participationId });

  if (error) {
    console.trace();
    console.error(error);
  }

  return data;
};

export const acceptRequestByFriend = async (
  sessionId: string,
  profileId: string,
) => {
  const { data, error } = await supabase
    .from('session_participants')
    .update([
      {
        accepted_by_host: true,
      },
    ])
    .match({ session_id: sessionId, profile_id: profileId });

  if (error) {
    console.trace();
    console.error(error);
  }

  return data;
};

const getExistingParticipants = async (sessionId: string) => {
  const { data, error, count } = await supabase
    .from('session_participants')
    .select(
      'id, requested_at, session_id, profile:profile_id(id, avatarUrl:avatar_url, username), accepted_by_host, accepted_by_participant, joined_at',
    )
    .match({ session_id: sessionId });

  if (error) {
    console.trace();
    console.error(error);
  }

  return { data, error, count };
};

const getParticipants = async (
  sessionId: string,
  userId: string,
  showAcceptedOnly: boolean,
): Promise<ElementList<Participant>> => {
  const { data: participants } = await getExistingParticipants(sessionId);

  if (!participants) {
    return { list: [], count: 0 };
  }

  if (showAcceptedOnly) {
    const list = participants.map((p) => ({
      id: p.id,
      sessionId: p.session_id,
      profile: p.profile,
      acceptedByHost: p.accepted_by_host,
      acceptedByParticipant: p.accepted_by_participant,
    }));
    return { list, count: list.length };
  }

  const { list: friends } = await getFriends(userId);

  const participantList = friends.map((friend) => ({
    id: friend.id,
    sessionId: sessionId,
    profile: friend,
    acceptedByHost: participants?.some(
      (p) => p.profile.id === friend.id && p.accepted_by_host,
    ),
    acceptedByParticipant: participants?.some(
      (p) => p.profile.id === friend.id && p.accepted_by_participant,
    ),
  }));

  return { list: participantList, count: participantList.length };
};

export const useParticipants = (
  sessionId: string,
  userId: string,
  showAcceptedOnly = false,
) => {
  return useQuery(['participants', sessionId, showAcceptedOnly], () =>
    getParticipants(sessionId, userId, showAcceptedOnly),
  );
};

export interface Participant {
  id: string;
  sessionId: string;
  profile: Profile;
  acceptedByHost?: boolean;
  acceptedByParticipant?: boolean;
}
