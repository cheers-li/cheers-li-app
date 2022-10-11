import { FC, useState } from 'react';
import clsx from 'clsx';
import { BackButton } from '~/components/header/back-button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { Preferences } from '@capacitor/preferences';
import { useDarkMode } from '~/helper/dark';

const DarkMode = () => {
  const [dark, setDark] = useDarkMode();
  const [loading, setLoading] = useState(false);

  const toggleDarkMode = async () => {
    const value = !dark;
    const strValue = value.toString();
    console.log('new value: ' + value);
    console.log('new value str: ' + strValue);

    await Preferences.set({ key: 'darkmode', value: strValue });
    setDark(value);
  };

  return (
    <Page hideNavigation>
      <PageHeader LeftComponent={<BackButton disabled={loading} />}>
        Theme
      </PageHeader>

      {
        <div className="flex flex-col items-center gap-4 px-4">
          <div className="flex w-full flex-col gap-2">
            <div>Dark mode: {dark}</div>

            <button onClick={toggleDarkMode}>Toggle darkmode</button>
          </div>
        </div>
      }
    </Page>
  );
};

export default DarkMode;
