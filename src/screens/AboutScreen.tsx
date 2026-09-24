import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '../components/Text';
import { AppButton } from '../components/AppButton';
import { ProductImage } from '../components/ProductImage';
import { SCAN_CACHE_LIMIT } from '../services/scanCache';
import { useTheme } from '../theme/ThemeContext';

const OFF_URL = 'https://world.openfoodfacts.org';

const STEPS = ['scan', 'verdict', 'propose', 'review'] as const;

/** Descrizione dell'app (§6.10): cos'è, come funziona, fonte dei dati. */
export function AboutScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={styles.content}
    >
      <ProductImage uri={null} size={140} />
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t('common.appName')}
      </Text>
      <Text style={[styles.lead, { color: colors.textSecondary }]}>
        {t('about.lead')}
      </Text>

      <Section title={t('about.howTitle')}>
        {STEPS.map((step, index) => (
          <View key={step} style={styles.step}>
            <View
              style={[styles.stepNumber, { backgroundColor: colors.primary }]}
            >
              <Text
                style={[styles.stepNumberText, { color: colors.onPrimary }]}
              >
                {index + 1}
              </Text>
            </View>
            <Text style={[styles.stepText, { color: colors.textPrimary }]}>
              {t(`about.steps.${step}`)}
            </Text>
          </View>
        ))}
      </Section>

      <Section title={t('about.sourceTitle')}>
        <Text style={[styles.body, { color: colors.textPrimary }]}>
          {t('about.sourceText')}
        </Text>
        <AppButton
          variant="ghost"
          title={t('about.openOff')}
          onPress={() => Linking.openURL(OFF_URL).catch(() => {})}
        />
      </Section>

      <Section title={t('about.communityTitle')}>
        <Text style={[styles.body, { color: colors.textPrimary }]}>
          {t('about.communityText')}
        </Text>
      </Section>

      <Section title={t('about.offlineTitle')}>
        <Text style={[styles.body, { color: colors.textPrimary }]}>
          {t('about.offlineText', { limit: SCAN_CACHE_LIMIT })}
        </Text>
      </Section>

      <View
        style={[
          styles.disclaimer,
          { backgroundColor: colors.highlight, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.body, { color: colors.textPrimary }]}>
          {t('about.disclaimer')}
        </Text>
      </View>
    </ScrollView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.section,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 64,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  lead: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  body: {
    fontSize: 15,
    lineHeight: 21,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  disclaimer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
});
