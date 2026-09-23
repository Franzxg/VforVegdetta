import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types/community';
import { AppButton } from './AppButton';
import { StateView } from './StateView';

/**
 * Guard per le schermate riservate: mostra i contenuti solo se l'utente ha il
 * ruolo richiesto, altrimenti invita ad accedere.
 */
export function RequireRole({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { hasRole, session } = useAuth();

  if (hasRole(role)) {
    return <>{children}</>;
  }
  return (
    <StateView
      title={t('guard.title')}
      message={session ? t('guard.wrongRole') : t('guard.loginRequired')}
    >
      {!session && (
        <AppButton
          title={t('auth.login')}
          onPress={() => navigation.navigate('Login')}
        />
      )}
    </StateView>
  );
}
