import { useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import mapboxgl, { add3DBuildingsLayer } from '../services/mapbox';
import store from '../store';

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
    const el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el).setLngLat(coords).addTo(map.current);
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

    getCurrentPosition();
  });

  return <div ref={mapContainer} className="map-container h-full w-full"></div>;
};

export default MapContainer;
