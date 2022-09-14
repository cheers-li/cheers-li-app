import { useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import mapboxgl, { add3DBuildingsLayer } from '~/services/mapbox';
import store from '~/store';
import FriendTooltip from '~/components/map/friend-tooltip';
import { createRoot } from 'react-dom/client';
import FriendMarker from '~/components/map/friend-marker';
import fakeData from '~/components/map/fake-data.json';

// TODO: get this from DB
export interface Friend {
  id: string;
  name: string;
  coords: number[];
  img: string;
}
const friends: Friend[] = fakeData;
// for (let i = 0; i < 20; i++) {
//   const resp = await fetch('https://randomuser.me/api/');
//   const { results } = await resp.json();
//   const user = results[0];
//   friends.push({
//     id: user.login.uuid,
//     name: `${user.name.first} ${user.name.last}`,
//     coords: [
//       user.location.coordinates.longitude,
//       user.location.coordinates.latitude,
//     ],
//     img: user.picture.large,
//   });
// }
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
    tooltipRoot.render(<FriendTooltip user={friend} />);

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(markerNode)
      .setLngLat(friend.coords as [number, number])
      .setPopup(
        new mapboxgl.Popup({ offset: 25, className: 'custom-tooltip' }) // add popups
          .setDOMContent(tooltipNode),
      )
      .addTo(map);
  }
};

const MapContainer = () => {
  const [theme] = store.useState('theme');

  // Mapbox
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom] = useState(12);

  // User location
  const getCurrentPosition = async () => {
    const pos = await Geolocation.getCurrentPosition();
    setLat(pos.coords.latitude);
    setLng(pos.coords.longitude);
    const coords: [number, number] = [
      pos.coords.longitude,
      pos.coords.latitude,
    ];

    if (!map.current) return;

    // Center map on user location
    map.current?.setCenter(coords);

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
      center: [lng, lat],
      zoom: zoom,
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

    map.current?.on('click', (e) => {
      console.log([e.lngLat.lng, e.lngLat.lat]);
    });

    getCurrentPosition();
  });

  return <div ref={mapContainer} className="map-container h-full w-full"></div>;
};

export default MapContainer;
