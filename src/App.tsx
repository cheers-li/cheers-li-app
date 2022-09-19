import { Suspense, useEffect, useState } from 'react';
import { useRoutes, useLocation, useNavigate } from 'react-router-dom';
import routes from '~react-pages';
import AppUrlListener from '~/AppUrlListener';
import { supabase } from '~/services/supabase-client';
import store from '~/store';
import { PushNotifications } from '@capacitor/push-notifications';
import { addNewDevices } from './services/devices';
import { getUserId } from './services/profile';
import { Capacitor } from '@capacitor/core';

const publicPages = [
  '/welcome',
  '/login',
  '/register',
  '/email-login',
  '/login-callback',
];

export default function App() {
  const [theme, setTheme] = store.useState<string>('theme');

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

  const attachEventListeners = async () => {
    await PushNotifications.addListener('registration', async (token) => {
      await addNewDevices(getUserId(), token.value);
    });
    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });
  };

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      attachEventListeners();
    }
  });

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
}
