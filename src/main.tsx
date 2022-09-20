import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '~/App';
import { useEffectOnce } from 'react-use';
import { supabase } from './services/supabase-client';
import { getStoredSession, storeSession } from './services/auth';
import { PushNotifications } from '@capacitor/push-notifications';
import { addNewDevices } from './services/devices';
import { getUserId } from './services/profile';
import { Capacitor } from '@capacitor/core';

import '~/index.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const Application = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffectOnce(() => {
    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession) {
        await storeSession(newSession);
      } else {
        setIsAuthenticated(false);
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
      setIsLoading(false);
      setIsAuthenticated(true);
      return;
    } else if (currentSession && currentSession.refresh_token) {
      const { session, error } = await supabase.auth.setSession(
        currentSession.refresh_token,
      );

      if (!error && session) {
        setIsLoading(false);
        setIsAuthenticated(true);
        return;
      }
    }

    const storedSession = await getStoredSession();
    if (storedSession && storedSession.refresh_token) {
      const { session, error } = await supabase.auth.setSession(
        storedSession.refresh_token,
      );
      if (!error && session) {
        setIsLoading(false);
        setIsAuthenticated(true);
        return;
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const attachEventListeners = async () => {
    await PushNotifications.addListener('registration', async (token) => {
      await addNewDevices(getUserId(), token.value);
    });
    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });
  };

  useEffectOnce(() => {
    if (Capacitor.isNativePlatform()) {
      attachEventListeners();
    }
  });

  return (
    <React.StrictMode>
      <Router>{!isLoading && <App isAuthenticated={isAuthenticated} />}</Router>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Application />,
);
