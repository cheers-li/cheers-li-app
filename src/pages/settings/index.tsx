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
import { signOut } from '~/services/auth';
import { Avatar } from '~/components/avatar';
import { getProfile } from '~/services/profile';
import { sendErrorFeedback, sendSuccessFeedback } from '~/services/haptics';
import { Link } from 'react-router-dom';
import store from '~/store';
import { User } from '@supabase/supabase-js';

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

  const [user] = store.useState<User>('user');

  const profile = useAsync(async () => {
    const { data } = await getProfile(user?.id);
    return data;
  });

  return (
    <Page>
      <PageHeader>Settings</PageHeader>

      <div className="px-4">
        <div className="h-24 rounded-md bg-white p-4">
          {!profile.loading && profile.value && (
            <Link
              onClick={() => sendSuccessFeedback()}
              to="/settings/edit-profile"
              className="flex h-full items-center justify-center gap-4"
            >
              <Avatar profile={profile.value} customClasses="flex-shrink-0" />
              <div className="flex max-w-full flex-1 flex-col overflow-hidden">
                <span className="text-md font-bold">
                  {profile.value.username}
                </span>
                <span className="truncate">{user.email}</span>
              </div>
              <ChevronRightIcon className="h-6 w-6" />
            </Link>
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
