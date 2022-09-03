import { Suspense, useEffect, useState } from 'react';
import { useRoutes, useLocation, useNavigate } from 'react-router-dom';
import routes from '~react-pages';
import { supabase } from './services/supabase-client';
import Layout from './components/layout';

const publicPages = ['/welcome', '/login', '/register', '/email-login'];

export default function App() {
  const [session, setSession] = useState(supabase.auth.session());
  const location = useLocation();
  const navigate = useNavigate();

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
    <Layout>
      <Suspense fallback={<p>Loading...</p>}>
        {/* <div className="flex h-screen w-screen bg-gray-50">
          {useRoutes(routes)}
        </div> */}
        {useRoutes(routes)}
      </Suspense>
    </Layout>
  );
}
