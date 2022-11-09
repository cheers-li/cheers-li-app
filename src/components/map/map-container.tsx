import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl, { add3DBuildingsLayer } from '~/services/mapbox';
import store from '~/store';
import FriendTooltip from '~/components/map/friend-tooltip';
import { createRoot } from 'react-dom/client';
import FriendMarker from '~/components/map/friend-marker';
import clsx from 'clsx';
import { Session } from '~/services/session';
import { useEffectOnce } from 'react-use';

interface MapContainerProps {
  showMap?: boolean;
  position: [number, number];
  sessions: Session[];
  zoomCoords?: [number, number];
}

const MapContainer = ({
  showMap = false,
  position,
  sessions,
  zoomCoords,
}: MapContainerProps) => {
  const [dark] = store.useState<boolean>('dark');

  // Mapbox
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null);
  const [loaded, setLoaded] = useState(false);

  // User location
  const setCurrentPosition = useCallback(async () => {
    if (!map.current) return;

    setLoaded(false);

    // Center map on user location
    map.current.setCenter(position);

    console.log('set current position', position);

    await map.current.once('idle');
    map.current.resize();
    setLoaded(true);

    // Move User marker
    userMarker?.setLngLat(position);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  const addFriendsMarkers = useCallback(() => {
    if (!map.current) return;

    markers.forEach((m) => m.remove());
    setMarkers([]);

    for (const session of sessions) {
      if (!session.location || !session.location.coordinates.length) continue;

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
      const marker = new mapboxgl.Marker(markerNode)
        .setLngLat([
          session.location.coordinates[1],
          session.location.coordinates[0],
        ])
        .setPopup(
          new mapboxgl.Popup({ offset: 25, className: 'custom-tooltip' }) // add popups
            .setDOMContent(tooltipNode),
        )
        .addTo(map.current);

      setMarkers((prev) => [...prev, marker]);
    }
    // TODO: how to remove this ESLint warning?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions]);

  useEffect(() => {
    addFriendsMarkers();
  }, [addFriendsMarkers, sessions]);

  // Zoom on coords
  useEffect(() => {
    if (!map.current || zoomCoords?.length !== 2) return;
    console.log('zoom coords', zoomCoords);
    map.current?.flyTo({ center: zoomCoords, zoom: 12, duration: 2000 });
  }, [zoomCoords]);

  useEffectOnce(() => {
    if (map.current || !mapContainer.current) return;

    const style = dark ? 'dark-v10' : 'streets-v11';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      projection: { name: 'globe' },
      style: `mapbox://styles/mapbox/${style}`,
      zoom: 13,
      pitch: 45,
      bearing: -17.6,
      attributionControl: false,
      pitchWithRotate: false,
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
      }
    });

    // Create user marker
    const userMarkerDiv = document.createElement('div');
    userMarkerDiv.className = 'user-marker';
    setUserMarker(
      new mapboxgl.Marker(userMarkerDiv).setLngLat(position).addTo(map.current),
    );

    setCurrentPosition();
  });

  useEffect(() => {
    if (!map.current) return;
    console.log('update pos');
    setCurrentPosition();
  }, [position, showMap, setCurrentPosition]);

  return (
    <>
      <div
        ref={mapContainer}
        className={clsx(
          'h-full w-full transform transition-opacity duration-300',
          {
            'pointer-events-none opacity-0': !loaded,
            hidden: !showMap,
          },
        )}
      ></div>
      <div></div>
    </>
  );
};

export default MapContainer;
