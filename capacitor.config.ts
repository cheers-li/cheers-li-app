import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'li.cheers.app',
  appName: 'cheers.li',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

// Enable live reload
if (process.env.SERVER_URL) {
  config.server = {
    url: process.env.SERVER_URL,
    cleartext: true,
  };
}

export default config;
