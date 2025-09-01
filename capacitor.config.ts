import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e27e1ab08bc0401d97d33d2b84cc57e4',
  appName: 'Calculadora Malla Viford Pro',
  webDir: 'dist',
  server: {
    url: 'https://e27e1ab0-8bc0-401d-97d3-3d2b84cc57e4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#2563eb',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP'
    }
  }
};

export default config;