import { Friend } from './map-container';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface FriendTooltipProps {
  user: Friend;
}

// TODO: from db
const ago = '1 hour ago';

const FriendTooltip = ({ user }: FriendTooltipProps) => {
  return (
    <>
      <div className="px-4 py-2">
        <div className="text-base font-medium">{user.name}</div>
        <div className="italic text-gray-600">
          Started drinking <span className="font-medium">{ago}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center space-x-4 rounded-b-lg border-t border-t-gray-200 bg-gray-100 px-4 py-2 text-xs">
        <button className="inline-flex items-center justify-between space-x-1 rounded-md border border-sky-600 bg-sky-700 px-4 py-2 text-white hover:bg-sky-800">
          <ArrowTrendingUpIcon className="h-5 w-5" aria-hidden="true" />
          <span>Join</span>
        </button>
        <button className="inline-flex items-center justify-between space-x-1 rounded-md border border-sky-600 bg-sky-700 px-4 py-2 text-white hover:bg-sky-800">
          <ChatBubbleLeftIcon className="h-5 w-5" aria-hidden="true" />
          <span>Chat</span>
        </button>
      </div>
    </>
  );
};

export default FriendTooltip;
