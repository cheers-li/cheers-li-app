import clsx from 'clsx';

interface TagProps {
  active?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => any;
}

export const TagItem: React.FC<TagProps> = ({ active, children, ...rest }) => (
  <button
    type="button"
    className={clsx(
      'inline-flex items-center whitespace-nowrap rounded-full px-4 py-3 font-medium',
      {
        'bg-white text-gray-800 hover:bg-gray-100': !active,
        'bg-sky-100 text-sky-500': active,
      },
    )}
    {...rest}
  >
    {children}
  </button>
);