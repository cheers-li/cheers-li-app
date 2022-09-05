import { useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import mapboxgl, { add3DBuildingsLayer } from '../services/mapbox';

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

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
      pitch: 45,
      bearing: -17.6,
    });

    map.current?.on('style.load', () => {
      map.current?.setFog({}); // Set the default atmosphere style
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
