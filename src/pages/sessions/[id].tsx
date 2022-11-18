import { Camera, CameraResultType } from '@capacitor/camera';
import {
  CameraIcon,
  ChevronDownIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import { SyntheticEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, LinkButton } from '~/components/button';
import { Dialog } from '~/components/dialog';
import { Input } from '~/components/input';
import { LocationTag } from '~/components/location-tag';
import { Page } from '~/components/page';
import { SessionReactionList } from '~/components/reaction/session-reaction-list';
import { sendCheersli } from '~/services/cheersli';
import { Profile } from '~/services/friends';
import { sendErrorFeedback, sendSuccessFeedback } from '~/services/haptics';
import { endSession, useSession, updateSession } from '~/services/session';
import { uploadSessionImage } from '~/services/session-image';
import store from '~/store';

const ActiveSession = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [user] = store.useState<User>('user');
  const [profile] = store.useState<Profile>('profile');
  const {
    data: session,
    isLoading: sessionLoading,
    refetch,
  } = useSession(params.id || '');

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

  const setSessionImage = async () => {
    if (!session) {
      return;
    }

    const image = await Camera.getPhoto({
      quality: 50,
      width: 500,
      height: 500,
      resultType: CameraResultType.Base64,
    });

    if (!image.base64String) {
      return;
    }

    await uploadSessionImage(session.id, image.base64String);
    refetch();
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

  const hasStarted =
    !sessionLoading &&
    !session?.hasEnded &&
    user.id === session?.user.id &&
    dayjs().isAfter(dayjs(session.createdAt));
  const hasNotStarted =
    !sessionLoading &&
    !session?.hasEnded &&
    user.id === session?.user.id &&
    dayjs().isBefore(dayjs(session.createdAt));
  const hasEnded = !sessionLoading && session?.hasEnded;
  const ownsSession = !(
    !sessionLoading &&
    session &&
    !session?.hasEnded &&
    user.id !== session?.user.id
  );

  const [dark] = store.useState<boolean>('dark');

  const gradient = dark
    ? 'linear-gradient(0deg, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 62%)'
    : 'linear-gradient(0deg, rgba(249,250,251,1) 5%, rgba(249,250,251,0) 62%)';

  return (
    <Page noPadding>
      <div
        className="flex h-full w-full flex-col justify-between bg-cover bg-center pt-safe-top pb-2 text-black dark:text-white"
        style={{
          backgroundImage: `${gradient},
              linear-gradient(0deg, rgba(0,0,0,0) 80%, rgba(0,0,0,0.4) 100%),
              url(${session?.imageUrl || '/splash.png'})`,
          height: 'calc(100vh / 3)',
        }}
      >
        <div className="flex items-center justify-between px-4 pt-2 text-white">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full bg-gray-800 bg-opacity-50 p-2"
          >
            <ChevronDownIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 px-8">
        {sessionLoading && (
          <p className="text-sm text-gray-500">Loading Session...</p>
        )}
        {!sessionLoading && session && (
          <>
            <h2 className="flex flex-col items-start justify-center text-xl font-medium">
              {session.name}
              <p className="text-sm text-gray-500">
                Created by {session.user.username}
              </p>
            </h2>
            {session.location && (
              <LocationTag
                location={session.location}
                locationName={session.locationName}
              />
            )}
          </>
        )}
        {hasEnded && (
          <>
            <p className="text-sm text-red-500">
              This session has already ended
            </p>
            <LinkButton secondary href="/">
              Go Home
            </LinkButton>
          </>
        )}
        {!ownsSession && (
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
        {hasNotStarted && (
          <>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              This session has not started yet. It will start today at{' '}
              {dayjs(session.createdAt).format('HH:MM')} and will end
              automatically at {dayjs(session.endedAt).format('HH:MM')}.
            </p>
            <hr className="dark:border-neutral-800" />
            <Button
              disabled={loading}
              secondary
              onClick={setSessionImage}
              icon={<CameraIcon />}
            >
              Add Image
            </Button>
            <Button
              disabled={loading}
              secondary
              onClick={() => setIsEditing(true)}
              icon={<PencilSquareIcon />}
            >
              Change Session Name
            </Button>
            <Button disabled={loading} danger onClick={endCurrentSession}>
              Cancel Session
            </Button>
          </>
        )}
        {hasStarted && (
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
              secondary
              onClick={setSessionImage}
              icon={<CameraIcon />}
            >
              Add Image
            </Button>
            <Button
              disabled={loading}
              secondary
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
