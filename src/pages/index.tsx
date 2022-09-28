import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { SessionList } from '~/components/session/session-list';

const Index = () => {
  return (
    <Page>
      <PageHeader>
        Cheers.li
        <span className="mt-1 block text-sm font-normal text-gray-500">
          Start a session or join your friends for a drink!
        </span>
      </PageHeader>

      <SessionList />
    </Page>
  );
};

export default Index;
