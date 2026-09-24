import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from '../components/Text';
import {
  SegmentOption,
  SegmentedControl,
} from '../components/SegmentedControl';
import { Language, SUPPORTED_LANGUAGES, setLanguage } from '../i18n';
import { ThemePreference, useTheme } from '../theme/ThemeContext';

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { colors, preference, setPreference } = useTheme();

  const themeOptions: SegmentOption<ThemePreference>[] = [
    { value: 'system', label: t('settings.themeSystem') },
    { value: 'light', label: t('settings.themeLight') },
    { value: 'dark', label: t('settings.themeDark') },
  ];
  const languageOptions: SegmentOption<Language>[] = SUPPORTED_LANGUAGES.map(
    lang => ({
      value: lang,
      label: t(`languages.${lang}`),
    }),
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('settings.theme')}
      </Text>
      <SegmentedControl
        options={themeOptions}
        selected={preference}
        onChange={setPreference}
      />

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('settings.language')}
      </Text>
      <SegmentedControl
        options={languageOptions}
        selected={i18n.language as Language}
        onChange={lang => {
          setLanguage(lang).catch(() => {});
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
