import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeContext';

type Variant = 'primary' | 'secondary' | 'ghost';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  large?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  large = false,
  disabled = false,
  style,
}: Props) {
  const { colors } = useTheme();

  const background = {
    primary: colors.primary,
    secondary: colors.secondary,
    ghost: 'transparent',
  }[variant];
  const textColor = variant === 'ghost' ? colors.primary : colors.onPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        large && styles.large,
        {
          backgroundColor: background,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[styles.text, large && styles.largeText, { color: textColor }]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: {
    paddingVertical: 20,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  largeText: {
    fontSize: 22,
    fontWeight: '700',
  },
});
