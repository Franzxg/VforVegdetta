import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

type MenuRoute = 'Home' | 'ProposeProduct' | 'Settings';

const ITEMS: { route: MenuRoute; labelKey: string }[] = [
  { route: 'Home', labelKey: 'nav.home' },
  { route: 'ProposeProduct', labelKey: 'nav.proposeProduct' },
  { route: 'Settings', labelKey: 'nav.settings' },
];

/** Bottone "hamburger" nell'header con il menu principale dell'app. */
export function HeaderMenu() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  const go = (route: MenuRoute) => {
    setOpen(false);
    navigation.navigate(route);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('nav.menu')}
        hitSlop={12}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.icon, { color: colors.textPrimary }]}>☰</Text>
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
            {ITEMS.map(item => (
              <Pressable
                key={item.route}
                accessibilityRole="menuitem"
                onPress={() => go(item.route)}
                style={({ pressed }) => [
                  styles.item,
                  pressed && { backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.itemText, { color: colors.textPrimary }]}>
                  {t(item.labelKey)}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
    paddingHorizontal: 4,
  },
  backdrop: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sheet: {
    marginRight: 12,
    minWidth: 220,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
