import { FC, Suspense, useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import routes from '~react-pages';
import AppUrlListener from '~/AppUrlListener';
import { useDarkMode } from '~/helper/dark';

const publicPages = [
  '/welcome',
  '/login',
  '/register',
  '/email-login',
  '/login-callback',
  '/confirm-email',
];

interface AppProps {
  isAuthenticated: boolean | undefined;
}

const App: FC<AppProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (isAuthenticated === false && !publicPages.includes(path)) {
      navigate('welcome');
    }
  }, [isAuthenticated, navigate]);

  const darkMode = useDarkMode();
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AppUrlListener />
      <div
        className="h-screen w-screen overflow-auto bg-gray-50 text-black dark:bg-black dark:text-white"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {useRoutes(routes)}
      </div>
    </Suspense>
  );
};

export default App;
