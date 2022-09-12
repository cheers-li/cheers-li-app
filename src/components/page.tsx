import Navigation from './navigation';

interface PageProps {
  children: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({ children }) => (
  <>
    <Navigation />
    <div className="flex w-full flex-col gap-6 py-8 px-8">{children}</div>
  </>
);
