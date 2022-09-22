import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { TagItem } from '~/components/tag-item';
import { sendSuccessFeedback } from '~/services/haptics';
import { getNearbyPlaces } from '~/services/locations';
import { Location, Tag } from '~/services/session';

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
  const [tags, setTags] = useState<Tag[]>();
  const [loading, setLoading] = useState(false);

  const loadTags = async () => {
    let placesNearby = [];

    if (location || !selectedDrink) {
      setLoading(true);
      placesNearby = await getNearbyPlaces(selectedDrink?.type, location);
      setLoading(false);
    }

    let data = [
      ...placesNearby,
      {
        id: 12,
        name: 'Hide',
        emoji: '🫣',
        type: 'hidden',
      },
    ];

    if (location) {
      data = [
        ...data,
        {
          id: 10,
          name: 'GPS',
          emoji: '🛰',
          type: 'other',
        },
        {
          id: 11,
          name: 'Home',
          emoji: '🏡',
          type: 'home',
        },
      ];
    }

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
          'tags-inline flex items-center space-x-4 overflow-x-auto': inline,
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
    </>
  );
};
