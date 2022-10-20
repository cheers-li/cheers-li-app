import clsx from 'clsx';
import Navigation from './navigation';

interface PageProps {
  children: React.ReactNode;
  header?: JSX.Element;
  hideNavigation?: boolean;
  noPadding?: boolean;
  noGap?: boolean;
}

export const Page: React.FC<PageProps> = ({
  children,
  header,
  hideNavigation = false,
  noPadding = false,
  noGap = false,
}) => (
  <>
    <div
      className={clsx('relative overflow-hidden', {
        'pt-safe-top': !noPadding,
      })}
    >
      {header && (
        <div className="fixed z-10 my-6 w-full bg-gray-50">{header}</div>
      )}
      <div
        className={clsx('mt-6 flex w-full flex-col pt-28 pb-24', {
          'pt-30': !noPadding,
          'gap-6 ': !noGap,
        })}
      >
        {children}
      </div>
    </div>
    {!hideNavigation && <Navigation />}
  </>
);
