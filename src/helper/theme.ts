import { Preferences } from '@capacitor/preferences';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffectOnce } from 'react-use';
import store from '~/store';

const getStatusStyle = (dark: string) => {
  switch (dark) {
    case 'dark':
      return Style.Dark;
    case 'light':
      return Style.Light;
    default:
      return Style.Default;
  }
};

export const useTheme = () => {
  const [theme, setTheme] = store.useState<string>('theme');
  const [isDark, setDark] = store.useState<boolean>('dark');
  const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

  const applyTheme = async (newTheme: string) => {
    setTheme(newTheme);
    setDark(
      newTheme === 'dark' || (newTheme === 'system' && matchMedia.matches),
    );
    await StatusBar.setStyle({ style: getStatusStyle(newTheme) }).catch(
      () => undefined,
    );
  };

  // Load dark mode from local Preferences
  const setInitialMode = async () => {
    const { value } = await Preferences.get({ key: 'theme' });
    applyTheme(value || 'system');
  };

  useEffectOnce(() => {
    const updateMode = async () => {
      const { value } = await Preferences.get({ key: 'theme' });
      if (value !== 'system') return;
      applyTheme('system');
    };

    setInitialMode();

    matchMedia.addEventListener('change', updateMode);
    return () => matchMedia.removeEventListener('change', updateMode);
  });

  return [isDark, applyTheme, theme] as const;
};
