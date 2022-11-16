import { Avatar } from '~/components/avatar';
import { TagItem } from '~/components/tag-item';
import { sendSuccessFeedback } from '~/services/haptics';
import { Session, useSessions } from '~/services/session';

interface FriendTagsProps {
  active?: Session;
  setActive: (session: Session) => void;
}

const FriendTags: React.FC<FriendTagsProps> = ({ active, setActive }) => {
  const { data: sessions } = useSessions(true);

  const sessionClicked = (session: Session) => {
    setActive(session);

    if (session !== active) {
      sendSuccessFeedback();
    }
  };

  return (
    <>
      <ul className="remove-scrollbar flex items-center gap-2 overflow-x-auto px-4">
        {sessions?.list.map((session) => (
          <li key={session.id} className="flex-shrink-0">
            <TagItem
              active={active?.id === session.id}
              onClick={() => sessionClicked(session)}
              small
            >
              <Avatar profile={session.user} size={8} />
              <span className="ml-2">{session.user.username}</span>
            </TagItem>
          </li>
        ))}
      </ul>
    </>
  );
};

export default FriendTags;
