import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';

export const BackButton = ({ disabled = false }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => (disabled ? undefined : navigate(-1))}>
      <ArrowLeftIcon className="h-6 w-6" />
    </div>
  );
};
