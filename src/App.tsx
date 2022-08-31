import { Suspense, useEffect, useState } from 'react';
import { useRoutes, useLocation, useNavigate } from 'react-router-dom';
import routes from '~react-pages';
import { supabase } from './services/supabase-client';

export default function App() {
  const [session, setSession] = useState(supabase.auth.session());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    const path = location.pathname;

    if (
      !session &&
      !(
        path === '/welcome' ||
        path === '/login' ||
        path === '/register' ||
        path === '/email-login'
      )
    ) {
      navigate('/welcome');
    }
  }, [session, location, setSession, navigate]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="flex h-[100vh] w-[100vw] bg-gray-50">
        {useRoutes(routes)}
      </div>
    </Suspense>
  );
}
