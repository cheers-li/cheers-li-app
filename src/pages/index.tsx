import { useState } from 'react';
import { Button } from '~/components/button';
import { supabase } from '~/services/supabase-client';
import { useAsync } from 'react-use';
import { getProfile } from '~/services/profile';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';

const Index = () => {
  const logout = () => supabase.auth.signOut();
  const [user] = useState(supabase.auth.user());

  const profile = useAsync(async () => {
    if (user && user.id) {
      const { data } = await getProfile(user.id);
      return data;
    }
    // TODO: User is not available
    return null;
  });

  console.log({ profile, user });

  return (
    <Page>
      <PageHeader>Welcome black</PageHeader>
      {profile.value?.avatar_url && (
        <img
          src={profile.value?.avatar_url}
          alt={profile.value?.username}
          className="h-20 w-20 rounded-full"
        />
      )}
      <p className="text-sm text-gray-500">
        You are currently logged in as: {user?.email}
      </p>

      <Button primary onClick={logout}>
        Logout
      </Button>
    </Page>
  );
};

export default Index;
