import clsx from 'clsx';
import { TagItem } from '~/components/tag-item';
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

  return (
    <>
      <ul
        className={clsx({
          'tags-column space-y-2': !inline,
          'tags-inline flex items-center space-x-4 overflow-x-auto': inline,
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
              onClick={() => setActiveTag(tag)}
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
