import { Geolocation } from '@capacitor/geolocation';
import { FC } from 'react';
import { Button } from '../button';
import { Dialog } from '../dialog';

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
    <Dialog>
      <div className="flex w-full flex-col gap-6 pt-8 pb-24">
        <h1 className="text-3xl font-bold">Location Sharing</h1>
        <p className="text-sm text-gray-500">
          Share your location with friends! To show your friends where you are
          we need access to your location.
        </p>
        <hr />
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