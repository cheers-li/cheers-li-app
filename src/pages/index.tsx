import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { SessionList } from '~/components/session-list';

const Index = () => {
  return (
    <Page>
      <PageHeader>
        Cheers.li
        <span className="mt-1 block text-sm font-normal text-gray-500">
          Start a session or join your friends for a drink!
        </span>
      </PageHeader>

      <h2 className="px-8 text-xl font-bold">Recent Sessions</h2>
      <SessionList />
    </Page>
  );
};

export default Index;
