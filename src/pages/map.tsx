import { useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Select } from '../components/select';
import { Tag } from '../components/tag';
import { Bars2Icon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';
import Navigation from '../components/navigation';
import store from '../store';
import mapboxgl from '../services/mapbox';

const MapView = () => {
  // TODO: take in from db
  const tags = [
    {
      name: 'Beer',
      icon: '🍺',
    },
    {
      name: 'Coffee',
      icon: '☕️',
    },
    {
      name: 'Cocktail',
      icon: '🍸',
    },
    {
      name: 'Sirup',
      icon: '🍹',
    },
  ];

  const [activeTag, setActiveTag] = useState<string>();
  const [isOpen, setIsOpen] = store.useState('menuOpen');
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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

  return (
    <>
      <div className="absolute inset-0 h-full w-full">
        <div ref={mapContainer} className="map-container h-full w-full"></div>
      </div>
      <Navigation />
      <div className="relative w-full">
        <div className="mt-8 space-y-3 px-6">
          <div className="flex justify-between">
            <Select
              leftIcon={
                <MapPinIcon
                  className="h-5 w-5 text-blue-400"
                  aria-hidden="true"
                />
              }
              options={['One', 'Two', 'Three']}
              onUpdate={() => console.log('select value changed')}
            ></Select>
            <button
              onClick={toggleMenu}
              className="ml-4 rounded-md bg-white px-3 py-3"
            >
              <Bars2Icon className="h-8 w-8" aria-hidden="true" />
            </button>
          </div>
          <ul className="flex items-center space-x-4 overflow-x-auto">
            {tags.map((tag) => (
              <li key={tag.name}>
                <Tag
                  active={activeTag === tag.name}
                  onClick={() => setActiveTag(tag.name)}
                >
                  {tag.icon}
                  <span className="ml-2">{tag.name}</span>
                </Tag>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MapView;
