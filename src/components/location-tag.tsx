import clsx from 'clsx';
import { FC } from 'react';
import { Location } from '~/services/session';

interface LocationProps {
  location: Location;
  locationName?: string;
}

export const LocationTag: FC<LocationProps> = ({ location, locationName }) => (
  <span
    className={clsx(
      'max-w-full truncate whitespace-nowrap text-sm text-gray-500',
    )}
  >
    📍
    {locationName ? (
      <>{locationName}</>
    ) : (
      <>
        {location.coordinates[0]}, {location.coordinates[1]}
      </>
    )}
  </span>
);
