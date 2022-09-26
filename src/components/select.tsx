import clsx from 'clsx';

interface SelectProps {
  label?: string;
  defaultValue?: string;
  leftIcon?: React.ReactNode;
  options: string[];
  keys: string[];
  children?: React.ReactNode;
  onUpdate: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  defaultValue,
  leftIcon,
  options,
  keys,
  children,
  onUpdate,
}) => {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(e.target.selectedOptions[0].getAttribute('data-key') || '');
  };

  return (
    <>
      {label && (
        <label
          htmlFor={label}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative flex w-full">
        <select
          onChange={onChange}
          name={label}
          className={clsx(
            'flex-1 rounded-md border-0 py-4 pr-10 text-base focus:border-sky-500 focus:outline-none focus:ring-sky-500',
            {
              'mt-1': label,
              'pl-12': leftIcon,
              'pl-3': !leftIcon,
            },
          )}
          defaultValue={defaultValue}
        >
          {children}
          {options.map((option, i) => (
            <option key={keys[i]} value={option} data-key={keys[i]}>
              {option}
            </option>
          ))}
        </select>
        {leftIcon && (
          <div className="absolute left-4 top-0 bottom-0 flex items-center justify-center">
            {leftIcon}
          </div>
        )}
      </div>
    </>
  );
};
