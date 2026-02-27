import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.web3radio.app',
  appName: 'web3Radio',
  webDir: 'dist',

  bundledWebRuntime: false,

  server: {
    androidScheme: 'https'
  },

  android: {
    allowMixedContent: true
  }
};

export default config;