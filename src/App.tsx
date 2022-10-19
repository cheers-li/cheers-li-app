import { FC, Suspense, useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import routes from '~react-pages';
import AppUrlListener from '~/AppUrlListener';
import { useTheme } from '~/helper/theme';
import store from '~/store';
import { User } from '@supabase/supabase-js';
import { getRequests, Profile } from '~/services/friends';
import { ElementList } from '~/types/List';

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
  const [user] = store.useState<User>('user');
  const [_, setRequests] =
    store.useState<ElementList<Profile>>('friendRequests');

  useEffect(() => {
    const path = location.pathname;
    if (isAuthenticated === false && !publicPages.includes(path)) {
      navigate('welcome');
    }
  }, [isAuthenticated, navigate]);

  const isNotPublicPage = !publicPages.includes(location.pathname);

  const loadGlobalData = async () => {
    if (!user) return;
    const req = await getRequests(user.id);
    if (req) {
      setRequests(req);
    }
  };

  useEffect(() => {
    if (isAuthenticated === true && isNotPublicPage) {
      loadGlobalData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isNotPublicPage]);

  const [isDark] = useTheme();
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-gray-50 text-black dark:bg-black dark:text-white"></div>
      }
    >
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
