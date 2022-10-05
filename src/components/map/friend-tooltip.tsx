import { MapPinIcon } from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import mapboxgl from 'mapbox-gl';
import { Badge } from '~/components/badge';
import { LocationTag } from '~/components/location-tag';
import { distance, formatDistance } from '~/helper/distance';
import { Session } from '~/services/session';

interface FriendTooltipProps {
  session: Session;
  center: mapboxgl.LngLat;
}

const FriendTooltip = ({ session, center }: FriendTooltipProps) => {
  const distanceFromUser = formatDistance(
    distance(
      center.lat,
      center.lng,
      session.location?.coordinates[0],
      session.location?.coordinates[1],
    ),
  );

  return (
    <>
      <div className="px-4 py-2 text-black">
        <div className="text-base font-medium">{session.name}</div>
        <div className="text-gray-500">
          {!session.name.includes(session.user.username) && (
            <p>By {session.user.username}</p>
          )}
          <p className="mt-2 flex items-center space-x-1">
            <MapPinIcon className="h-5 w-5" aria-hidden="true" />
            <span>
              <span className="font-medium">{distanceFromUser}</span> away
            </span>
          </p>
          {session.location && (
            <div className="remove-scrollbar mt-1 overflow-x-scroll">
              <LocationTag
                location={session.location}
                locationName={session.locationName}
              />
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <Badge green>Active</Badge>
            <span className="text-sm text-gray-500">
              Started {session.lastActive}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-b-lg border-t border-t-gray-200 bg-gray-100 px-4 py-2 text-xs">
        <a
          href={`/sessions/${session.id}`}
          className="inline-flex items-center justify-between space-x-1 rounded-md border border-sky-600 bg-sky-700 px-4 py-2 text-white active:bg-sky-800"
        >
          <ArrowTrendingUpIcon className="h-5 w-5" aria-hidden="true" />
          <span>Join</span>
        </a>
        {/* <a className="inline-flex items-center justify-between space-x-1 rounded-md border border-sky-600 bg-sky-700 px-4 py-2 text-white active:bg-sky-800">
          <ChatBubbleLeftIcon className="h-5 w-5" aria-hidden="true" />
          <span>Chat</span>
        </a> */}
      </div>
    </>
  );
};

export default FriendTooltip;
