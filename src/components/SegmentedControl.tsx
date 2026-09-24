import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export interface SegmentOption<T> {
  value: T;
  label: string;
}

/** Selettore a segmenti a scelta singola (tema, lingua, verdetto…). */
export function SegmentedControl<T extends string>({
  options,
  selected,
  onChange,
}: {
  options: SegmentOption<T>[];
  selected: T | null;
  onChange: (value: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={styles.segmented}>
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

const styles = StyleSheet.create({
  segmented: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
