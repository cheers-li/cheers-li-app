import { useCallback, useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import mapboxgl, { add3DBuildingsLayer } from '~/services/mapbox';
import store from '~/store';
import FriendTooltip from '~/components/map/friend-tooltip';
import { createRoot } from 'react-dom/client';
import FriendMarker from '~/components/map/friend-marker';
import clsx from 'clsx';
import { Session } from '~/services/session';

interface MapContainerProps {
  sessions: Session[];
}

const MapContainer = ({ sessions }: MapContainerProps) => {
  const [theme] = store.useState<string>('theme');

  // Mapbox
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [animated, setAnimated] = useState(true);

  // User location
  const getCurrentPosition = async () => {
    const pos = await Geolocation.getCurrentPosition();
    const coords: [number, number] = [
      pos.coords.longitude,
      pos.coords.latitude,
    ];

    if (!map.current) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    map.current?.flyTo({ center: coords, preloadOnly: true });

    // Center map on user location
    map.current.setCenter(coords);
    await map.current.once('idle');
    setLoaded(true);

    // Zoom in
    map.current?.flyTo({ center: coords, zoom: 12, duration: 5000 });

    setTimeout(() => {
      setAnimated(false);
    }, 2000);

    // Add User marker
    const userMarker = document.createElement('div');
    userMarker.className = 'user-marker';
    new mapboxgl.Marker(userMarker).setLngLat(coords).addTo(map.current);
  };

  const addFriendsMarkers = useCallback(() => {
    if (!map.current) return;

    for (const session of sessions) {
      if (!session.location) continue;

      // Create marker node
      const markerNode = document.createElement('div');
      const markerRoot = createRoot(markerNode);
      markerRoot.render(<FriendMarker user={session.user} />);

      // Create tooltip node
      const tooltipNode = document.createElement('div');
      const tooltipRoot = createRoot(tooltipNode);
      tooltipRoot.render(
        <FriendTooltip session={session} center={map.current.getCenter()} />,
      );

      // make a marker for each feature and add to the map
      new mapboxgl.Marker(markerNode)
        .setLngLat([
          session.location.coordinates[1],
          session.location.coordinates[0],
        ])
        .setPopup(
          new mapboxgl.Popup({ offset: 25, className: 'custom-tooltip' }) // add popups
            .setDOMContent(tooltipNode),
        )
        .addTo(map.current);
    }
  }, [sessions]);

  useEffect(() => {
    addFriendsMarkers();
  }, [addFriendsMarkers, sessions]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const style = theme === 'dark' ? 'dark-v10' : 'streets-v11';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      projection: { name: 'globe' },
      style: `mapbox://styles/mapbox/${style}`,
      zoom: 3,
      pitch: 45,
      bearing: -17.6,
      attributionControl: false,
    });

    map.current?.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(186, 210, 235)', // Lower atmosphere
        'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
      });
    });

    map.current?.on('load', () => {
      if (map.current) {
        add3DBuildingsLayer(map.current);

        addFriendsMarkers();
      }
    });

    getCurrentPosition();
  });

  return (
    <>
      <div
        ref={mapContainer}
        className={clsx(
          'h-full w-full transform transition-opacity duration-300',
          {
            'opacity-0': !loaded,
            'pointer-events-none': animated,
          },
        )}
      ></div>
      <div></div>
    </>
  );
};

export default MapContainer;
