import { ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { FC, ReactNode } from 'react';

interface SimpleListProps {
  listItems: SimpleListItem[];
}

interface SimpleListItem {
  label: string;
  icon: ReactNode;
  type: ListItemType;
  isLink?: boolean;
  link?: string;
  onClick?: () => void;
}

export enum ListItemType {
  Default,
  Error,
}

export const SimpleList: FC<SimpleListProps> = ({ listItems }) => {
  return (
    <ul className="rounded-md bg-white dark:bg-neutral-900">
      {listItems.map((item, i) => (
        <li
          key={i}
          className={clsx('border-b border-gray-100 last:border-none', {
            'text-red-500': item.type === ListItemType.Error,
          })}
        >
          <a
            href={item.isLink ? item.link : undefined}
            onClick={item.onClick}
            className="flex justify-between  px-4 py-3 dark:border-neutral-800"
          >
            <span className="mr-2 h-6 w-6">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.type === ListItemType.Default && (
              <ChevronRightIcon className="h-6 w-6" />
            )}
          </a>
        </li>
      ))}
    </ul>
  );
};
