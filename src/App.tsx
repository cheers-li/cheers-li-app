import { Suspense, useEffect } from 'react';
import AppUrlListener from '~/AppUrlListener';
import { useTheme } from '~/helper/theme';
import store from '~/store';
import { User } from '@supabase/supabase-js';
import { useRequests } from '~/services/friends';
import Routes from '~/Routes';
import MapContainer from '~/components/map/map-container';
import { useEffectOnce } from 'react-use';
import { Geolocation } from '@capacitor/geolocation';
import clsx from 'clsx';
import { useSessions } from '~/services/session';

const App = () => {
  const [user] = store.useState<User>('user');
  const [showMap] = store.useState<boolean>('showMap');
  const [position, setPosition] =
    store.useState<[number, number]>('userPosition');
  const [zoomCoords] = store.useState<[number, number]>('zoomPosition');
  const { data: sessions } = useSessions(10, true);

  // Load Global State Data
  useRequests(user?.id);

  const [isDark] = useTheme();
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  async function getPosition() {
    if (!user) return;

    const pos = await Geolocation.getCurrentPosition();
    setPosition([pos.coords.longitude, pos.coords.latitude]);
  }

  useEffect(() => {
    getPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-gray-50 text-black dark:bg-black dark:text-white"></div>
      }
    >
      <AppUrlListener />
      <div
        className="h-screen w-screen overflow-auto bg-gray-50 text-black dark:bg-black dark:text-white"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {/* Map */}
        <div
          className={clsx('absolute inset-0 h-full w-full', {
            'bg-gradient-to-t from-gray-800 to-black': showMap,
            'user-select-none pointer-events-none hidden': !showMap,
          })}
        >
          {user && position && (
            <MapContainer
              position={position}
              zoomCoords={zoomCoords}
              sessions={sessions?.list || []}
              showMap={showMap}
            />
          )}
        </div>
        <Routes />
      </div>
    </Suspense>
  );
};

export default App;
