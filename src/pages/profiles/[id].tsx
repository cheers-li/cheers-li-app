import { ChevronDownIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAsync } from 'react-use';
import { Button } from '~/components/button';
import { Page } from '~/components/page';
import { getLastActive } from '~/helper/time';
import { acceptRequest, addFriend, FriendStatus } from '~/services/friends';
import { sendSuccessFeedback } from '~/services/haptics';
import { getCompleteProfile } from '~/services/profile';
import store from '~/store';

const ProfileView = () => {
  const params = useParams();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const [user] = store.useState<User>('user');
  const [theme] = store.useState<string>('theme');

  const gradient =
    theme === 'dark'
      ? 'linear-gradient(0deg, rgba(249,250,251,1) 5%, rgba(249,250,251,0) 62%)'
      : 'linear-gradient(0deg, rgba(249,250,251,1) 5%, rgba(249,250,251,0) 62%)';

  const profile = useAsync(() => getCompleteProfile(params.id || '', user.id));

  const addFriendHandler = async () => {
    if (!profile?.value?.data) return;

    const res = await addFriend(user.id, profile.value.data.id);
    if (res) {
      sendSuccessFeedback();
      profile.value.data.status = FriendStatus.REQUESTED;
    }
  };

  const confirmFriend = async () => {
    if (!profile?.value?.data) return;

    const res = await acceptRequest(profile.value.data.id, user.id);
    if (res) {
      sendSuccessFeedback();
      profile.value.data.status = FriendStatus.ACCEPTED;
    }
  };

  // TODO: TMP to debug
  useEffect(() => {
    if (!profile.value) return;
    console.log(profile.value);
  }, [profile.value]);

  return (
    <Page noPadding noGap>
      {!profile.loading && (
        <>
          <div
            className="flex w-full flex-col justify-between bg-cover bg-center px-8 pt-safe-top pb-2 text-black"
            style={{
              backgroundImage: `${gradient},
              linear-gradient(0deg, rgba(0,0,0,0) 80%, rgba(0,0,0,0.4) 100%),
              url(${profile.value?.data?.avatarUrl || '/splash.png'})`,
              height: 'calc(100vh / 2)',
            }}
          >
            <div className="pt-2 text-white">
              <button onClick={goBack}>
                <ChevronDownIcon className="h-6 w-6" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {profile.value?.data?.username}
              </h1>
              <p className="mt-1 text-base">{profile.value?.data?.bio}</p>
            </div>
          </div>
          <div className="px-8 text-sm leading-tight text-gray-600">
            <p>{profile.value?.data?.city}</p>
            {profile.value?.data?.status === FriendStatus.ACCEPTED && (
              <p>
                <span>Friends for </span>
                {getLastActive(profile.value.data.friends[0].accepted_at, '')}
              </p>
            )}
          </div>
          <div className="mt-4 px-8">
            {profile.value?.data?.status === FriendStatus.NEW && (
              <Button dark onClick={addFriendHandler}>
                <div className="flex items-center justify-center space-x-3">
                  <UserPlusIcon className="h-5 w-5" />
                  <span>Add</span>
                </div>
              </Button>
            )}
            {profile.value?.data?.status === FriendStatus.REQUESTED && (
              <Button dark disabled>
                <div className="flex items-center justify-center space-x-3">
                  <UserPlusIcon className="h-5 w-5" />
                  <span>Requested</span>
                </div>
              </Button>
            )}
            {profile.value?.data?.status === FriendStatus.CONFIRM && (
              <Button dark onClick={confirmFriend}>
                <div className="flex items-center justify-center space-x-3">
                  <UserPlusIcon className="h-5 w-5" />
                  <span>Confirm</span>
                </div>
              </Button>
            )}
          </div>
        </>
      )}
    </Page>
  );
};

export default ProfileView;