import { Geolocation } from '@capacitor/geolocation';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import { Location, Tag } from '~/services/session';
import { LocationList } from '~/components/location-list';
import { Switch } from '~/components/switch';

interface ChooseLocationProps {
  selectedDrink: Tag | undefined;
  selectedLocation: Tag | undefined;
  selectLocation: Dispatch<SetStateAction<Tag | undefined>>;
  setCoordinates: Dispatch<SetStateAction<Location | undefined>>;
}

export const ChooseLocation: FC<ChooseLocationProps> = ({
  selectedDrink,
  selectedLocation,
  selectLocation,
  setCoordinates,
}) => {
  const [showLocation, setShowLocation] = useState(true);

  const location = useAsync(async () => {
    const point = await Geolocation.getCurrentPosition();
    const loc: Location = {
      type: 'Point',
      coordinates: [point.coords.latitude, point.coords.longitude],
    };

    return loc;
  });

  useEffect(() => {
    if (showLocation === false) {
      selectLocation(undefined);
      setCoordinates(undefined);
    }
  }, [showLocation]);

  useEffect(() => {
    setCoordinates(location.value);
  }, [location]);
  return (
    <>
      <Switch
        checked={showLocation}
        onUpdate={setShowLocation}
        label="Use Location"
      />
      {showLocation && (
        <>
          {location.loading && (
            <span className="text-sm text-gray-500 dark:text-neutral-400">
              Loading locations nearby...
            </span>
          )}
          {!location.loading && (
            <>
              <span className="text-sm text-gray-500 dark:text-neutral-400">
                Choose the location you want to share with your friends
              </span>
              <LocationList
                location={location.value}
                selectedDrink={selectedDrink}
                activeTag={selectedLocation}
                setActiveTag={selectLocation}
              />
            </>
          )}
        </>
      )}
    </>
  );
};
