import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Language, SUPPORTED_LANGUAGES, setLanguage } from '../i18n';
import { ThemePreference, useTheme } from '../theme/ThemeContext';

interface Option<T> {
  value: T;
  label: string;
}

function SegmentedControl<T extends string>({
  options,
  selected,
  onChange,
}: {
  options: Option<T>[];
  selected: T;
  onChange: (value: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="radiogroup"
      style={[styles.segmented, { borderColor: colors.border }]}
    >
      {options.map(option => {
        const active = option.value === selected;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              { backgroundColor: active ? colors.primary : colors.background },
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: active ? colors.onPrimary : colors.textPrimary },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { colors, preference, setPreference } = useTheme();

  const themeOptions: Option<ThemePreference>[] = [
    { value: 'system', label: t('settings.themeSystem') },
    { value: 'light', label: t('settings.themeLight') },
    { value: 'dark', label: t('settings.themeDark') },
  ];
  const languageOptions: Option<Language>[] = SUPPORTED_LANGUAGES.map(lang => ({
    value: lang,
    label: t(`languages.${lang}`),
  }));

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
    marginTop: 12,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  segmented: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
