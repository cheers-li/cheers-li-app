import { FC } from 'react';
import { Link } from 'react-router-dom';
import { getLastActive } from '~/helper/time';
import { Session } from '~/services/session';
import { Avatar } from '../avatar';
import { Badge } from '../badge';
import { LocationTag } from '../location-tag';

interface SessionListItemProps {
  item: Session;
}

export const SessionListItem: FC<SessionListItemProps> = ({
  item: session,
}) => {
  return (
    <Link
      to={`/sessions/${session.id}`}
      className="flex items-center justify-start gap-2 py-3 px-8"
    >
      <Link to={`/profiles/${session.user.id}`}>
        <Avatar profile={session.user} size={12} />
      </Link>
      <div className="flex flex-col items-start justify-start gap-1 overflow-hidden">
        <span className="text-md max-w-full truncate font-medium">
          {session.name}
        </span>

        {session.hasEnded ? (
          <>
            <div className="flex gap-2">
              <Badge red>Ended</Badge>
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
              <Badge green>Active</Badge>
              <span className="text-sm text-gray-500 dark:text-neutral-400">
                Started {session.lastActive}
              </span>
            </div>
          </>
        )}
      </div>
    </Link>
  );
};
