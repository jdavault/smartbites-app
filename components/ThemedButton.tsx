import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ColorScheme } from '@/constants/Colors';

type ThemedButtonProps = PressableProps & {
  style?: StyleProp<ViewStyle>;
};

const ThemedButton: React.FC<ThemedButtonProps> = ({ style, ...rest }) => {
  const { colors: theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]}
      {...rest}
    />
  );
};

const getStyles = (theme: typeof ColorScheme.light) => {
  return StyleSheet.create({
    btn: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 6,
      marginVertical: 10,
    },
    pressed: {
      opacity: 0.5,
    },
  });
};
export default ThemedButton;
