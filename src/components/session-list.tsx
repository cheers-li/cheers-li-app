import { useAsync } from 'react-use';
import { getLastActive } from '~/helper/time';
import { listSessions, Session } from '~/services/session';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { LocationTag } from './location-tag';

export const SessionList = () => {
  const sessions = useAsync(() => listSessions(4));

  return (
    <ul>
      {sessions.value?.map((session: Session, i: number) => (
        <li key={i} className="border-b last:border-0">
          <a
            href={`/sessions/${session.id}`}
            className="flex items-center justify-start gap-2 py-3 px-8"
          >
            <Avatar profile={session.user} size={12} />
            <div className="max-2-full flex flex-col items-start justify-start gap-1 overflow-hidden">
              <span className="text-md max-w-full truncate font-medium">
                {session.name}
              </span>

              {session.hasEnded ? (
                <>
                  <div className="flex gap-2">
                    <Badge red>Ended</Badge>
                    <span className="text-sm text-gray-500">
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
                    <span className="text-sm text-gray-500">
                      Started {session.lastActive}
                    </span>
                  </div>
                </>
              )}
            </div>
          </a>
        </li>
      ))}

      {sessions.value?.length === 0 && (
        <li className="flex items-center justify-start gap-2 py-3 px-8 text-sm text-gray-500">
          It appears that you do not have any session
        </li>
      )}

      {sessions.loading && (
        <li className="flex items-center justify-start gap-2 py-3 px-8 text-sm text-gray-500">
          We are loading your sessions
        </li>
      )}
    </ul>
  );
};
