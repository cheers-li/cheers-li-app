import { FC, Suspense, useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import routes from '~react-pages';
import AppUrlListener from '~/AppUrlListener';
import store from '~/store';

const publicPages = [
  '/welcome',
  '/login',
  '/register',
  '/email-login',
  '/login-callback',
];

interface AppProps {
  isAuthenticated: boolean | undefined;
}

const App: FC<AppProps> = ({ isAuthenticated }) => {
  const [theme, setTheme] = store.useState<string>('theme');
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (isAuthenticated === false && !publicPages.includes(path)) {
      navigate('welcome');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [setTheme]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AppUrlListener />
      <div
        className="h-screen w-screen overflow-auto bg-gray-50 pt-safe-top"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {useRoutes(routes)}
      </div>
    </Suspense>
  );
};

export default App;
