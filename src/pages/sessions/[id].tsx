import { PencilSquareIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import { SyntheticEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAsync } from 'react-use';
import { Button, LinkButton } from '~/components/button';
import { Dialog } from '~/components/dialog';
import { Input } from '~/components/input';
import { LocationTag } from '~/components/location-tag';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { sendCheersli } from '~/services/cheersli';
import { sendErrorFeedback, sendSuccessFeedback } from '~/services/haptics';
import { getProfile } from '~/services/profile';
import { endSession, getSession, updateSession } from '~/services/session';
import store from '~/store';

const ActiveSession = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [user] = store.useState<User>('user');
  const session = useAsync(() => getSession(params.id || ''));

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
      if (!session.value) {
        throw 'The session is not found';
      }
      const { data, error: errorMessage } = await updateSession(
        session.value?.id,
        name,
      );

      if (errorMessage) {
        throw errorMessage.message;
      }

      session.value.name = data && data[0]?.name;
      setIsEditing(false);
      sendSuccessFeedback();
    } catch (exception: any) {
      setError(exception);
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
    const profile = await getProfile(user.id);
    const devices = session?.value?.user?.devices?.map(
      (device) => device.device_token,
    );

    await sendCheersli(profile.data, devices || []);
    setSentCheersli(true);
    setLoadCheersli(false);
  };

  return (
    <Page>
      <PageHeader truncate={false}>Session</PageHeader>
      <div className="flex w-full flex-col gap-4 px-8">
        {session.loading && (
          <p className="text-sm text-gray-500">Loading Session...</p>
        )}
        {!session.loading && session.value && (
          <>
            <h2 className="flex items-center text-xl font-medium">
              {session.value?.name}{' '}
            </h2>
            {session.value?.location && (
              <LocationTag
                location={session.value.location}
                locationName={session.value.locationName}
              />
            )}
          </>
        )}
        {!session.loading && session.value?.hasEnded && (
          <>
            <p className="text-sm text-red-500">
              This session has already ended
            </p>
            <LinkButton secondary href="/">
              Go Home
            </LinkButton>
          </>
        )}
        {!session.loading &&
          !session.value?.hasEnded &&
          user.id !== session?.value?.user.id && (
            <>
              <p className="text-sm text-gray-500">
                {session.value?.user.username} has started a new session. It
                will end automatically at{' '}
                {dayjs(session.value?.endedAt).format('HH:MM')}.
              </p>
              <Button
                primary
                onClick={cheersli}
                disabled={sentCheersli || loadCheersli}
              >
                {sentCheersli ? 'Sent Cheersli' : 'Cheersli 🍻'}
              </Button>
            </>
          )}
        {!session.loading &&
          !session.value?.hasEnded &&
          user.id === session?.value?.user.id && (
            <>
              <p className="text-sm text-gray-500">
                You started this session. It will end automatically at{' '}
                {dayjs(session.value?.endedAt).format('HH:MM')}.
              </p>
              <hr />
              <p className="text-sm text-gray-500">
                Looks like you are alone. Invite some of your friends to join
                you or go home now.
              </p>
              <Button disabled={true} icon={<UserGroupIcon />}>
                Invite Friends
              </Button>
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
              placeholder={session.value?.name}
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
