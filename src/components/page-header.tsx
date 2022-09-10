interface PageHeaderProps {
  children: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ children }) => (
  <>
    <h1 className="truncate px-8 text-3xl font-bold">{children}</h1>
    <hr />
  </>
);
