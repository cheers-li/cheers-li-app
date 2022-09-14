import { Select } from '~/components/select';
import { Bars2Icon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';
import Navigation from '~/components/navigation';
import store from '~/store';
import MapContainer from '~/components/map/map-container';
import TagList from '~/components/tag-list';
import { useState } from 'react';
import { TagModel } from '~/services/session';

const MapView = () => {
  const [isOpen, setIsOpen] = store.useState('menuOpen');
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [activeTag, setActiveTag] = useState<TagModel>();

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
                  className="h-5 w-5 text-sky-400"
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
          <TagList inline activeTag={activeTag} setActiveTag={setActiveTag} />
        </div>
      </div>
    </>
  );
};

export default MapView;
