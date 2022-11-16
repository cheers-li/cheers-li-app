import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import { SyntheticEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, LinkButton } from '~/components/button';
import { Dialog } from '~/components/dialog';
import { Input } from '~/components/input';
import { LocationTag } from '~/components/location-tag';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { SessionReactionList } from '~/components/reaction/session-reaction-list';
import { sendCheersli } from '~/services/cheersli';
import { Profile } from '~/services/friends';
import { sendErrorFeedback, sendSuccessFeedback } from '~/services/haptics';
import { endSession, useSession, updateSession } from '~/services/session';
import store from '~/store';

const ActiveSession = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [user] = store.useState<User>('user');
  const [profile] = store.useState<Profile>('profile');
  const { data: session, isLoading: sessionLoading } = useSession(
    params.id || '',
  );

  const [name, setName] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const [loadCheersli, setLoadCheersli] = useState(false);
  const [sentCheersli, setSentCheersli] = useState(false);

  const updateSessionName = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!name || name.length == 0) {
        throw 'The name cannot be empty';
      }
      if (!session) {
        throw 'The session is not found';
      }
      const { data, error: errorMessage } = await updateSession(
        session.id,
        name,
      );

      if (errorMessage) {
        throw errorMessage.message;
      }

      session.name = data && data[0]?.name;
      setIsEditing(false);
      sendSuccessFeedback();
    } catch (exception: unknown) {
      if (exception instanceof String) {
        setError(exception as string);
      }
      sendErrorFeedback();
    } finally {
      setIsLoading(false);
    }
  };

  const endCurrentSession = async () => {
    setIsLoading(true);
    await endSession(params.id || '');
    setIsLoading(false);
    sendSuccessFeedback();
    navigate('/');
  };

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
    <Page>
      <PageHeader truncate={false}>Session</PageHeader>
      <div className="flex w-full flex-col gap-4 px-8">
        {sessionLoading && (
          <p className="text-sm text-gray-500">Loading Session...</p>
        )}
        {!sessionLoading && session && (
          <>
            <h2 className="flex items-center text-xl font-medium">
              {session.name}{' '}
            </h2>
            {session.location && (
              <LocationTag
                location={session.location}
                locationName={session.locationName}
              />
            )}
          </>
        )}
        {!sessionLoading && session?.hasEnded && (
          <>
            <p className="text-sm text-red-500">
              This session has already ended
            </p>
            <LinkButton secondary href="/">
              Go Home
            </LinkButton>
          </>
        )}
        {!sessionLoading &&
          session &&
          !session?.hasEnded &&
          user.id !== session?.user.id && (
            <>
              <p className="text-sm text-gray-500">
                {session?.user.username} has started a new session. It will end
                automatically at {dayjs(session?.endedAt).format('HH:MM')}.
              </p>
              <hr className="dark:border-neutral-800" />
              <SessionReactionList
                sessionId={session.id}
                profileId={profile.id}
              />
              <hr className="dark:border-neutral-800" />
              <Button
                primary
                onClick={cheersli}
                disabled={sentCheersli || loadCheersli}
              >
                {sentCheersli ? 'Sent Cheersli' : 'Cheersli 🍻'}
              </Button>
            </>
          )}
        {!sessionLoading && !session?.hasEnded && user.id === session?.user.id && (
          <>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              You started this session. It will end automatically at{' '}
              {dayjs(session.endedAt).format('HH:MM')}.
            </p>
            <hr className="dark:border-neutral-800" />
            <SessionReactionList
              showAddButton={false}
              sessionId={session.id}
              profileId={profile.id}
            />
            <hr className="dark:border-neutral-800" />
            <Button
              disabled={loading}
              primary
              onClick={() => setIsEditing(true)}
              icon={<PencilSquareIcon />}
            >
              Change Session Name
            </Button>
            <Button disabled={loading} danger onClick={endCurrentSession}>
              End Session
            </Button>
          </>
        )}
      </div>

      <Dialog isShowing={isEditing} closeModal={() => setIsEditing(false)}>
        <div className="flex w-full flex-col gap-6 pt-8 pb-24">
          <h2 className="text-2xl font-bold">Change Session Name</h2>
          <form onSubmit={updateSessionName} className="flex flex-col gap-6">
            <Input
              placeholder={session?.name}
              label="Session Name"
              value={name}
              error={error}
              onUpdate={setName}
              disabled={loading}
            />
            <Button primary>Change Name</Button>
          </form>
          <Button secondary onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
      </Dialog>
    </Page>
  );
};

export default ActiveSession;
