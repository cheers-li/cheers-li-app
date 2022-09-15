import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cheers.li',
  appName: 'cheers.li',
  webDir: 'dist',
  bundledWebRuntime: false,
};

// Enable live reload
if (process.env.SERVER_URL) {
  config.server = {
    url: process.env.SERVER_URL,
    cleartext: true,
  };
}

export default config;
