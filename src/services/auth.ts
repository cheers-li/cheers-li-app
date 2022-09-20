import { Preferences } from '@capacitor/preferences';
import { Session, User } from '@supabase/supabase-js';

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

export const getStoredUser = async (): Promise<User | undefined> => {
  const { value } = await Preferences.get({ key: 'user' });

  if (value) {
    return JSON.parse(value);
  }
};

export const storeUser = async (user: User | null) => {
  await Preferences.set({
    key: 'user',
    value: JSON.stringify(user),
  });
};
