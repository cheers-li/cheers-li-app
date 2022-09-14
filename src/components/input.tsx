import clsx from 'clsx';

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  disabled?: boolean;
  label: string;
  error?: string;
  onUpdate: (value: string) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  disabled,
  onUpdate,
  ...rest
}) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm text-gray-500">{label}</span>
    <input
      onChange={(e) => onUpdate(e.target.value)}
      className={clsx(
        'border-1 rounded-md border-gray-500 px-4 py-3 placeholder:text-gray-400',
        {
          'border-red-500': error,
          'bg-gray-100 text-gray-400': disabled,
        },
      )}
      {...rest}
    />
    {error && error !== '' && (
      <span className="text-sm text-red-500">{error}</span>
    )}
  </label>
);
