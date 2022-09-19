import { Transition } from '@headlessui/react';
import { FC } from 'react';

interface DialogProps {
  isShowing?: boolean;
  children: React.ReactNode;
}

export const Dialog: FC<DialogProps> = ({ isShowing = true, children }) => (
  <Transition
    appear={true}
    show={isShowing}
    enter="transform ease-out duration-300 transition"
    enterFrom="translate-y-4 opacity-0"
    enterTo="translate-y-0 opacity-100"
    leave="transition ease-in duration-100"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
    className="absolute top-0 left-0 z-10 h-full w-full bg-sky-900 bg-opacity-30 pt-20"
  >
    <div className="h-full rounded-t-lg bg-gray-50 p-4 drop-shadow-md">
      {children}
    </div>
  </Transition>
);
