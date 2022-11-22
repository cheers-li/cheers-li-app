import { FC, SyntheticEvent, useState } from 'react';
import { endSession, Session, updateSession } from '~/services/session';
import { Button } from '~/components/button';
import { SessionReactionList } from '~/components/reaction/session-reaction-list';
import { Profile } from '~/services/friends';
import dayjs from 'dayjs';
import { Dialog } from '~/components/dialog';
import { Input } from '~/components/input';
import { CameraIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';
import { sendErrorFeedback, sendSuccessFeedback } from '~/services/haptics';
import { Camera, CameraResultType } from '@capacitor/camera';
import { uploadSessionImage } from '~/services/session-image';
import store from '~/store';
import { User } from '@supabase/supabase-js';

interface SessionDetailOwnerProps {
  session: Session;
  profile: Profile;
  refetch: () => void;
}

export const SessionDetailOwner: FC<SessionDetailOwnerProps> = ({
  session,
  profile,
  refetch,
}) => {
  const navigate = useNavigate();
  const [user] = store.useState<User>('user');
  const [name, setName] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
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
      quality: 75,
      width: 1000,
      height: 1000,
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
    await endSession(session.id || '');
    setIsLoading(false);
    sendSuccessFeedback();
    navigate('/');
  };

  const hasStarted =
    !session.hasEnded &&
    user.id === session?.user.id &&
    dayjs().isAfter(dayjs(session.createdAt));

  const hasNotStarted =
    !session.hasEnded &&
    user.id === session?.user.id &&
    dayjs().isBefore(dayjs(session.createdAt));

  return (
    <>
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
    </>
  );
};
