import classNames from 'classnames';
import { Tag } from '~/components/tag';
import { TagModel, useSessionTags } from '~/services/session';

interface TagListProps {
  inline?: boolean;
  activeTag?: TagModel;
  setActiveTag: React.Dispatch<React.SetStateAction<TagModel | undefined>>;
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
        className={classNames({
          'tags-column space-y-2': !inline,
          'tags-inline flex items-center space-x-4 overflow-x-auto': inline,
        })}
      >
        {tags.map((tag) => (
          <li
            key={tag.id}
            className={classNames({
              'mr-2 inline-flex max-w-half': !inline,
            })}
          >
            <Tag
              active={activeTag?.id === tag.id}
              onClick={() => setActiveTag(tag)}
            >
              {tag.emoji}
              <span className="ml-2">{tag.name}</span>
            </Tag>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TagList;
