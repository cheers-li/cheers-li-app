import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { FC, ReactNode } from 'react';

interface ListProps {
  listItems: ListItem[];
}

interface ListItem {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}

export const List: FC<ListProps> = ({ listItems }) => {
  return (
    <ul className="rounded-md bg-white">
      {listItems.map((item, i) => (
        <li
          key={i}
          onClick={item.onClick}
          className="flex justify-between border-b border-gray-100 px-4 py-3"
        >
          <span className="mr-2 h-6 w-6">{item.icon}</span>
          <span className="flex-1">{item.label}</span>
          <ChevronRightIcon className="h-6 w-6" />
        </li>
      ))}
    </ul>
  );
};
