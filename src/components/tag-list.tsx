import clsx from 'clsx';
import { TagItem } from '~/components/tag-item';
import { sendSuccessFeedback } from '~/services/haptics';
import { Tag, useSessionTags } from '~/services/session';

interface TagListProps {
  inline?: boolean;
  activeTag?: Tag;
  setActiveTag: React.Dispatch<React.SetStateAction<Tag | undefined>>;
}

const TagList: React.FC<TagListProps> = ({
  inline,
  activeTag,
  setActiveTag,
}) => {
  const tags = useSessionTags();

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
        {tags.map((tag) => (
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
    </>
  );
};

export default TagList;
