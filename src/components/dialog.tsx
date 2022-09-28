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
    enter="transform ease-out duration-200 transition"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="transition ease-in duration-100 delay-100"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
    className="absolute top-0 left-0 z-10 h-full w-full bg-sky-900 bg-opacity-30 pt-20"
  >
    <Transition
      appear={true}
      show={isShowing}
      enter="transform ease-out duration-200 transition delay-100"
      enterFrom="translate-y-16 opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition ease-in"
      leaveFrom="translate-y-0 opacity-100"
      leaveTo="translate-y-16 opacity-0"
      className="h-full rounded-t-lg bg-gray-50 p-4 drop-shadow-md"
    >
      {children}
    </Transition>
  </Transition>
);
