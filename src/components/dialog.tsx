import { Transition } from '@headlessui/react';
import { FC, Fragment } from 'react';
import { Dialog as DialogUI } from '@headlessui/react';

interface DialogProps {
  isShowing?: boolean;
  children: React.ReactNode;
  closeModal: () => void;
  padding?: string;
}

export const Dialog: FC<DialogProps> = ({
  isShowing = true,
  children,
  closeModal,
  padding = 'p-4',
}) => {
  return (
    <Transition appear show={isShowing} as={Fragment}>
      <DialogUI as="div" className="relative z-20" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200 delay-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-sky-800 bg-opacity-30 dark:bg-neutral-800 dark:bg-opacity-30 dark:backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="transform ease-out duration-200 transition delay-100"
            enterFrom="translate-y-16 opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition ease-in"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-16 opacity-0"
          >
            <DialogUI.Panel
              className={`${padding} mt-32 rounded-t-lg bg-gray-50 drop-shadow-md transition-all dark:bg-black`}
              style={{ height: 'calc(100% - 8rem)' }}
            >
              {children}
            </DialogUI.Panel>
          </Transition.Child>
        </div>
      </DialogUI>
    </Transition>
  );
};
