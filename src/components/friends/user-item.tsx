import { Link } from 'react-router-dom';
import { Avatar } from '~/components/avatar';
import { Profile } from '~/services/friends';

interface UserItemProps {
  children?: React.ReactNode;
  item: Profile;
}

export const UserItem = ({ children, item: profile }: UserItemProps) => {
  return (
    <div className="flex items-center justify-start gap-2 py-3 px-8">
      <Link to={`/profiles/${profile.id}`}>
        <Avatar profile={profile} size={12} />
      </Link>
      <div className="flex flex-1 flex-col">
        <span className="text-md font-medium">{profile.username}</span>
        <span className="text-sm text-gray-500">
          Last active {profile.lastSeen}
        </span>
      </div>
      {children}
    </div>
  );
};
