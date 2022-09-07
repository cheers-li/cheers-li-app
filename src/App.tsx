import { Suspense, useEffect, useState } from 'react';
import { useRoutes, useLocation, useNavigate } from 'react-router-dom';
import routes from '~react-pages';
import AppUrlListener from './AppUrlListener';
import { supabase } from './services/supabase-client';

const publicPages = [
  '/welcome',
  '/login',
  '/register',
  '/email-login',
  '/login-callback',
];

export default function App() {
  const [session, setSession] = useState(supabase.auth.session());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('Auth State Changes');
      setSession(newSession);
    });

    const path = location.pathname;

    if (!session && !publicPages.includes(path)) {
      navigate('/welcome');
    }
  }, [session, location, setSession, navigate]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AppUrlListener />
      <div className="flex h-screen w-screen bg-gray-50 py-8">
        {useRoutes(routes)}
      </div>
    </Suspense>
  );
}
