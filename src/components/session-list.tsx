import { useAsync } from 'react-use';
import { getLastActive } from '~/helper/time';
import { getUserId } from '~/services/profile';
import { hasEnded, listSessions, Session } from '~/services/session';
import { Badge } from './badge';

export const SessionList = () => {
  const sessions = useAsync(() => listSessions(getUserId()));

  return (
    <ul className="border-t">
      {sessions.value?.map((session: Session, i: number) => (
        <li key={i}>
          <a
            href={`/sessions/${session.id}`}
            className="flex items-center justify-start gap-2 border-b py-3 px-8"
          >
            <div className="flex flex-col items-start justify-start">
              <span className="text-md font-medium">
                {session.name}
                <span className="ml-2 text-sm text-gray-500">
                  {session.user.username}
                </span>
              </span>

              {hasEnded(session.endedAt) ? (
                <>
                  <span>Ended {getLastActive(session.endedAt)}</span>
                  <Badge red>Ended</Badge>
                </>
              ) : (
                <>
                  <span>Started {session.lastActive}</span>
                  <Badge green>Active</Badge>
                </>
              )}
            </div>
          </a>
        </li>
      ))}

      {sessions.value?.length === 0 && (
        <li className="flex items-center justify-start gap-2 border-b py-3 px-8 text-sm text-gray-500">
          It appears that you do not have any session
        </li>
      )}

      {sessions.loading && (
        <li className="flex items-center justify-start gap-2 border-b py-3 px-8 text-sm text-gray-500">
          We are loading your sessions
        </li>
      )}
    </ul>
  );
};
