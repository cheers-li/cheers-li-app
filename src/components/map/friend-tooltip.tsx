import {
  ChatBubbleLeftIcon,
  ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import mapboxgl from 'mapbox-gl';
import { distance } from '~/helper/distance';
import { Session } from '~/services/session';

interface FriendTooltipProps {
  session: Session;
  center: mapboxgl.LngLat;
}

const FriendTooltip = ({ session, center }: FriendTooltipProps) => {
  const distanceFromUser = distance(
    center.lat,
    center.lng,
    session.location?.coordinates[0],
    session.location?.coordinates[1],
  ).toFixed(2);

  return (
    <>
      <div className="px-4 py-2">
        <div className="text-base font-medium">{session.user.username}</div>
        <div className="mt-2 space-y-1 text-gray-600">
          <p className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5" aria-hidden="true" />
            <span>
              <span className="font-medium">{distanceFromUser} km</span> away
            </span>
          </p>
          <p className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5" aria-hidden="true" />
            <span>
              Started <span className="font-medium">{session.lastActive}</span>
            </span>
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center space-x-4 rounded-b-lg border-t border-t-gray-200 bg-gray-100 px-4 py-2 text-xs">
        <button className="inline-flex items-center justify-between space-x-1 rounded-md border border-sky-600 bg-sky-700 px-4 py-2 text-white active:bg-sky-800">
          <ArrowTrendingUpIcon className="h-5 w-5" aria-hidden="true" />
          <span>Join</span>
        </button>
        <button className="inline-flex items-center justify-between space-x-1 rounded-md border border-sky-600 bg-sky-700 px-4 py-2 text-white active:bg-sky-800">
          <ChatBubbleLeftIcon className="h-5 w-5" aria-hidden="true" />
          <span>Chat</span>
        </button>
      </div>
    </>
  );
};

export default FriendTooltip;
