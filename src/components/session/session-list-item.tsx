import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const redirectToProfile = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigate(`/profiles/${session.user.id}`);
  };

  return (
    <Link
      to={`/sessions/${session.id}`}
      className="flex items-center justify-start gap-2 py-3 px-8"
    >
      <button onClick={redirectToProfile} className="flex-shrink-0">
        <Avatar profile={session.user} size={12} />
      </button>
      <div className="flex flex-col items-start justify-start gap-1 overflow-hidden">
        <span className="text-md max-w-full truncate font-medium">
          {session.name}
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
