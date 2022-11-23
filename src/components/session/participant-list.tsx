import { FC, useCallback } from 'react';
import { Button } from '~/components/button';
import { ParticipantInvite } from '~/components/session/participant-invite';
import {
  acceptInvitationByHost,
  askToJoin,
  Participant,
  useParticipants,
} from '~/services/participants';
import store from '~/store';
import { User } from '@supabase/supabase-js';
import { Avatar } from '~/components/avatar';
import { Link } from 'react-router-dom';

interface ParticipantListProps {
  isSessionOwner: boolean;
  sessionId: string;
}

enum ParticipationRequestStatus {
  NONE,
  REQUESTED,
  RECEIVED,
  ACCEPTED,
}

export const ParticipantList: FC<ParticipantListProps> = ({
  isSessionOwner,
  sessionId,
}) => {
  const [user] = store.useState<User>('user');
  const { data: participants, refetch } = useParticipants(
    sessionId,
    user.id,
    true,
  );

  const sendParticipationRequest = async (
    sessionToJoin: string,
    profileId: string,
  ) => {
    await askToJoin(sessionToJoin, profileId);
    refetch();
  };

  const accept = async () => {
    const req = participants?.list.find((p) => p.profile.id === user.id);
    if (req) {
      await acceptInvitationByHost(req.id);
      refetch();
    }
  };

  const participationRequestStatus = useCallback(() => {
    const req = participants?.list.find((p) => p.profile.id === user.id);
    if (!req) {
      return ParticipationRequestStatus.NONE;
    }
    if (req.acceptedByParticipant && !req.acceptedByHost) {
      return ParticipationRequestStatus.REQUESTED;
    }
    if (!req.acceptedByParticipant && req.acceptedByHost) {
      return ParticipationRequestStatus.RECEIVED;
    }
    return ParticipationRequestStatus.ACCEPTED;
  }, [participants]);

  const request = useCallback(() => {
    return participants?.list.find((p) => p.profile.id === user.id);
  }, [participants]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-medium">Participants</h2>
      {participants &&
        (participants.count === 0 ||
          participants.list.filter(
            (p) => p.acceptedByHost && p.acceptedByParticipant,
          ).length === 0) && (
          <div className="rounded-2xl bg-gray-100 py-3 text-center text-sm text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
            <div className="font-semibold">Participants</div>
            <div>There are no participants yet</div>
          </div>
        )}

      {participants && (
        <div className="flex w-full max-w-full gap-2 overflow-x-auto">
          {participants.list
            .filter((p) => p.acceptedByHost && p.acceptedByParticipant)
            .map((participant: Participant) => (
              <Link
                key={participant.id}
                className="flex-shrink-0"
                to={`/profiles/${participant.profile.id}`}
              >
                <Avatar profile={participant.profile} size={20} />
              </Link>
            ))}
        </div>
      )}

      {isSessionOwner && (
        <ParticipantInvite sessionId={sessionId} refetchList={refetch} />
      )}
      {!isSessionOwner &&
        participationRequestStatus() === ParticipationRequestStatus.NONE && (
          <Button
            primary
            onClick={() => sendParticipationRequest(sessionId, user.id)}
          >
            Ask to join
          </Button>
        )}
      {!isSessionOwner &&
        request() &&
        participationRequestStatus() ===
          ParticipationRequestStatus.RECEIVED && (
          <Button primary onClick={() => accept()}>
            Accept Invitation
          </Button>
        )}
      {!isSessionOwner &&
        participationRequestStatus() ===
          ParticipationRequestStatus.REQUESTED && (
          <p className="text-sm text-gray-500">
            You requested to join, we are awaiting a response from the host.
          </p>
        )}
    </div>
  );
};
