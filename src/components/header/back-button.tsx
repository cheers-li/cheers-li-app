import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(-1)}>
      <ArrowLeftIcon className="h-6 w-6" />
    </div>
  );
};
