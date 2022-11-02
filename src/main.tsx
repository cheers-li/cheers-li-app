import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '~/App';
import { useEffectOnce } from 'react-use';
import { supabase } from '~/services/supabase-client';
import { getStoredSession, getStoredUser, storeSession } from '~/services/auth';
import { PushNotifications } from '@capacitor/push-notifications';
import { addNewDevices } from '~/services/devices';
import { Capacitor } from '@capacitor/core';

import '~/index.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import store from '~/store';
import { User } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from 'react-query';

const Application = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [_, setGlobalUser] = store.useState<User | null>('user');

  const queryClient = new QueryClient();

  useEffectOnce(() => {
    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession != null) {
        await storeSession(newSession);
        setGlobalUser(newSession.user);
      }
    });

    loadSession();
  });

  const loadSession = async () => {
    const currentSession = supabase.auth.session();
    if (
      currentSession &&
      parseInt(currentSession?.expires_at + '000') > Date.now()
    ) {
      setGlobalUser(currentSession.user);
      setIsLoading(false);
      return;
    } else if (currentSession && currentSession.refresh_token) {
      const { session, error } = await supabase.auth.setSession(
        currentSession.refresh_token,
      );

      if (!error && session) {
        setGlobalUser(currentSession.user);
        setIsLoading(false);
        return;
      }
    }

    const storedSession = await getStoredSession();
    if (storedSession && storedSession.refresh_token) {
      const { session, error } = await supabase.auth.setSession(
        storedSession.refresh_token,
      );
      if (!error && session) {
        setGlobalUser(session.user);
        setIsLoading(false);
        return;
      } else {
        console.log(session, error);
        setIsLoading(false);
        return;
      }
    }
    setIsLoading(false);
  };

  const attachEventListeners = async () => {
    await PushNotifications.addListener('registration', async (token) => {
      const storedUser = await getStoredUser();
      if (storedUser?.id) {
        await addNewDevices(storedUser?.id, token.value);
      }
    });
    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification) => {
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.inputValue,
        );
      },
    );
  };

  useEffectOnce(() => {
    if (Capacitor.isNativePlatform()) {
      attachEventListeners();
    }
  });

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>{!isLoading && <App />}</Router>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Application />,
);
