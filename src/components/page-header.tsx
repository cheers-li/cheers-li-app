import clsx from 'clsx';

interface PageHeaderProps {
  children: React.ReactNode;
  truncate?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  children,
  truncate = true,
}) => (
  <>
    <h1
      className={clsx('px-8 text-center text-3xl font-bold', {
        truncate: truncate,
      })}
    >
      {children}
    </h1>
    <hr />
  </>
);
