import { Link } from 'react-router-dom';
import { Avatar } from '~/components/avatar';
import { Profile } from '~/services/friends';

interface UserItemProps {
  children?: React.ReactNode;
  friend: Profile;
}

export const UserItem = ({ children, friend }: UserItemProps) => {
  return (
    <li className="flex items-center justify-between border-b py-3">
      <div className="flex items-center justify-start gap-2">
        <Link to={`/profiles/${friend.id}`}>
          <Avatar profile={friend} size={12} />
        </Link>
        <div className="flex flex-col">
          <span className="text-md font-medium">{friend.username}</span>
          <span className="text-sm text-gray-500">
            Last active {friend.lastSeen}
          </span>
        </div>
      </div>
      {children}
    </li>
  );
};
