import { User } from '@supabase/supabase-js';
import { useEffectOnce } from 'react-use';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { SessionList } from '~/components/session/session-list';
import { setLastActive } from '~/services/profile';
import store from '~/store';

const Index = () => {
  const [user] = store.useState<User>('user');

  useEffectOnce(() => {
    if (user) {
      setLastActive(user.id);
    }
  });

  return (
    <Page
      header={
        <PageHeader truncate={false}>
          Cheers.li
          <span className="mt-1 block whitespace-nowrap text-sm font-normal text-gray-500 dark:text-neutral-400">
            Start a session or join your friends for a drink!
          </span>
        </PageHeader>
      }
    >
      <SessionList />
    </Page>
  );
};

export default Index;
