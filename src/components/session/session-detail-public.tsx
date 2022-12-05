import { FC, useState } from 'react';
import { Session } from '~/services/session';
import { Button } from '~/components/button';
import { SessionReactionList } from '~/components/reaction/session-reaction-list';
import { Profile } from '~/services/friends';
import dayjs from 'dayjs';
import { sendCheersli } from '~/services/cheersli';
import { ParticipantList } from '~/components/session/participant-list';

interface SessionDetailPublicProps {
  session: Session;
  profile: Profile;
}

export const SessionDetailPublic: FC<SessionDetailPublicProps> = ({
  session,
  profile,
}) => {
  const [loadCheersli, setLoadCheersli] = useState(false);
  const [sentCheersli, setSentCheersli] = useState(false);

  const cheersli = async () => {
    setLoadCheersli(true);
    const devices = session?.user?.devices?.map(
      (device) => device.device_token,
    );

    await sendCheersli(profile, devices || []);
    setSentCheersli(true);
    setLoadCheersli(false);
  };

  const hasStarted =
    !session.hasEnded && dayjs().isAfter(dayjs(session.createdAt));

  return (
    <>
      {hasStarted && (
        <>
          <p className="text-sm text-gray-500">
            {session.user.username} has started a new session. It will end
            automatically at {dayjs(session.endedAt).format('HH:mm')}.
          </p>
          <Button
            primary
            onClick={cheersli}
            disabled={sentCheersli || loadCheersli}
          >
            {sentCheersli ? 'Sent Cheersli' : 'Send Cheersli 🍻'}
          </Button>
        </>
      )}
      {!hasStarted && (
        <p className="text-sm text-gray-500">
          {session.user.username} has planned a new session. It will start today
          at {dayjs(session.createdAt).format('HH:mm')} and will end
          automatically at {dayjs(session.endedAt).format('HH:mm')}.
        </p>
      )}
      <hr className="dark:border-neutral-800" />
      <SessionReactionList
        showAddButton={!session.hasEnded}
        session={session}
        profileId={profile.id}
      />
      <hr className="dark:border-neutral-800" />
      <ParticipantList session={session} isSessionOwner={false} />
    </>
  );
};
