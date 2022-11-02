import { PushNotifications } from '@capacitor/push-notifications';
import { FC } from 'react';
import { Button } from '~/components/button';
import { Dialog } from '~/components/dialog';

interface AskNotificationPermissionProps {
  complete: () => void;
}

export const AskNotificationPermission: FC<AskNotificationPermissionProps> = ({
  complete,
}) => {
  const setLocationPermission = async () => {
    const permission = await PushNotifications.requestPermissions();

    // User denied the permission
    if (permission.receive !== 'granted') {
      complete();
      return;
    }

    await PushNotifications.register();
    complete();
  };

  return (
    <Dialog closeModal={() => undefined}>
      <div className="flex w-full flex-col gap-6 pt-8 pb-24 text-black dark:text-white">
        <h1 className="text-3xl font-bold">Push Notifications</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-300">
          Don’t miss out on anything! Get notified if one of your friends starts
          a new session or invites you to one.
        </p>
        <hr className="dark:border-neutral-800" />
        <Button primary onClick={setLocationPermission}>
          Enable Notification
        </Button>
        <Button secondary onClick={complete}>
          I do not want to receive notifications
        </Button>
      </div>
    </Dialog>
  );
};
