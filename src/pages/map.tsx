import Navigation from '~/components/navigation';
import { useState } from 'react';
import { Session } from '~/services/session';
import { useEffectOnce } from 'react-use';
import { Geolocation } from '@capacitor/geolocation';
import clsx from 'clsx';
import store from '~/store';
import FriendTags from '~/components/map/friend-tags';

const safePadTop = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue('--sat'),
);

const MapView = () => {
  const [activeSession, setActiveSession] = useState<Session>();
  const [zoomCoords, setZoomCoords] =
    store.useState<[number, number]>('zoomPosition');
  const [_p, setPosition] = store.useState<[number, number]>('userPosition');
  const [_m, setShowMap] = store.useState<boolean>('showMap');

  const updateActiveSession = (session: Session) => {
    setActiveSession(session === activeSession ? undefined : session);
    zoomOnSession(session);
  };

  const zoomOnSession = (session: Session) => {
    if (!session.location) return;

    // Don't move if tag is unselected
    if (
      session.location.coordinates[0] === zoomCoords[1] &&
      session.location.coordinates[1] === zoomCoords[0]
    ) {
      setZoomCoords([]);
      return;
    }

    // Need to reverse the coords because mapbox use lat,long and we use long,lat
    setZoomCoords(session.location.coordinates.slice().reverse());
  };

  const fetchData = async () => {
    const pos = await Geolocation.getCurrentPosition();
    setPosition([pos.coords.longitude, pos.coords.latitude]);
    setShowMap(true);
  };

  useEffectOnce(() => {
    fetchData();

    // Hide map on component unmount
    return () => {
      setShowMap(false);
    };
  });

  return (
    <>
      <Navigation />
      <div className="fixed top-safe-top z-10 w-full">
        <div
          className={clsx('pt-0', {
            'mt-4': safePadTop < 40,
          })}
        >
          <FriendTags active={activeSession} setActive={updateActiveSession} />
        </div>
      </div>
    </>
  );
};

export default MapView;
