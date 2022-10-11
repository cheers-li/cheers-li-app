import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';

interface DropdownProps {
  button: React.ReactNode;
  children: React.ReactNode[];
}

export default function Dropdown({ button, children }: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>{button}</Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg focus:outline-none dark:divide-neutral-300 dark:divide-opacity-25 dark:bg-neutral-700 dark:bg-opacity-60 dark:text-white dark:backdrop-blur-md">
          {children?.filter(Boolean).map((child, index) => (
            <Menu.Item key={index}>
              {({ active }) => (
                <div
                  className={clsx(
                    active
                      ? 'bg-gray-100 text-gray-900 dark:bg-white dark:bg-opacity-30'
                      : 'text-gray-700',
                    'group px-4 py-3 text-sm first:rounded-t-md last:rounded-b-md dark:text-white',
                  )}
                >
                  {child}
                </div>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
