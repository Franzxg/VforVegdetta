import React from 'react';
import { StyleSheet, TextInputProps, View } from 'react-native';
import { Text, TextInput } from './Text';
import { useTheme } from '../theme/ThemeContext';

interface Props extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string | null;
  hint?: string;
}

/** Campo di testo con etichetta e messaggio di errore, usato nei form. */
export function TextField({
  label,
  error,
  hint,
  multiline,
  ...inputProps
}: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      <TextInput
        {...inputProps}
        multiline={multiline}
        accessibilityLabel={label}
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          multiline && styles.multiline,
          {
            color: colors.textPrimary,
            backgroundColor: colors.background,
            borderColor: error ? colors.accent : colors.border,
          },
        ]}
      />
      {error ? (
        <Text style={[styles.message, { color: colors.accent }]}>{error}</Text>
      ) : hint ? (
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  message: {
    fontSize: 13,
  },
});
