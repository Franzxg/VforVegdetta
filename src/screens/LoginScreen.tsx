import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { TextField } from '../components/TextField';
import { useAuth } from '../context/AuthContext';
import type { RootScreenProps } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { isValidEmail } from '../utils/validation';

type LoginError = 'invalid' | 'pending' | 'rejected';

/**
 * Accesso riservato a volontari e super admin (§12.5). Chi usa l'app per
 * scansionare o proporre prodotti non ne ha bisogno.
 */
export function LoginScreen({ navigation }: RootScreenProps<'Login'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { session, login, logout } = useAuth();

  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [loginError, setLoginError] = useState<LoginError | null>(null);
  const [busy, setBusy] = useState(false);

  const contactError = !showErrors
    ? null
    : !contact.trim()
    ? t('form.required')
    : !isValidEmail(contact)
    ? t('form.invalidEmail')
    : null;
  const passwordError = showErrors && !password ? t('form.required') : null;

  const submit = async () => {
    setShowErrors(true);
    setLoginError(null);
    if (!contact.trim() || !isValidEmail(contact) || !password) {
      return;
    }
    setBusy(true);
    const result = await login(contact, password);
    setBusy(false);
    if (result === 'ok') {
      setPassword('');
      navigation.goBack();
    } else {
      setLoginError(result);
    }
  };

  if (session) {
    return (
      <View style={[styles.loggedIn, { backgroundColor: colors.surface }]}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {t('auth.loggedInAs', { name: session.name })}
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            {t(`auth.role.${session.role}`)}
          </Text>
        </View>
        <AppButton variant="ghost" title={t('auth.logout')} onPress={logout} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.intro, { color: colors.textSecondary }]}>
        {t('auth.intro')}
      </Text>

      <TextField
        label={t('auth.email')}
        value={contact}
        onChangeText={value => {
          setContact(value);
          setLoginError(null);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        error={contactError}
      />
      <TextField
        label={t('auth.password')}
        value={password}
        onChangeText={value => {
          setPassword(value);
          setLoginError(null);
        }}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        onSubmitEditing={submit}
        error={passwordError}
      />

      {loginError && (
        <View
          style={[
            styles.banner,
            { backgroundColor: colors.highlight, borderColor: colors.border },
          ]}
        >
          <Text style={{ color: colors.textPrimary }}>
            {t(`auth.error.${loginError}`)}
          </Text>
        </View>
      )}

      <AppButton
        title={busy ? t('common.loading') : t('auth.submit')}
        onPress={submit}
        disabled={busy}
      />

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          {t('auth.notVolunteer')}
        </Text>
        <AppButton
          variant="ghost"
          title={t('nav.becomeVolunteer')}
          onPress={() => navigation.replace('BecomeVolunteer')}
        />
      </View>
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
  footer: {
    marginTop: 16,
    gap: 8,
  },
  footerText: {
    textAlign: 'center',
  },
  loggedIn: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
});
