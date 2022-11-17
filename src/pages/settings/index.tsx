import { useAsync } from 'react-use';
import { App } from '@capacitor/app';
import { Button } from '~/components/button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import {
  BellAlertIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  LifebuoyIcon,
  LockClosedIcon,
  MapPinIcon,
  PaintBrushIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { ListItemType, SimpleList } from '~/components/simple-list';
import { signOut } from '~/services/auth';
import { Avatar } from '~/components/avatar';
import { deleteUser } from '~/services/profile';
import { sendErrorFeedback, sendSuccessFeedback } from '~/services/haptics';
import { Link, useNavigate } from 'react-router-dom';
import store from '~/store';
import { User } from '@supabase/supabase-js';
import { Profile } from '~/services/friends';

const Settings = () => {
  const [profile] = store.useState<Profile>('profile');
  const appInfo = useAsync(async () => {
    return await App.getInfo();
  });
  const navigate = useNavigate();

  const aboutListItem = [
    {
      label: 'Help',
      icon: <LifebuoyIcon />,
      isLink: true,
      link: 'https://www.cheers.li/#faq',
      type: ListItemType.Default,
    },
    {
      label: 'Privacy',
      icon: <LockClosedIcon />,
      isLink: true,
      link: 'https://www.cheers.li/privacy',
      type: ListItemType.Default,
    },
    {
      label: 'About',
      icon: <InformationCircleIcon />,
      isLink: true,
      link: 'https://www.cheers.li/',
      type: ListItemType.Default,
    },
  ];

  const settingsListItem = [
    {
      label: 'Notifications',
      icon: <BellAlertIcon />,
      onClick: () => sendErrorFeedback(),
      type: ListItemType.Default,
    },
    {
      label: 'Location',
      icon: <MapPinIcon />,
      onClick: () => sendErrorFeedback(),
      type: ListItemType.Default,
    },
    {
      label: 'Theme',
      icon: <PaintBrushIcon />,
      onClick: () => {
        navigate('/settings/darkmode');
        sendSuccessFeedback();
      },
      type: ListItemType.Default,
    },
  ];

  const accountListItem = [
    {
      label: 'Edit',
      icon: <PencilIcon />,
      type: ListItemType.Default,
      onClick: () => navigate('/settings/edit-profile'),
    },
    {
      label: 'Delete',
      icon: <ExclamationCircleIcon />,
      type: ListItemType.Error,
      onClick: () => deleteAccount(),
    },
  ];

  const [user] = store.useState<User>('user');

  const deleteAccount = async () => {
    const confirmation = confirm(
      `Are you sure you want to delete your account?`,
    );
    if (!confirmation) return;
    const isDeleted = await deleteUser(user.id);

    if (isDeleted) {
      await signOut();
      return;
    }

    alert('Something went wrong while deleting your user. Try again later.');
  };

  const logout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Page>
      <PageHeader>Settings</PageHeader>

      <div className="px-4">
        <div className="h-24 rounded-md bg-white p-4 dark:bg-neutral-900">
          <Link
            onClick={() => sendSuccessFeedback()}
            to="/settings/edit-profile"
            className="flex h-full items-center justify-center gap-4"
          >
            <Avatar profile={profile} customClasses="flex-shrink-0" />
            <div className="flex max-w-full flex-1 flex-col overflow-hidden">
              <span className="text-md font-bold">{profile.username}</span>
              <span className="truncate">{user.email}</span>
            </div>
            <ChevronRightIcon className="h-6 w-6" />
          </Link>
        </div>
      </div>

      <div className="px-4">
        <p className="my-1 text-sm uppercase text-gray-500 dark:text-neutral-300">
          App Settings
        </p>
        <SimpleList listItems={settingsListItem} />
      </div>

      <div className="px-4">
        <p className="my-1 text-sm uppercase text-gray-500 dark:text-neutral-300">
          About
        </p>
        <SimpleList listItems={aboutListItem} />
      </div>

      <div className="px-4">
        <p className="my-1 text-sm uppercase text-gray-500 dark:text-neutral-300">
          Account
        </p>
        <SimpleList listItems={accountListItem} />
      </div>

      <div className="flex w-full flex-col gap-6 px-4">
        <Button danger onClick={logout}>
          Logout
        </Button>
        {!appInfo.loading && appInfo.value && (
          <span className="mt-1 block text-center text-sm font-normal text-gray-500 dark:text-neutral-300">
            Version: {appInfo.value.version} ({appInfo.value.build}) <br />
            Environment: {import.meta.env.VITE_ENVIRONMENT}
          </span>
        )}
      </div>
    </Page>
  );
};

export default Settings;
