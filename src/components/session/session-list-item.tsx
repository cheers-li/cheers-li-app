import { FC } from 'react';
import { Link } from 'react-router-dom';
import { getLastActive } from '~/helper/time';
import { Session } from '~/services/session';
import { Avatar } from '~/components/avatar';
import { Badge } from '~/components/badge';
import { LocationTag } from '~/components/location-tag';
import dayjs from 'dayjs';

interface SessionListItemProps {
  item: Session;
}

export const SessionListItem: FC<SessionListItemProps> = ({
  item: session,
}) => {
  return (
    <Link
      to={`/sessions/${session.id}`}
      className="flex items-center justify-start gap-3 py-3 px-4"
    >
      {session.imageUrl ? (
        <img
          src={session.imageUrl}
          alt={session.name}
          className="block h-16 w-16 flex-shrink-0 rounded-full object-cover"
        />
      ) : (
        <Avatar profile={session.user} size={16} />
      )}

      <div className="flex flex-col items-start justify-start gap-1 overflow-hidden">
        <span className="text-md max-w-full truncate font-medium">
          {session.name}
          <p className="text-sm text-gray-500">By {session.user.username}</p>
        </span>

        {session.hasEnded ? (
          <>
            <div className="flex gap-2">
              {dayjs(session.endedAt).isAfter(dayjs().add(-2, 'hours')) ? (
                <Badge yellow>Recently</Badge>
              ) : (
                <Badge red>Ended</Badge>
              )}
              <span className="text-sm text-gray-500 dark:text-neutral-400">
                Ended {getLastActive(session.endedAt)}
              </span>
            </div>
          </>
        ) : (
          <>
            {session.location && (
              <LocationTag
                location={session.location}
                locationName={session.locationName}
              />
            )}
            <div className="flex gap-2">
              {dayjs(session.createdAt).isBefore(dayjs()) ? (
                <>
                  <Badge green>Active</Badge>
                  <span className="text-sm text-gray-500 dark:text-neutral-400">
                    Started {session.lastActive}
                  </span>
                </>
              ) : (
                <>
                  <Badge blue>Planned</Badge>
                  <span className="text-sm text-gray-500 dark:text-neutral-400">
                    Starts today at {dayjs(session.createdAt).format('HH:mm')}
                  </span>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Link>
  );
};
