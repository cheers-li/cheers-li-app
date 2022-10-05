import clsx from 'clsx';
import { FC } from 'react';

interface BadgeProps {
  green?: boolean;
  red?: boolean;
  yellow?: boolean;
  children: React.ReactNode;
}

export const Badge: FC<BadgeProps> = ({ children, red, green, yellow }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        { 'bg-red-100 text-red-800 dark:bg-red-200': red },
        { 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200': yellow },
        {
          'bg-green-100 text-green-800 dark:bg-green-200': green,
        },
      )}
    >
      {children}
    </span>
  );
};
