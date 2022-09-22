import { XCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useRef } from 'react';

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  disabled?: boolean;
  label?: string;
  error?: string;
  cleanable?: boolean;
  leftIcon?: React.ReactNode;
  onUpdate: (value: string) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  disabled,
  cleanable,
  onUpdate,
  ...rest
}) => {
  const inputRef = useRef(null);

  const clearInput = () => {
    if (!inputRef || !inputRef.current) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    inputRef.current.value = '';
    onUpdate('');
  };

  return (
    <label className="relative flex flex-col gap-1">
      {label && <span className="text-sm text-gray-500">{label}</span>}
      <input
        ref={inputRef}
        onChange={(e) => onUpdate(e.target.value)}
        className={clsx(
          'border-1 select-text rounded-md border-gray-500 py-3 placeholder:text-gray-400',
          {
            'border-red-500': error,
            'bg-gray-100 text-gray-400': disabled,
            'pl-12': leftIcon,
            'pl-4': !leftIcon,
            'pr-12': cleanable,
            'pr-4': !cleanable,
          },
        )}
        disabled={disabled}
        {...rest}
      />
      {error && error !== '' && (
        <span className="text-sm text-red-500">{error}</span>
      )}
      {leftIcon && (
        <div className="absolute left-4 top-0 bottom-0 flex items-center justify-center">
          {leftIcon}
        </div>
      )}
      {cleanable && (
        <button
          onClick={clearInput}
          className="absolute right-4 top-0 bottom-0 flex items-center justify-center"
        >
          <XCircleIcon className="h-5 w-5" />
        </button>
      )}
    </label>
  );
};
