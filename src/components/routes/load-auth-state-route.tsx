import clsx from 'clsx';
import { Outlet } from 'react-router-dom';
import store from '~/store';
import MapContainer from '~/components/map/map-container';
import { Geolocation } from '@capacitor/geolocation';
import { useSessions } from '~/services/session';
import { useEffectOnce } from 'react-use';
import { User } from '@supabase/supabase-js';
import { useRequests } from '~/services/friends';

const LoadAuthStateRoute = () => {
  const [user] = store.useState<User>('user');
  const [showMap] = store.useState<boolean>('showMap');
  const [position, setPosition] =
    store.useState<[number, number]>('userPosition');
  const [zoomCoords] = store.useState<[number, number]>('zoomPosition');
  const { data: sessions } = useSessions(10, true);

  async function getPosition() {
    const pos = await Geolocation.getCurrentPosition();
    setPosition([pos.coords.longitude, pos.coords.latitude]);
  }

  // Load Global State Data
  useRequests(user.id);

  useEffectOnce(() => {
    getPosition();
  });

  return (
    <>
      {/* Map */}
      <div
        className={clsx(
          'absolute inset-0 h-full w-full bg-gradient-to-t from-gray-800 to-black',
          {
            hidden: !showMap,
          },
        )}
      >
        {position.length && (
          <MapContainer
            position={position}
            zoomCoords={zoomCoords}
            sessions={sessions?.list || []}
            showMap={showMap}
          />
        )}
      </div>
      <Outlet />
    </>
  );
};

export default LoadAuthStateRoute;
