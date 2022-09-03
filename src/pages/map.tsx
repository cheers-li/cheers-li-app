import { useState } from 'react';
import { Select } from '../components/select';
import { Tag } from '../components/tag';
import { Bars2Icon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';
import Navigation from '../components/navigation';

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

  // TODO: add real map
  return (
    <>
      <Navigation />
      <div
        className="h-screen w-screen bg-cover"
        style={{
          backgroundImage: `url(${'https://miro.medium.com/max/1400/1*wdwWv0g8r_uIwR0o7zLHnQ.jpeg'})`,
        }}
      >
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
            <button className="ml-4 rounded-md bg-white px-3 py-3">
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
