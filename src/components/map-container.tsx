import { useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import mapboxgl from '../services/mapbox';

const MapContainer = () => {
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
    map.current?.setCenter([pos.coords.longitude, pos.coords.latitude]);
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    map.current?.on('style.load', () => {
      map.current?.setFog({}); // Set the default atmosphere style
    });

    getCurrentPosition();
  });

  return <div ref={mapContainer} className="map-container h-full w-full"></div>;
};

export default MapContainer;
