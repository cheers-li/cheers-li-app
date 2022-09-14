import Navigation from './navigation';

interface PageProps {
  children: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({ children }) => (
  <>
    <div className="flex w-full flex-col gap-6 pt-8 pb-24">{children}</div>
    <Navigation />
  </>
);
