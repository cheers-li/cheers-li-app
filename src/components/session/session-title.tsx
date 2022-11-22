import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Session } from '~/services/session';
import store from '~/store';
import { Avatar } from '~/components/avatar';
import { LocationTag } from '~/components/location-tag';

interface SessionTitleProps {
  session: Session;
}
enum ImageHeight {
  Small = 'calc(100vh/3)',
  Tall = '500px',
}

export const SessionTitle: FC<SessionTitleProps> = ({ session }) => {
  const navigate = useNavigate();
  const [dark] = store.useState<boolean>('dark');

  const gradient = dark
    ? 'linear-gradient(0deg, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 62%)'
    : 'linear-gradient(0deg, rgba(249,250,251,1) 5%, rgba(249,250,251,0) 62%)';

  const [imageHeight, setImageHeight] = useState(ImageHeight.Small);
  const toggleHeight = () => {
    if (imageHeight === ImageHeight.Tall) {
      setImageHeight(ImageHeight.Small);
    } else {
      setImageHeight(ImageHeight.Tall);
    }
  };

  return (
    <>
      <div
        className="flex h-full w-full flex-col justify-between bg-cover bg-center pt-safe-top pb-2 text-black transition-all dark:text-white"
        style={{
          backgroundImage: `${gradient},
              linear-gradient(0deg, rgba(0,0,0,0) 80%, rgba(0,0,0,0.4) 100%),
              url(${session.imageUrl || '/splash.png'})`,
          height: imageHeight,
        }}
        onClick={toggleHeight}
      >
        <div className="flex items-center justify-between px-4 pt-2 text-white">
          <button
            onClick={() => navigate('/')}
            className="rounded-full bg-gray-800 bg-opacity-50 p-2"
          >
            <ChevronDownIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 px-8">
        <h2 className="flex flex-col items-start justify-center text-xl font-medium">
          {session.name}
        </h2>
        <Link
          to={`/profiles/${session.user.id}`}
          className="flex items-center gap-2 text-sm text-gray-500"
        >
          <Avatar profile={session.user} size={9} />
          Created by {session.user.username}
        </Link>
        {session.location && (
          <LocationTag
            location={session.location}
            locationName={session.locationName}
          />
        )}
      </div>
    </>
  );
};
