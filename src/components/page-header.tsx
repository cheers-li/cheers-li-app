import classNames from 'classnames';

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
      className={classNames('px-8 text-3xl font-bold', {
        truncate: truncate,
      })}
    >
      {children}
    </h1>
    <hr />
  </>
);
