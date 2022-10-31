import { ElementType, FC } from 'react';
import { RingLoader } from '~/components/loaders/ring';
import { ListItem } from '~/types/List';

export interface ListProps<T> {
  title: string;
  titleContent?: React.ReactNode;
  loading: boolean;
  items: T[];
  count: number;
  ItemComponent: ElementType;
  horizontalPadding?: string;
}

export const List: FC<ListProps<ListItem>> = ({
  title,
  titleContent,
  loading,
  count,
  items,
  ItemComponent,
  horizontalPadding = 'px-8',
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`${horizontalPadding} flex items-center justify-between text-gray-800 dark:text-neutral-200`}
      >
        <h2>
          {title}{' '}
          {loading ? (
            <RingLoader size={20} className="ml-2 pt-1" />
          ) : (
            `(${count})`
          )}
        </h2>
        {titleContent}
      </div>
      <ul>
        {items.map((item: ListItem, i: number) => (
          <li
            key={i}
            className="border-b last:border-0 dark:border-neutral-800"
          >
            <ItemComponent item={item} />
          </li>
        ))}
      </ul>

      {/* Spacer */}
      {!loading && items.length !== 0 && <div className="py-8"></div>}

      {!loading && items.length === 0 && (
        <div className="pb-64">
          <div
            className={`${horizontalPadding} mx-4 rounded-2xl bg-gray-100 py-3 text-center  text-sm text-gray-600 dark:bg-neutral-800 dark:text-neutral-300`}
          >
            <div className="font-semibold">No {title} found</div>
            <div>You do not have any {title}</div>
          </div>
        </div>
      )}
      {loading && (
        <div
          className={`${horizontalPadding} mx-4 rounded-2xl bg-gray-100 py-3 text-center text-sm text-gray-600 dark:bg-neutral-800 dark:text-neutral-300`}
        >
          <div className="font-semibold">Loading {title}</div>
          <div>Your {title} are loaded</div>
        </div>
      )}
    </div>
  );
};
