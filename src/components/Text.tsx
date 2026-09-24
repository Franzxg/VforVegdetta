import React from 'react';
import {
  Text as RNText,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  TextProps,
} from 'react-native';
import { FONT_FAMILY } from '../theme/typography';

/** `Text` di React Native con il font dell'app già applicato. */
export function Text({ style, ...props }: TextProps) {
  return <RNText {...props} style={[styles.font, style]} />;
}

/** `TextInput` di React Native con il font dell'app già applicato. */
export function TextInput({ style, ...props }: TextInputProps) {
  return <RNTextInput {...props} style={[styles.font, style]} />;
}

const styles = StyleSheet.create({
  font: {
    fontFamily: FONT_FAMILY,
  },
});
