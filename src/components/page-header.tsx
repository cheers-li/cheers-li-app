import clsx from 'clsx';
import { ReactNode } from 'react';

interface PageHeaderProps {
  children: ReactNode;
  truncate?: boolean;
  RightComponent?: ReactNode;
  LeftComponent?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  children,
  RightComponent,
  LeftComponent,
  truncate = true,
}) => {
  return (
    <>
      <div className="flex items-center justify-between gap-4 px-4">
        <div className="w-10">{LeftComponent || <span>&nbsp;</span>}</div>
        <h1
          className={clsx('flex-1 text-center text-3xl font-bold', {
            truncate: truncate,
          })}
        >
          {children}
        </h1>
        <div className="w-10">{RightComponent || <span>&nbsp;</span>}</div>
      </div>
      <hr className="my-6 dark:border-neutral-800" />
    </>
  );
};
