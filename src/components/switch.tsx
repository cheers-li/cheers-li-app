import { FC } from 'react';
import { Switch as SwitchUI } from '@headlessui/react';
import clsx from 'clsx';
import { sendSuccessFeedback } from '~/services/haptics';

interface SwitchProps {
  checked: boolean;
  label?: string;
  onUpdate: (checked: boolean) => void;
}

export const Switch: FC<SwitchProps> = ({ checked, label, onUpdate }) => {
  const onchangeListener = (value: boolean) => {
    onUpdate(value);
    sendSuccessFeedback();
  };

  return (
    <SwitchUI.Group as="div" className="flex items-center">
      {label && (
        <SwitchUI.Label as="span">
          <span className="text-base text-gray-900 dark:text-neutral-200">
            {label}
          </span>
        </SwitchUI.Label>
      )}
      <SwitchUI
        checked={checked}
        onChange={onchangeListener}
        className={clsx(
          'relative ml-3 inline-flex h-[28px] w-[50px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
          checked ? 'bg-sky-500' : 'bg-gray-200 dark:bg-neutral-500',
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            'pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-[22px]' : 'translate-x-0',
          )}
        />
      </SwitchUI>
    </SwitchUI.Group>
  );
};
