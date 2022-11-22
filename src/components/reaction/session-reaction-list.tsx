import { FC, Fragment, useCallback, useState } from 'react';
import { Reaction, useSessionReactions } from '~/services/reactions';
import { CreateSessionReaction } from '~/components/reaction/create-session-reactions';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Transition } from '@headlessui/react';

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
  const [openReaction, setOpenReaction] = useState<Reaction | undefined>();

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
              key={reaction.id}
              className="flex h-20 w-20 flex-shrink-0  flex-col items-center justify-center gap-1 transition-all"
              onTouchStart={() => setOpenReaction(reaction)}
              onTouchEnd={() => setOpenReaction(undefined)}
            >
              <img
                className="h-full w-full rounded-full object-cover"
                src={reaction.imageUrl}
              />
              <Link
                className="w-20 truncate rounded-full px-3 text-center"
                to={`/profiles/${reaction.profile.id}`}
              >
                {reaction.profile.username}
              </Link>
            </div>
          ))}
      </div>

      <Transition appear show={openReaction !== undefined} as={Fragment}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200 delay-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-md"
            onClick={() => setOpenReaction(undefined)}
          >
            {openReaction && (
              <>
                <img className="w-full" src={openReaction.imageUrl} />
                <p className="py-4 text-white">
                  Reaction from {openReaction.profile.username}
                </p>
              </>
            )}
          </div>
        </Transition.Child>
      </Transition>

      {showAddButton && !hasSubmittedReaction() && (
        <CreateSessionReaction
          sessionId={sessionId}
          profileId={profileId}
          refetch={refetch}
        />
      )}
    </div>
  );
};
