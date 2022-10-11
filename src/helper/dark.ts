import { Preferences } from '@capacitor/preferences';
import { useEffectOnce } from 'react-use';
import store from '~/store';

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = store.useState<boolean>('dark');
  const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

  // Load dark mode from local Preferences
  const setInitialDarkMode = async () => {
    const { value } = await Preferences.get({ key: 'darkmode' });

    if (value !== null) {
      setDarkMode(value === 'true');
    } else {
      setDarkMode(matchMedia.matches);
    }
  };

  useEffectOnce(() => {
    const updateMode = (e: MediaQueryListEvent) => {
      setDarkMode(!!e.matches);
    };

    setInitialDarkMode();

    matchMedia.addEventListener('change', updateMode);
    return () => matchMedia.removeEventListener('change', updateMode);
  });

  return [darkMode, setDarkMode] as const;
};
