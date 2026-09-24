import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useCommunity } from '../context/CommunityContext';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type MenuRoute = Exclude<
  keyof RootStackParamList,
  'Scan' | 'Product' | 'Login' | 'ProposalReview'
>;

interface MenuItem {
  key: string;
  label: string;
  onPress: () => void;
  /** Puntino di notifica (es. elementi in attesa di revisione). */
  badge?: boolean;
}

/**
 * Azioni dell'header (§12): bottone di accesso (o nome dell'utente connesso)
 * e menu principale con le voci visibili in base al ruolo.
 */
export function HeaderMenu() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { session, isAdmin, isSuperAdmin, logout } = useAuth();
  const { pendingProposals, pendingRequests } = useCommunity();
  const [open, setOpen] = useState(false);

  const go = (route: MenuRoute) => () => navigation.navigate(route);

  const items: MenuItem[] = [
    { key: 'home', label: t('nav.home'), onPress: go('Home') },
    { key: 'about', label: t('nav.about'), onPress: go('About') },
    {
      key: 'additives',
      label: t('nav.additives'),
      onPress: go('Additives'),
    },
    {
      key: 'propose',
      label: t('nav.proposeProduct'),
      onPress: go('ProposeProduct'),
    },
  ];
  if (isAdmin) {
    items.push({
      key: 'volunteerPanel',
      label: t('nav.volunteerPanel'),
      onPress: go('VolunteerPanel'),
      badge: pendingProposals > 0,
    });
  }
  if (isSuperAdmin) {
    items.push({
      key: 'superAdminPanel',
      label: t('nav.superAdminPanel'),
      onPress: go('SuperAdminPanel'),
      badge: pendingRequests > 0,
    });
  }
  if (!session) {
    items.push({
      key: 'volunteer',
      label: t('nav.becomeVolunteer'),
      onPress: go('BecomeVolunteer'),
    });
  }
  items.push({
    key: 'settings',
    label: t('nav.settings'),
    onPress: go('Settings'),
  });
  if (session) {
    items.push({ key: 'logout', label: t('auth.logout'), onPress: logout });
  }

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={session ? t('auth.account') : t('auth.login')}
        hitSlop={8}
        onPress={() => navigation.navigate('Login')}
        style={styles.account}
      >
        <Text
          numberOfLines={1}
          style={[styles.accountText, { color: colors.textPrimary }]}
        >
          {session ? session.name.split(' ')[0] : t('auth.login')}
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('nav.menu')}
        hitSlop={12}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.icon, { color: colors.textPrimary }]}>☰</Text>
        {items.some(item => item.badge) && (
          <View style={[styles.iconDot, { backgroundColor: colors.accent }]} />
        )}
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          accessibilityLabel={t('nav.closeMenu')}
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          onPress={() => setOpen(false)}
        >
          <View
            style={[
              styles.sheet,
              {
                marginTop: insets.top + 8,
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            {items.map(item => (
              <Pressable
                key={item.key}
                accessibilityRole="menuitem"
                onPress={() => {
                  setOpen(false);
                  item.onPress();
                }}
                style={({ pressed }) => [
                  styles.item,
                  pressed && { backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.itemText, { color: colors.textPrimary }]}>
                  {item.label}
                </Text>
                {item.badge && (
                  <View
                    style={[styles.dot, { backgroundColor: colors.accent }]}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  account: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
    maxWidth: 120,
  },
  accountText: {
    fontSize: 14,
    fontWeight: '600',
  },
  icon: {
    fontSize: 24,
    paddingHorizontal: 4,
  },
  iconDot: {
    position: 'absolute',
    top: 2,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  backdrop: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sheet: {
    marginRight: 12,
    minWidth: 240,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
