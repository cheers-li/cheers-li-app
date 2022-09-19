import Navigation from './navigation';

interface PageProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

export const Page: React.FC<PageProps> = ({
  children,
  hideNavigation = false,
}) => (
  <>
    <div className="flex w-full flex-col gap-6 pt-6 pb-24">{children}</div>
    {!hideNavigation && <Navigation />}
  </>
);
