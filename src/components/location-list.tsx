import clsx from 'clsx';
import { SyntheticEvent, useEffect, useState } from 'react';
import { TagItem } from '~/components/tag-item';
import { sendSuccessFeedback } from '~/services/haptics';
import { getNearbyAddress, getNearbyPlaces } from '~/services/locations';
import { Location, Tag } from '~/services/session';
import { Dialog } from '~/components/dialog';
import { Button } from '~/components/button';
import { Input } from '~/components/input';

interface LocationListProp {
  selectedDrink?: Tag;
  inline?: boolean;
  activeTag?: Tag;
  location?: Location;
  setActiveTag: React.Dispatch<React.SetStateAction<Tag | undefined>>;
}

export const LocationList: React.FC<LocationListProp> = ({
  selectedDrink,
  inline,
  activeTag,
  location,
  setActiveTag,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [error, setError] = useState('');
  const [customLocationName, setCustomLocationName] = useState('');
  const useCustomLocation = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (!customLocationName || customLocationName === '') {
      setError('The location name cannot be empty.');
      return;
    }

    const customLocation: Tag = {
      id: Date.now(),
      type: 'custom',
      emoji: '📍',
      name: customLocationName,
    };

    setTags([customLocation, ...tags]);
    setActiveTag(customLocation);
    setIsDialogOpen(false);
  };

  const loadTags = async () => {
    let placesNearby = [];
    let addressesNearby = [];

    if (location || !selectedDrink) {
      setLoading(true);
      placesNearby = await getNearbyPlaces(selectedDrink?.type, location);
      addressesNearby = await getNearbyAddress(location);
      setLoading(false);
    }

    const data = [...placesNearby, ...addressesNearby];

    setTags(data);
  };

  useEffect(() => {
    loadTags();
  }, [selectedDrink]);

  const tagClicked = (tag: Tag) => {
    if (tag !== activeTag) {
      setActiveTag(tag);
      sendSuccessFeedback();
    }
  };

  return (
    <>
      <ul
        className={clsx({
          'tags-column space-y-2': !inline,
          'remove-scrollbar flex items-center space-x-4 overflow-x-auto':
            inline,
        })}
      >
        {loading && (
          <li
            className={clsx({
              'mr-2 inline-flex max-w-half': !inline,
            })}
          >
            <TagItem active={false}>
              <span className="ml-2">Loading</span>
            </TagItem>
          </li>
        )}
        {tags
          ?.sort((a, b) => a.id - b.id)
          .map((tag) => (
            <li
              key={tag.id}
              className={clsx({
                'mr-2 inline-flex': !inline,
              })}
            >
              <TagItem
                active={activeTag?.id === tag.id}
                onClick={() => tagClicked(tag)}
              >
                {tag.emoji}
                <span className="ml-2">
                  {tag.name.split(',')[0].split(':')[0]}
                </span>
              </TagItem>
            </li>
          ))}
      </ul>
      <a
        className="text-sm text-sky-600"
        onClick={() => setIsDialogOpen(!isDialogOpen)}
      >
        Enter Manually
      </a>

      <Dialog
        isShowing={isDialogOpen}
        closeModal={() => setIsDialogOpen(false)}
      >
        <div className="flex w-full flex-col gap-6 pt-8 pb-24">
          <h2 className="text-2xl font-bold">Enter Location Name</h2>
          <span className="text-sm text-gray-500 dark:text-neutral-400">
            Your friends will see your custom location name. On the map they
            will see your current GPS location.
          </span>
          <div className="flex flex-col gap-6">
            <Input
              placeholder="Here or there"
              label="Location Name"
              value={customLocationName}
              error={error}
              onUpdate={setCustomLocationName}
            />
            <Button primary onClick={useCustomLocation}>
              Set Location Name
            </Button>
          </div>
          <Button secondary onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
        </div>
      </Dialog>
    </>
  );
};
