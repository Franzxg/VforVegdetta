import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initI18n } from './src/i18n';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function AppContent() {
  const { isDark, ready: themeReady } = useTheme();
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    initI18n().finally(() => setI18nReady(true));
  }, []);

  // La splash nativa resta visibile finché lingua e tema non sono pronti.
  if (!i18nReady || !themeReady) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <RootNavigator onReady={() => BootSplash.hide({ fade: true })} />
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
