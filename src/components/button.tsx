import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface ButtonProps {
  disabled?: boolean;
  primary?: boolean;
  secondary?: boolean;
  danger?: boolean;
  dark?: boolean;
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
  dark,
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
      'bg-gray-800 text-gray-100 active:bg-gray-900': dark && !disabled,
      'w-full': width === 'full',
      'bg-gray-300 text-gray-100': disabled,
      'flex flex-row items-center justify-center gap-8': icon,
    })}
    disabled={disabled}
    {...rest}
  >
    {icon && (
      <span className="h-6 w-6 flex-shrink-0 fill-gray-600">{icon}</span>
    )}
    <span className="whitespace-nowrap">{children}</span>
    {icon && <span className="h-6 w-6 flex-shrink-0 fill-gray-600"></span>}
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
