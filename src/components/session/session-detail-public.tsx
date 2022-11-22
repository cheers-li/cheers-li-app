import { FC, useState } from 'react';
import { Session } from '~/services/session';
import { Button } from '~/components/button';
import { SessionReactionList } from '~/components/reaction/session-reaction-list';
import { Profile } from '~/services/friends';
import dayjs from 'dayjs';
import { sendCheersli } from '~/services/cheersli';

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
  return (
    <>
      <p className="text-sm text-gray-500">
        {session.user.username} has started a new session. It will end
        automatically at {dayjs(session.endedAt).format('HH:mm')}.
      </p>
      <hr className="dark:border-neutral-800" />
      <SessionReactionList sessionId={session.id} profileId={profile.id} />
      <hr className="dark:border-neutral-800" />
      <Button
        primary
        onClick={cheersli}
        disabled={sentCheersli || loadCheersli}
      >
        {sentCheersli ? 'Sent Cheersli' : 'Cheersli 🍻'}
      </Button>
    </>
  );
};
