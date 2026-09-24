import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderMenu } from '../components/HeaderMenu';
import { AboutScreen } from '../screens/AboutScreen';
import { AdditivesScreen } from '../screens/AdditivesScreen';
import { BecomeVolunteerScreen } from '../screens/BecomeVolunteerScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProductScreen } from '../screens/ProductScreen';
import { ProposalReviewScreen } from '../screens/ProposalReviewScreen';
import { ProposeProductScreen } from '../screens/ProposeProductScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SuperAdminPanelScreen } from '../screens/SuperAdminPanelScreen';
import { VolunteerPanelScreen } from '../screens/VolunteerPanelScreen';
import { useTheme } from '../theme/ThemeContext';
import { FONT_FAMILY } from '../theme/typography';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const renderHeaderMenu = () => <HeaderMenu />;

export function RootNavigator({ onReady }: { onReady: () => void }) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  const navigationTheme: Theme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      // Font dell'app anche per i testi disegnati da React Navigation
      fonts: {
        regular: { ...base.fonts.regular, fontFamily: FONT_FAMILY },
        medium: { ...base.fonts.medium, fontFamily: FONT_FAMILY },
        bold: { ...base.fonts.bold, fontFamily: FONT_FAMILY },
        heavy: { ...base.fonts.heavy, fontFamily: FONT_FAMILY },
      },
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.surface,
        card: colors.header,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.accent,
      },
    };
  }, [colors, isDark]);

  return (
    <NavigationContainer theme={navigationTheme} onReady={onReady}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.header },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontFamily: FONT_FAMILY, fontWeight: '700' },
          headerRight: renderHeaderMenu,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: t('common.appName') }}
        />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{ title: t('nav.scan') }}
        />
        <Stack.Screen
          name="Product"
          component={ProductScreen}
          options={{ title: t('nav.product') }}
        />
        <Stack.Screen
          name="ProposeProduct"
          component={ProposeProductScreen}
          options={{ title: t('nav.proposeProduct') }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: t('nav.login') }}
        />
        <Stack.Screen
          name="BecomeVolunteer"
          component={BecomeVolunteerScreen}
          options={{ title: t('nav.becomeVolunteer') }}
        />
        <Stack.Screen
          name="VolunteerPanel"
          component={VolunteerPanelScreen}
          options={{ title: t('nav.volunteerPanel') }}
        />
        <Stack.Screen
          name="ProposalReview"
          component={ProposalReviewScreen}
          options={{ title: t('nav.proposalReview') }}
        />
        <Stack.Screen
          name="SuperAdminPanel"
          component={SuperAdminPanelScreen}
          options={{ title: t('nav.superAdminPanel') }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: t('nav.about') }}
        />
        <Stack.Screen
          name="Additives"
          component={AdditivesScreen}
          options={{ title: t('nav.additives') }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: t('nav.settings') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
