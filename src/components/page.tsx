import clsx from 'clsx';
import Navigation from './navigation';

interface PageProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
  noPadding?: boolean;
  noGap?: boolean;
}

export const Page: React.FC<PageProps> = ({
  children,
  hideNavigation = false,
  noPadding = false,
  noGap = false,
}) => (
  <>
    <div
      className={clsx({
        'pt-safe-top': !noPadding,
      })}
    >
      <div
        className={clsx('flex w-full flex-col pb-24', {
          'pt-6': !noPadding,
          'gap-6 ': !noGap,
        })}
      >
        {children}
      </div>
    </div>
    {!hideNavigation && <Navigation />}
  </>
);
