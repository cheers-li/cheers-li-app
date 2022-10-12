import clsx from 'clsx';

interface SelectProps {
  customClasses?: string;
  label?: string;
  defaultValue?: string;
  leftIcon?: React.ReactNode;
  options: {
    value: string;
    display: string;
  }[];
  children?: React.ReactNode;
  onUpdate: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  customClasses,
  label,
  defaultValue,
  leftIcon,
  options,
  children,
  onUpdate,
}) => {
  return (
    <>
      {label && (
        <label
          htmlFor={label}
          className="block text-sm font-medium text-gray-700 dark:text-neutral-300"
        >
          {label}
        </label>
      )}
      <div className="relative flex w-full">
        <select
          onChange={(e) => onUpdate(e.target.value)}
          name={label}
          className={clsx(
            `${customClasses} flex-1 rounded-md border-0 bg-white py-4 pr-10 text-base focus:border-sky-500 focus:outline-none focus:ring-sky-500 dark:bg-neutral-800`,
            {
              'mt-1': label,
              'pl-12': leftIcon,
              'pl-3': !leftIcon,
            },
          )}
          defaultValue={defaultValue}
        >
          {children}
          {options.map(({ value, display }) => (
            <option key={value} value={value}>
              {display}
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
