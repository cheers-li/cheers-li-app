import Navigation from './navigation';

type Props = {
  children: JSX.Element;
};

const Layout: React.FC<Props> = (props) => {
  return (
    <>
      <div className="relative flex min-h-screen w-screen flex-col">
        <Navigation />
        {props.children}
      </div>
    </>
  );
};

export default Layout;
