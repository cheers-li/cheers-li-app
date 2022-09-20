import { useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import { getProfile } from '~/services/profile';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { FriendList } from '~/components/friend-list';
import { SessionList } from '~/components/session-list';
import { getStoredUser } from '~/services/auth';
import { Profile } from '~/services/friends';

const Index = () => {
  const user = useAsync(() => getStoredUser());
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    if (!user.loading) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data } = await getProfile(user.value?.id);
    setProfile(data);
  };

  return (
    <Page>
      <PageHeader>
        {profile && <>Welcome back {profile?.username}</>}
        <span className="mt-4 block text-sm font-normal text-gray-500">
          You are currently logged in as: {user.value?.email}
        </span>
      </PageHeader>

      <h2 className="px-8 text-xl font-bold">Recent Sessions</h2>
      <SessionList />
      <h2 className="px-8 text-xl font-bold">Your friends</h2>
      <FriendList />
    </Page>
  );
};

export default Index;
