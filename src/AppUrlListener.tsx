import React, { useEffect } from 'react';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { useNavigate } from 'react-router';
import { supabase } from '~/services/supabase-client';
import { debugToasts } from '~/services/debug';

const ACCESS_TOKEN_MATCH = /(?:access_token=)([a-zA-Z0-9.-]*)/g;
const REFRESH_TOKEN_MATCH = /(?:refresh_token=)([a-zA-Z0-9.-]*)/g;

const AppUrlListener: React.FC<unknown> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
      if (event.url.includes('access_token')) {
        let match;
        while ((match = ACCESS_TOKEN_MATCH.exec(event.url)) !== null) {
          const access_token = match[1];
          supabase.auth.setAuth(access_token);
        }
        while ((match = REFRESH_TOKEN_MATCH.exec(event.url)) !== null) {
          const refresh_token = match[1];
          await supabase.auth.setSession(refresh_token);
        }
      }

      const slug = event.url.replace('io.supabase.cheersli://app/', '/');

      debugToasts(slug);

      if (slug) {
        navigate(slug);
      }
    });
  }, []);

  return null;
};

export default AppUrlListener;
