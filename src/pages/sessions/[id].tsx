import { User } from '@supabase/supabase-js';
import { useParams } from 'react-router';
import { Page } from '~/components/page';
import { SessionDetailOwner } from '~/components/session/session-detail-owner';
import { SessionDetailPublic } from '~/components/session/session-detail-public';
import { SessionTitle } from '~/components/session/session-title';
import { Profile } from '~/services/friends';
import { useSession } from '~/services/session';
import store from '~/store';

const ActiveSession = () => {
  const params = useParams();
  const [user] = store.useState<User>('user');
  const [profile] = store.useState<Profile>('profile');
  const {
    data: session,
    isLoading: sessionLoading,
    refetch,
  } = useSession(params.id || '');

  const hasEnded = !sessionLoading && session?.hasEnded;
  const ownsSession = !(!sessionLoading && user.id !== session?.user.id);

  return (
    <Page noPadding hideNavigation>
      {session && <SessionTitle session={session} />}

      <div className="flex w-full flex-col gap-4 px-8">
        {sessionLoading && (
          <p className="text-sm text-gray-500">Loading Session...</p>
        )}

        {hasEnded && (
          <p className="text-sm text-red-500">This session has already ended</p>
        )}

        {session && !ownsSession && (
          <SessionDetailPublic session={session} profile={profile} />
        )}

        {session && ownsSession && (
          <SessionDetailOwner
            session={session}
            profile={profile}
            refetch={refetch}
          />
        )}
      </div>
    </Page>
  );
};

export default ActiveSession;
