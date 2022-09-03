import classNames from 'classnames';

interface SelectProps {
  label?: string;
  defaultValue?: string;
  leftIcon?: React.ReactNode;
  options: string[];
  onUpdate: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  defaultValue,
  leftIcon,
  options,
  onUpdate,
}) => {
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
          onChange={(e) => onUpdate(e.target.value)}
          id="location"
          name="location"
          className={classNames(
            'flex-1 rounded-md border-0 py-2 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500',
            {
              'mt-1': label,
              'pl-12': leftIcon,
              'pl-3': !leftIcon,
            },
          )}
          defaultValue={defaultValue}
        >
          {options.map((option) => (
            <option key={option} value={option}>
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
