import clsx from 'clsx';
import { useState } from 'react';
import { TagItem } from '~/components/tag-item';
import { sendSuccessFeedback } from '~/services/haptics';
import { Tag, useSessionTags } from '~/services/session';

interface TagListProps {
  inline?: boolean;
  displayAll?: boolean;
  activeTag?: Tag;
  setActiveTag: (tag: Tag) => void;
}

const TagList: React.FC<TagListProps> = ({
  inline,
  displayAll = false,
  activeTag,
  setActiveTag,
}) => {
  const tags = useSessionTags();
  const [showMore, setShowMore] = useState(false);

  const tagClicked = (tag: Tag) => {
    setActiveTag(tag);

    if (tag !== activeTag) {
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
        {tags.slice(0, showMore || displayAll ? undefined : 6).map((tag) => (
          <li
            key={tag.id}
            className={clsx({
              'mr-2 inline-flex max-w-half': !inline,
            })}
          >
            <TagItem
              active={activeTag?.id === tag.id}
              onClick={() => tagClicked(tag)}
            >
              {tag.emoji}
              <span className="ml-2">{tag.name}</span>
            </TagItem>
          </li>
        ))}
      </ul>

      {!displayAll && (
        <a
          className="text-sm text-sky-600"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'Show less' : 'Show more'}
        </a>
      )}
    </>
  );
};

export default TagList;
