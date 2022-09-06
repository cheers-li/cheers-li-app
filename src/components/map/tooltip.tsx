import { Friend } from './map-container';

interface TooltipProps {
  user: Friend;
}

const Tooltip = ({ user }: TooltipProps) => {
  return (
    <div>
      {user.name}
      <div>
        <button>Join</button>
        <button>Chat</button>
      </div>
    </div>
  );
};

export default Tooltip;
