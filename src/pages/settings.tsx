import { useAsync } from 'react-use';
import { App } from '@capacitor/app';
import { Button } from '~/components/button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import {
  BellAlertIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  LifebuoyIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { List } from '~/components/list';
import { getStoredUser, signOut } from '~/services/auth';
import { Avatar } from '~/components/avatar';
import { getProfile } from '~/services/profile';
import { sendErrorFeedback } from '~/services/haptics';

const aboutListItem = [
  {
    label: 'Help',
    icon: <LifebuoyIcon />,
    onClick: () => sendErrorFeedback(),
  },
  {
    label: 'About',
    icon: <InformationCircleIcon />,
    onClick: () => sendErrorFeedback(),
  },
];

const settingsListItem = [
  {
    label: 'Notifications',
    icon: <BellAlertIcon />,
    onClick: () => sendErrorFeedback(),
  },
  {
    label: 'Location',
    icon: <MapPinIcon />,
    onClick: () => sendErrorFeedback(),
  },
];

const Settings = () => {
  const appInfo = useAsync(async () => {
    return await App.getInfo();
  });

  const profile = useAsync(async () => {
    const user = await getStoredUser();
    const { data } = await getProfile(user?.id);
    return { ...data, user };
  });

  return (
    <Page>
      <PageHeader>Settings</PageHeader>

      <div className="px-4">
        <div className="flex h-24 items-center justify-center gap-4 rounded-md bg-white p-4">
          {!profile.loading && profile.value && (
            <>
              <Avatar profile={profile.value} />
              <div className="flex flex-1 flex-col">
                <span className="text-md font-bold">
                  {profile.value.username}
                </span>
                <span>{profile.value.user.email}</span>
              </div>
              <ChevronRightIcon className="h-6 w-6" />
            </>
          )}
        </div>
      </div>

      <div className="px-4">
        <p className="my-1 text-sm uppercase text-gray-500">App Settings</p>
        <List listItems={settingsListItem} />
      </div>

      <div className="px-4">
        <p className="my-1 text-sm uppercase text-gray-500">About</p>
        <List listItems={aboutListItem} />
      </div>

      <div className="flex w-full flex-col gap-6 px-4">
        <Button danger onClick={signOut}>
          Logout
        </Button>
        {!appInfo.loading && appInfo.value && (
          <span className="mt-1 block text-center text-sm font-normal text-gray-500">
            Version: {appInfo.value.version} ({appInfo.value.build}) <br />
            Environment: {import.meta.env.VITE_ENVIRONMENT}
          </span>
        )}
      </div>
    </Page>
  );
};

export default Settings;
