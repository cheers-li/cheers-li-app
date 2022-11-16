import { FC, useCallback } from 'react';
import { useSessionReactions } from '~/services/reactions';
import { CreateSessionReaction } from '~/components/reaction/create-session-reactions';

interface SessionReactionListProps {
  sessionId: string;
  profileId: string;
  showAddButton?: boolean;
}

export const SessionReactionList: FC<SessionReactionListProps> = ({
  sessionId,
  profileId,
  showAddButton = true,
}) => {
  const { data: reactions, refetch } = useSessionReactions(sessionId);

  const hasSubmittedReaction = useCallback(() => {
    return reactions?.some((reaction) => reaction.profile.id === profileId);
  }, [reactions, profileId]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-medium">Reactions</h2>
      {reactions && reactions.length === 0 && (
        <div className="rounded-2xl bg-gray-100 py-3 text-center text-sm text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
          <div className="font-semibold">Reactions</div>
          <div>There are no reactions yet</div>
        </div>
      )}

      <div className="flex w-full gap-4 overflow-x-auto">
        {reactions &&
          reactions.map((reaction) => (
            <div
              key={reaction.sessionId + reaction.profile.id}
              className="flex flex-col items-center justify-center gap-1"
            >
              <img className="h-20 w-20 rounded-full" src={reaction.imageUrl} />
              <span className="rounded-full bg-gray-200 px-3 dark:bg-gray-800">
                {reaction.profile.username}
              </span>
            </div>
          ))}

        {showAddButton && !hasSubmittedReaction() && (
          <CreateSessionReaction
            sessionId={sessionId}
            profileId={profileId}
            refetch={refetch}
          />
        )}
      </div>
    </div>
  );
};
