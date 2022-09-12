import { useParams } from 'react-router';
import { Button, LinkButton } from '~/components/button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';

const ActiveSession = () => {
  const params = useParams();
  return (
    <Page>
      <PageHeader>{params.name}</PageHeader>
      <p className="text-sm text-gray-500">
        You have successfully started a new session. It will end automatically
        in 2 hours.
      </p>
      <hr />
      <p className="text-sm text-gray-500">
        Looks like you are alone. Invite some of your friends to join you or go
        home now.
      </p>
      <Button primary>Invite Friends</Button>
      <LinkButton danger href="/">
        End Session
      </LinkButton>
    </Page>
  );
};

export default ActiveSession;
