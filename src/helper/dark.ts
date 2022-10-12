import { Preferences } from '@capacitor/preferences';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffectOnce } from 'react-use';
import store from '~/store';

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = store.useState<boolean>('dark');
  const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

  const setDark = async (dark: boolean) => {
    setDarkMode(dark);
    await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
  };

  // Load dark mode from local Preferences
  const setInitialDarkMode = async () => {
    const { value } = await Preferences.get({ key: 'darkmode' });

    const dark = value === null ? matchMedia.matches : value === 'true';
    setDark(dark);
  };

  useEffectOnce(() => {
    const updateMode = (e: MediaQueryListEvent) => {
      setDark(!!e.matches);
    };

    setInitialDarkMode();

    matchMedia.addEventListener('change', updateMode);
    return () => matchMedia.removeEventListener('change', updateMode);
  });

  return [darkMode, setDark] as const;
};
