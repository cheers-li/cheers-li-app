import { SyntheticEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAsync } from 'react-use';
import { Button, LinkButton } from '~/components/button';
import { Input } from '~/components/input';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { sendErrorFeedback, sendSuccessFeedback } from '~/services/haptics';
import { endSession, getSession, updateSession } from '~/services/session';

const ActiveSession = () => {
  const params = useParams();
  const navigate = useNavigate();
  const session = useAsync(() => getSession(params.id || ''));

  const [name, setName] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <Page>
      <PageHeader truncate={false}>
        {session.loading ? 'Loading...' : session.value?.name}
      </PageHeader>
      <div className="flex w-full flex-col gap-6 px-8">
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
        {!session.loading && !session.value?.hasEnded && (
          <>
            <form onSubmit={updateSessionName} className="flex flex-col gap-6">
              <Input
                placeholder="Replace default name"
                label="Change name"
                value={name}
                error={error}
                onUpdate={setName}
                disabled={loading}
              />
              <Button primary>Change name</Button>
            </form>
            <hr />
            <p className="text-sm text-gray-500">
              You have successfully started a new session. It will end
              automatically in 2 hours.
            </p>
            <hr />
            <p className="text-sm text-gray-500">
              Looks like you are alone. Invite some of your friends to join you
              or go home now.
            </p>
            <Button disabled={loading} primary>
              Invite Friends
            </Button>
            <Button disabled={loading} danger onClick={endCurrentSession}>
              End Session
            </Button>
          </>
        )}
      </div>
    </Page>
  );
};

export default ActiveSession;
