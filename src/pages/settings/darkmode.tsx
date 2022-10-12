import { BackButton } from '~/components/header/back-button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { Preferences } from '@capacitor/preferences';
import { useDarkMode } from '~/helper/dark';
import { Switch } from '~/components/switch';

const DarkMode = () => {
  const [dark, setDark] = useDarkMode();

  const toggleDarkMode = async (value: boolean) => {
    await Preferences.set({ key: 'darkmode', value: value.toString() });
    setDark(value);
  };

  return (
    <Page hideNavigation>
      <PageHeader LeftComponent={<BackButton />}>Theme</PageHeader>
      <div className="flex w-full flex-col gap-2 px-4">
        <Switch
          checked={dark}
          label="Enable dark theme"
          onUpdate={toggleDarkMode}
        />
      </div>
    </Page>
  );
};

export default DarkMode;
