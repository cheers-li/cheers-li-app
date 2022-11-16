import { Suspense, useEffect } from 'react';
import AppUrlListener from '~/AppUrlListener';
import { useTheme } from '~/helper/theme';
import Routes from '~/Routes';

const App = () => {
  const [isDark] = useTheme();
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-gray-50 text-black dark:bg-black dark:text-white"></div>
      }
    >
      <AppUrlListener />
      <div
        className="h-screen w-screen overflow-auto bg-gray-50 text-black dark:bg-black dark:text-white"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <Routes />
      </div>
    </Suspense>
  );
};

export default App;
