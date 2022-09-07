import { Friend } from './map-container';

interface FriendMarkerProps {
  user: Friend;
}

const FriendMarker = ({ user }: FriendMarkerProps) => {
  return (
    <>
      <div className="relative">
        <img
          className="friend-marker h-10 w-10 rounded-full border-4 border-white"
          src={user.img}
          alt={user.name}
        />
        <div className="absolute left-1/2 bottom-[-6px] -translate-x-1/2 border-x-8 border-t-8 border-b-0 border-solid border-x-transparent border-t-white"></div>
      </div>
    </>
  );
};

export default FriendMarker;
