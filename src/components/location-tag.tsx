import { FC } from 'react';
import { Location } from '~/services/session';

interface LocationProps {
  location: Location;
}

export const LocationTag: FC<LocationProps> = ({ location }) => (
  <span className="text-sm text-gray-500">
    📍 {location.coordinates[0]} {location.coordinates[1]}
  </span>
);
