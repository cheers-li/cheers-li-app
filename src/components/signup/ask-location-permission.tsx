import { Geolocation } from '@capacitor/geolocation';
import { FC } from 'react';
import { Button } from '~/components/button';
import { Dialog } from '~/components/dialog';

interface AskLocationPermissionProps {
  complete: () => void;
}

export const AskLocationPermission: FC<AskLocationPermissionProps> = ({
  complete,
}) => {
  const setLocationPermission = async () => {
    await Geolocation.requestPermissions({
      permissions: ['location', 'coarseLocation'],
    });

    complete();
  };

  return (
    <Dialog closeModal={() => undefined}>
      <div className="flex w-full flex-col gap-6 pt-8 pb-24 text-black dark:text-white">
        <h1 className="text-3xl font-bold">Location Sharing</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-300">
          Share your location with friends! To show your friends where you are
          we need access to your location.
        </p>
        <hr className="dark:border-neutral-800" />
        <Button primary onClick={setLocationPermission}>
          Enable Location
        </Button>
        <Button secondary onClick={complete}>
          I do not want to use locations
        </Button>
      </div>
    </Dialog>
  );
};
