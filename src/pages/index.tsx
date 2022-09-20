import { useState } from 'react';
import { supabase } from '~/services/supabase-client';
import { useAsync } from 'react-use';
import { getProfile, getUserId } from '~/services/profile';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { FriendList } from '~/components/friend-list';
import { SessionList } from '~/components/session-list';

const Index = () => {
  const [user] = useState(supabase.auth.user());
  const profile = useAsync(() => getProfile(getUserId()));

  return (
    <Page>
      <PageHeader>
        Welcome back {profile.value?.data.username}
        <span className="mt-4 block text-sm font-normal text-gray-500">
          You are currently logged in as: {user?.email}
        </span>
      </PageHeader>

      <h2 className="px-8 text-xl font-bold">Your Sessions</h2>
      <SessionList />
      <h2 className="px-8 text-xl font-bold">Your friends</h2>
      <FriendList />
    </Page>
  );
};

export default Index;
