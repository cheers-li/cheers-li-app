import { Avatar } from '~/components/avatar';
import { Profile } from '~/services/friends';

interface FriendMarkerProps {
  user: Profile;
}

const FriendMarker = ({ user }: FriendMarkerProps) => {
  return (
    <>
      <div className="relative">
        <Avatar
          profile={user}
          size={10}
          customClasses="friend-marker border-4 border-white"
        />
        <div className="absolute left-1/2 bottom-[-6px] -translate-x-1/2 border-x-8 border-t-8 border-b-0 border-solid border-x-transparent border-t-white"></div>
      </div>
    </>
  );
};

export default FriendMarker;
