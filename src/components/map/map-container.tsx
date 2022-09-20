import { useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import mapboxgl, { add3DBuildingsLayer } from '~/services/mapbox';
import store from '~/store';
import FriendTooltip from '~/components/map/friend-tooltip';
import { createRoot } from 'react-dom/client';
import FriendMarker from '~/components/map/friend-marker';
import fakeData from '~/components/map/fake-data.json';
import clsx from 'clsx';

// TODO: get this from DB
export interface Friend {
  id: string;
  name: string;
  lat: number;
  lng: number;
  img: string;
}
const friends: Friend[] = fakeData;
// -- END TODO

const addFriendsMarkers = (map: mapboxgl.Map) => {
  for (const friend of friends) {
    // Create marker node
    const markerNode = document.createElement('div');
    const markerRoot = createRoot(markerNode);
    markerRoot.render(<FriendMarker user={friend} />);

    // Create tooltip node
    const tooltipNode = document.createElement('div');
    const tooltipRoot = createRoot(tooltipNode);
    tooltipRoot.render(
      <FriendTooltip user={friend} center={map.getCenter()} />,
    );

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(markerNode)
      .setLngLat([friend.lng, friend.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25, className: 'custom-tooltip' }) // add popups
          .setDOMContent(tooltipNode),
      )
      .addTo(map);
  }
};

const MapContainer = () => {
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

        addFriendsMarkers(map.current);
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
