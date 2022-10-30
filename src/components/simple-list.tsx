import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { FC, ReactNode } from 'react';

interface SimpleListProps {
  listItems: SimpleListItem[];
}

interface SimpleListItem {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}

export const SimpleList: FC<SimpleListProps> = ({ listItems }) => {
  return (
    <ul className="rounded-md bg-white dark:bg-neutral-900">
      {listItems.map((item, i) => (
        <li
          key={i}
          onClick={item.onClick}
          className="flex justify-between border-b border-gray-100 px-4 py-3 last:border-none dark:border-neutral-800"
        >
          <span className="mr-2 h-6 w-6">{item.icon}</span>
          <span className="flex-1">{item.label}</span>
          <ChevronRightIcon className="h-6 w-6" />
        </li>
      ))}
    </ul>
  );
};