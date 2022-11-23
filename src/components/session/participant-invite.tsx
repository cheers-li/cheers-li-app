import { User } from '@supabase/supabase-js';
import { FC, useState } from 'react';
import { Button } from '~/components/button';
import { Dialog } from '~/components/dialog';
import store from '~/store';
import { UserItem } from '~/components/friends/user-item';
import { RefreshableList } from '~/components/list/refreshable-list';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  acceptRequestByFriend,
  inviteFriend,
  Participant,
  useParticipants,
} from '~/services/participants';

interface ParticipantInvite {
  sessionId: string;
  refetchList: () => void;
}

export const ParticipantInvite: FC<ParticipantInvite> = ({
  sessionId,
  refetchList,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = store.useState<User>('user');
  const { data, isFetching, refetch } = useParticipants(sessionId, user.id);

  const invite = async (sessionToInviteToId: string, profileId: string) => {
    await inviteFriend(sessionToInviteToId, profileId);
    refetch();
  };
  const accept = async (sessionToJoinId: string, profileId: string) => {
    await acceptRequestByFriend(sessionToJoinId, profileId);
    refetch();
    refetchList();
  };

  return (
    <>
      <Button primary onClick={() => setIsOpen(true)}>
        Invite Participant
      </Button>
      <Dialog isShowing={isOpen} closeModal={() => setIsOpen(false)}>
        <div className="flex w-full justify-between py-4">
          <h2 className="text-2xl font-bold">Invite Friends</h2>
          <button onClick={() => setIsOpen(false)} className="rounded-full p-2">
            <ChevronDownIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="h-[70vh] w-full overflow-y-auto">
          <RefreshableList
            title="Friends"
            loading={isFetching}
            items={data?.list || []}
            count={data?.count || 0}
            horizontalPadding=""
            ItemComponent={({ item }) => (
              <UserItem item={item.profile} horizontalPadding="">
                <InviteButton
                  item={item as Participant}
                  invite={invite}
                  accept={accept}
                />
              </UserItem>
            )}
            reload={refetch}
          />
        </div>
      </Dialog>
    </>
  );
};

interface InviteButtonProps {
  item: Participant;
  invite: (sessionId: string, profileId: string) => Promise<void>;
  accept: (sessionId: string, profileId: string) => Promise<void>;
}

const InviteButton: FC<InviteButtonProps> = ({ item, invite, accept }) => {
  return (
    <>
      {!item.acceptedByHost && !item.acceptedByParticipant && (
        <button
          onClick={() => invite(item.sessionId, item.profile.id)}
          className="-mr-2 p-2"
        >
          <span className="rounded-full bg-sky-200 px-2 py-1 text-xs font-semibold uppercase text-sky-900 active:bg-sky-300">
            Invite
          </span>
        </button>
      )}
      {item.acceptedByHost && !item.acceptedByParticipant && (
        <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold uppercase text-gray-800 dark:bg-neutral-300 dark:text-neutral-900">
          Invited
        </span>
      )}
      {!item.acceptedByHost && item.acceptedByParticipant && (
        <button
          onClick={() => accept(item.sessionId, item.profile.id)}
          className="-mr-2 p-2"
        >
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold uppercase text-yellow-800 dark:bg-yellow-200">
            Requested
          </span>
        </button>
      )}
      {item.acceptedByHost && item.acceptedByParticipant && (
        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold uppercase text-green-800 dark:bg-green-200">
          Joined
        </span>
      )}
    </>
  );
};
