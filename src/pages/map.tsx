import { useState } from 'react';
import { Select } from '../components/select';
import { Tag } from '../components/tag';
import { Bars2Icon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';
import Navigation from '../components/navigation';
import store from '../store';
import MapContainer from '../components/map-container';

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

  return (
    <>
      <div className="absolute inset-0 h-full w-full">
        <MapContainer />
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
