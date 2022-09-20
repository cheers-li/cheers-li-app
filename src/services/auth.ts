import { Preferences } from '@capacitor/preferences';
import { Session } from '@supabase/supabase-js';

export const getStoredSession = async (): Promise<Session | undefined> => {
  const { value } = await Preferences.get({ key: 'session' });

  if (value) {
    return JSON.parse(value);
  }
};

export const storeSession = async (session: Session) => {
  await Preferences.set({
    key: 'session',
    value: JSON.stringify(session),
  });
};
