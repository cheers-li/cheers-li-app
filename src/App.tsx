import { Suspense, useEffect, useState } from 'react';
import { useRoutes, useLocation, useNavigate } from 'react-router-dom';
import routes from '~react-pages';
import { supabase } from './services/supabase-client';
import store from './store';

const publicPages = ['/welcome', '/login', '/register', '/email-login', '/map'];

export default function App() {
  const [theme, setTheme] = store.useState('theme');

  const [session, setSession] = useState(supabase.auth.session());
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    const path = location.pathname;

    if (!session && !publicPages.includes(path)) {
      navigate('/welcome');
    }
  }, [session, location, setSession, navigate]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="h-screen w-screen bg-gray-50">{useRoutes(routes)}</div>
    </Suspense>
  );
}
