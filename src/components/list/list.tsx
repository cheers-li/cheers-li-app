import { ElementType, FC } from 'react';
import { ListItem } from '~/types/List';

interface ListProps<T> {
  title: string;
  titleContent?: React.ReactNode;
  loading: boolean;
  items: T[];
  count: number;
  ItemComponent: ElementType;
}

export const List: FC<ListProps<ListItem>> = ({
  title,
  titleContent,
  loading,
  count,
  items,
  ItemComponent,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-8 text-gray-800">
        <h2>
          {title} {!loading && `(${count})`}
        </h2>
        {titleContent}
      </div>
      <ul>
        {items.map((item: ListItem, i: number) => (
          <li key={i} className="border-b last:border-0">
            <ItemComponent item={item} />
          </li>
        ))}
      </ul>

      {!loading && items.length === 0 && (
        <div className="mx-4 rounded-2xl bg-gray-100 py-3 px-8 text-center text-sm text-gray-600">
          <div className="font-semibold">No {title} found</div>
          <div>You do not have any {title}</div>
        </div>
      )}
      {loading && (
        <div className="mx-4 rounded-2xl bg-gray-100 py-3 px-8 text-center text-sm text-gray-600">
          <div className="font-semibold">Loading {title}</div>
          <div>Your {title} are loaded</div>
        </div>
      )}
    </div>
  );
};
