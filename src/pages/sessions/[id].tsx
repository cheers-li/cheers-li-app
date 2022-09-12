import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAsync } from 'react-use';
import { Button, LinkButton } from '~/components/button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { endSession, getSession, hasEnded } from '~/services/session';

const ActiveSession = () => {
  const params = useParams();
  const [loading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const session = useAsync(() => getSession(params.id || ''));

  const endCurrentSession = async () => {
    setIsLoading(true);
    await endSession(params.id || '');
    setIsLoading(false);
    navigate('/');
  };

  return (
    <Page>
      <PageHeader>
        {session.loading ? 'Loading...' : session.value?.name}
      </PageHeader>
      <div className="flex w-full flex-col gap-6 px-8">
        {hasEnded(session.value?.endedAt) && (
          <>
            <p className="text-sm text-red-500">
              This session has already ended
            </p>
            <LinkButton primary href="/">
              Go Home
            </LinkButton>
          </>
        )}
        {!hasEnded(session.value?.endedAt) && (
          <>
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
