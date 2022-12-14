import {
  ArrowUpOnSquareIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  UserMinusIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useEffectOnce } from 'react-use';
import { Button } from '~/components/button';
import Dropdown from '~/components/dropdown';
import { Page } from '~/components/page';
import { getLastActive } from '~/helper/time';
import {
  acceptRequest,
  addFriend,
  FriendStatus,
  removeFriendShip,
} from '~/services/friends';
import { sendSuccessFeedback } from '~/services/haptics';
import { CompleteProfile, getCompleteProfile } from '~/services/profile';
import store from '~/store';

const ProfileView = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [user] = store.useState<User>('user');
  const [profile, setProfile] = useState<CompleteProfile | null>(null);

  const shareProfile = () => {
    // TODO: share profile link
    console.log('share profile');
  };

  const [dark] = store.useState<boolean>('dark');

  const gradient = dark
    ? 'linear-gradient(0deg, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 62%)'
    : 'linear-gradient(0deg, rgba(249,250,251,1) 5%, rgba(249,250,251,0) 62%)';

  const addFriendHandler = async () => {
    if (!profile) return;

    const res = await addFriend(user.id, profile.id);
    if (res) {
      sendSuccessFeedback();
      setProfile((prev) => {
        if (!prev) return prev;
        return { ...prev, status: FriendStatus.REQUESTED };
      });
    }
  };

  const removeFriend = async () => {
    if (!profile) return;

    const confirmation = confirm(
      `Are you sure you want to remove ${profile.username} from your friends?`,
    );
    if (!confirmation) return;

    const data = await removeFriendShip(profile.id, user.id);

    if (data) {
      sendSuccessFeedback();
      setProfile((prev) => {
        if (!prev) return prev;
        return { ...prev, status: FriendStatus.NEW };
      });
    }
  };

  const confirmFriend = async () => {
    if (!profile) return;

    const res = await acceptRequest(profile.id, user.id);
    if (res) {
      sendSuccessFeedback();
      setProfile((prev) => {
        if (!prev) return prev;
        return { ...prev, status: FriendStatus.ACCEPTED };
      });
    }
  };

  const isOwnProfile = profile?.id === user.id;

  const loadProfile = async () => {
    const { data, error } = await getCompleteProfile(params.id || '', user.id);
    if (data && !error) {
      setProfile(data);
    }
  };

  useEffectOnce(() => {
    loadProfile();
  });

  return (
    <Page noPadding noGap hideNavigation>
      {profile && (
        <>
          <div
            className="flex w-full flex-col justify-between bg-cover bg-center pt-safe-top pb-2 text-black dark:text-white"
            style={{
              backgroundImage: `${gradient},
              linear-gradient(0deg, rgba(0,0,0,0) 80%, rgba(0,0,0,0.4) 100%),
              url(${profile.avatarUrl || '/splash.png'})`,
              height: 'calc(100vh / 2)',
            }}
          >
            <div className="flex items-center justify-between px-4 pt-2 text-white">
              <button
                onClick={() => navigate(-1)}
                className="rounded-full bg-gray-800 bg-opacity-50 p-2"
              >
                <ChevronDownIcon className="h-6 w-6" />
              </button>
              <Dropdown button={<EllipsisHorizontalIcon className="h-6 w-6" />}>
                {isOwnProfile && (
                  <div
                    onClick={() => navigate('/settings/edit-profile')}
                    className="flex items-center"
                  >
                    <PencilSquareIcon
                      className="mr-3 h-5 w-5 text-gray-400 dark:text-white"
                      aria-hidden="true"
                    />
                    Edit your profile
                  </div>
                )}
                {!isOwnProfile && (
                  <div onClick={shareProfile} className="flex items-center">
                    <ArrowUpOnSquareIcon
                      className="mr-3 h-5 w-5 text-gray-400 dark:text-white"
                      aria-hidden="true"
                    />
                    Share this profile
                  </div>
                )}
                {!isOwnProfile && profile.status === FriendStatus.ACCEPTED && (
                  <div onClick={removeFriend} className="flex items-center">
                    <UserMinusIcon
                      className="mr-3 h-5 w-5 text-red-400 dark:text-red-500"
                      aria-hidden="true"
                    />
                    <span className="text-red-400 dark:text-red-500">
                      Remove friendship
                    </span>
                  </div>
                )}
              </Dropdown>
            </div>
            <div className="px-8">
              <h1 className="text-3xl font-bold">{profile.username}</h1>
              <p className="mt-1 text-base">{profile.bio}</p>
            </div>
          </div>
          <div className="px-8 text-sm leading-tight text-gray-600 dark:text-neutral-300">
            <p>{profile.city}</p>
            {!isOwnProfile && profile.status === FriendStatus.ACCEPTED && (
              <p>
                <span>Friends for </span>
                {getLastActive(profile.friends[0].accepted_at, '')}
              </p>
            )}
          </div>
          <div className="mt-4 px-8">
            {profile.status === FriendStatus.NEW && (
              <Button primary onClick={addFriendHandler}>
                <div className="flex items-center justify-center space-x-3">
                  <UserPlusIcon className="h-5 w-5" />
                  <span>Add</span>
                </div>
              </Button>
            )}
            {profile.status === FriendStatus.REQUESTED && (
              <>
                <Button dark disabled>
                  <div className="flex items-center justify-center space-x-3">
                    <UserPlusIcon className="h-5 w-5" />
                    <span>Requested</span>
                  </div>
                </Button>
                <button
                  onClick={removeFriend}
                  className="mt-2 w-full text-center font-semibold text-gray-600 dark:text-neutral-300"
                >
                  Cancel friend request
                </button>
              </>
            )}
            {profile.status === FriendStatus.CONFIRM && (
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
