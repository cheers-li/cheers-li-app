import { BackButton } from '~/components/header/back-button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { Preferences } from '@capacitor/preferences';
import { useTheme } from '~/helper/theme';
import { Select } from '~/components/select';

const DarkMode = () => {
  const [_, applyTheme, theme] = useTheme();

  const changeTheme = async (value: string) => {
    console.log(value);

    await Preferences.set({ key: 'theme', value });
    applyTheme(value);
  };

  return (
    <Page hideNavigation>
      <PageHeader LeftComponent={<BackButton />}>Theme</PageHeader>
      <div className="flex w-full flex-col gap-2 px-4">
        <Select
          defaultValue={theme}
          label="Choose theme"
          options={[
            {
              value: 'light',
              display: 'Light',
            },
            {
              value: 'dark',
              display: 'Dark',
            },
            {
              value: 'system',
              display: 'System based',
            },
          ]}
          onUpdate={changeTheme}
          customClasses="border border-gray-200 shadow dark:border-transparent dark:shadow-none"
        ></Select>
      </div>
    </Page>
  );
};

export default DarkMode;
