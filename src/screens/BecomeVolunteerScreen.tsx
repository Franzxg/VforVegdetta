import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { StateView } from '../components/StateView';
import { TextField } from '../components/TextField';
import { useCommunity } from '../context/CommunityContext';
import type { RootScreenProps } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { MIN_PASSWORD_LENGTH, isValidEmail } from '../utils/validation';

interface Form {
  name: string;
  contact: string;
  availability: string;
  motivation: string;
  password: string;
  confirm: string;
}

const EMPTY_FORM: Form = {
  name: '',
  contact: '',
  availability: '',
  motivation: '',
  password: '',
  confirm: '',
};

type FormErrors = Partial<Record<keyof Form, string>>;

/**
 * Candidatura "Diventa volontario" (§5.7): è il momento in cui chi vuole il
 * ruolo di volontario si registra. La richiesta resta in attesa finché il
 * super admin non la approva.
 */
export function BecomeVolunteerScreen({
  navigation,
}: RootScreenProps<'BecomeVolunteer'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { submitVolunteerRequest } = useCommunity();

  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [showErrors, setShowErrors] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (field: keyof Form) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  const validate = (): FormErrors => {
    const errors: FormErrors = {};
    (['name', 'contact', 'availability', 'motivation'] as const).forEach(
      field => {
        if (!form[field].trim()) {
          errors[field] = t('form.required');
        }
      },
    );
    if (!errors.contact && !isValidEmail(form.contact)) {
      errors.contact = t('form.invalidEmail');
    }
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = t('form.passwordTooShort', {
        count: MIN_PASSWORD_LENGTH,
      });
    }
    if (form.confirm !== form.password) {
      errors.confirm = t('form.passwordMismatch');
    }
    return errors;
  };

  const errors = showErrors ? validate() : {};

  const submit = async () => {
    setShowErrors(true);
    if (Object.keys(validate()).length > 0) {
      return;
    }
    setBusy(true);
    try {
      const result = await submitVolunteerRequest({
        name: form.name,
        contact: form.contact,
        availability: form.availability,
        motivation: form.motivation,
        password: form.password,
      });
      if (result === 'ok') {
        setSent(true);
      } else {
        setSubmitError(t(`volunteer.error.${result}`));
      }
    } catch {
      setSubmitError(t('propose.saveError'));
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <StateView
        title={t('volunteer.successTitle')}
        message={t('volunteer.successText', { contact: form.contact.trim() })}
      >
        <AppButton
          title={t('propose.backHome')}
          onPress={() => navigation.popToTop()}
        />
      </StateView>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.intro, { color: colors.textSecondary }]}>
        {t('volunteer.intro')}
      </Text>

      <TextField
        label={t('volunteer.name')}
        value={form.name}
        onChangeText={set('name')}
        autoCapitalize="words"
        maxLength={60}
        error={errors.name}
      />
      <TextField
        label={t('auth.email')}
        hint={t('volunteer.contactHint')}
        value={form.contact}
        onChangeText={set('contact')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.contact}
      />
      <TextField
        label={t('volunteer.availability')}
        placeholder={t('volunteer.availabilityPlaceholder')}
        value={form.availability}
        onChangeText={set('availability')}
        maxLength={120}
        error={errors.availability}
      />
      <TextField
        label={t('volunteer.motivation')}
        placeholder={t('volunteer.motivationPlaceholder')}
        value={form.motivation}
        onChangeText={set('motivation')}
        multiline
        maxLength={500}
        error={errors.motivation}
      />
      <TextField
        label={t('auth.password')}
        hint={t('form.passwordTooShort', { count: MIN_PASSWORD_LENGTH })}
        value={form.password}
        onChangeText={set('password')}
        secureTextEntry
        autoCapitalize="none"
        error={errors.password}
      />
      <TextField
        label={t('volunteer.confirmPassword')}
        value={form.confirm}
        onChangeText={set('confirm')}
        secureTextEntry
        autoCapitalize="none"
        error={errors.confirm}
      />

      {submitError && (
        <View
          style={[
            styles.banner,
            { backgroundColor: colors.highlight, borderColor: colors.border },
          ]}
        >
          <Text style={{ color: colors.textPrimary }}>{submitError}</Text>
        </View>
      )}

      <AppButton
        title={busy ? t('common.loading') : t('volunteer.submit')}
        onPress={submit}
        disabled={busy}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  intro: {
    fontSize: 15,
    lineHeight: 21,
  },
  banner: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
});
