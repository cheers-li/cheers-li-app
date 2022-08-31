import classNames from 'classnames';
import { Link } from 'react-router-dom';

interface ButtonProps {
  disabled?: boolean;
  primary?: boolean;
  secondary?: boolean;
  link?: boolean;
  width?: 'full' | 'default';
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => any;
}

export const Button: React.FC<ButtonProps> = ({
  disabled,
  primary,
  secondary,
  link,
  width,
  children,
  ...rest
}) => (
  <button
    className={classNames('rounded-md px-8 py-3', {
      'bg-indigo-500 text-white': primary && !disabled,
      'bg-indigo-100 text-gray-800': secondary && !disabled,
      'bg-white text-gray-800': link && !disabled,
      'w-full': width === 'full',
      'bg-gray-300 text-gray-100': disabled,
    })}
    {...rest}
  >
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
