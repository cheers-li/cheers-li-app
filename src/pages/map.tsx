import { Select } from '~/components/select';
import { MapPinIcon } from '@heroicons/react/24/solid';
import Navigation from '~/components/navigation';
import TagList from '~/components/tag-list';
import { useCallback, useState } from 'react';
import { useSessions, Tag } from '~/services/session';
import { useEffectOnce } from 'react-use';
import { Geolocation } from '@capacitor/geolocation';
import clsx from 'clsx';
import store from '~/store';

const safePadTop = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue('--sat'),
);

const MapView = () => {
  const [activeTag, setActiveTag] = useState<Tag>();
  const { data: sessions } = useSessions(10, true);
  const [zoomCoords, setZoomCoords] = useState<[number, number]>();
  const [position, setPosition] =
    store.useState<[number, number]>('userPosition');
  const [showMap, setShowMap] = store.useState<boolean>('showMap');

  const updateActiveTag = (tag: Tag) => {
    setActiveTag(tag === activeTag ? undefined : tag);
  };

  const filteredSessions = useCallback(() => {
    if (!sessions) return [];
    if (!activeTag) return sessions.list;

    return sessions.list.filter((s) => s.sessionTag === activeTag?.id);
  }, [activeTag, sessions]);

  const zoomOnSession = (sessionId: string) => {
    if (!sessionId) {
      setZoomCoords(position);
      return;
    }

    const session = sessions?.list.find((s) => s.id === sessionId);
    if (!session || !session.location) return;

    setZoomCoords([
      session.location.coordinates[1],
      session.location.coordinates[0],
    ]);
  };

  const fetchData = async () => {
    const pos = await Geolocation.getCurrentPosition();
    setPosition([pos.coords.longitude, pos.coords.latitude]);
    setShowMap(true);
  };

  useEffectOnce(() => {
    fetchData();

    return () => {
      setShowMap(false);
    };
  });

  return (
    <>
      <Navigation />
      <div className="relative z-10 w-full pt-safe-top">
        <div
          className={clsx('space-y-3 px-6 pt-0', {
            'mt-2': safePadTop < 47,
          })}
        >
          <Select
            leftIcon={
              <MapPinIcon className="h-5 w-5 text-sky-400" aria-hidden="true" />
            }
            options={filteredSessions().map((s) => ({
              value: s.id,
              display: s.user.username,
            }))}
            onUpdate={zoomOnSession}
            defaultValue=""
          >
            <option value="user">Your position 📍</option>
          </Select>
          <TagList
            inline
            displayAll
            activeTag={activeTag}
            setActiveTag={updateActiveTag}
          />
        </div>
      </div>
    </>
  );
};

export default MapView;
