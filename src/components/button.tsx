import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface ButtonProps {
  disabled?: boolean;
  primary?: boolean;
  secondary?: boolean;
  danger?: boolean;
  link?: boolean;
  width?: 'full' | 'default';
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => any;
}

export const Button: React.FC<ButtonProps> = ({
  disabled,
  primary,
  secondary,
  danger,
  link,
  width,
  icon,
  children,
  ...rest
}) => (
  <button
    className={clsx('w-full rounded-md px-8 py-3', {
      'bg-sky-700 text-white active:bg-sky-600': primary && !disabled,
      'bg-sky-100 text-gray-800 active:bg-sky-200': secondary && !disabled,
      'bg-red-500 text-white active:bg-red-600': danger && !disabled,
      'bg-white text-gray-800 active:bg-sky-50': link && !disabled,
      'w-full': width === 'full',
      'bg-gray-300 text-gray-100': disabled,
      'flex flex-row items-center justify-start': icon,
    })}
    disabled={disabled}
    {...rest}
  >
    {icon && (
      <span className="mr-8 h-8 w-8 justify-self-start fill-gray-600">
        {icon}
      </span>
    )}
    {children}
  </button>
);

interface LinkButtonProps extends ButtonProps {
  href: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  children,
  ...rest
}) => (
  <Link to={href}>
    <Button {...rest}>{children}</Button>
  </Link>
);
