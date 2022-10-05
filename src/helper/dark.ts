import { useEffectOnce } from 'react-use';
import store from '~/store';

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = store.useState<boolean>('dark');

  useEffectOnce(() => {
    const updateMode = (e: MediaQueryListEvent) => {
      setDarkMode(!!e.matches);
    };

    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

    setDarkMode(matchMedia.matches);
    matchMedia.addEventListener('change', updateMode);

    return () => matchMedia.removeEventListener('change', updateMode);
  });

  return darkMode;
};
