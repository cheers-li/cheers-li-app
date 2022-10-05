import clsx from 'clsx';

interface TagProps {
  active?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const TagItem: React.FC<TagProps> = ({ active, children, ...rest }) => (
  <button
    type="button"
    className={clsx(
      'inline-flex items-center whitespace-nowrap rounded-full px-4 py-3 font-medium',
      {
        'bg-white text-gray-800 active:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-300 dark:active:bg-neutral-700':
          !active,
        'bg-sky-100 text-sky-500 dark:bg-sky-400 dark:text-sky-800': active,
      },
    )}
    {...rest}
  >
    {children}
  </button>
);
