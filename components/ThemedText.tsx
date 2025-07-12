import React, { ReactNode } from 'react';
import {
  Text,
  TextProps,
  StyleProp,
  TextStyle,
  useColorScheme,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type ThemedTextProps = TextProps & {
  style?: StyleProp<TextStyle>;
  children?: ReactNode;
  title?: boolean;
};

const ThemedText: React.FC<ThemedTextProps> = ({
  style,
  children,
  title = false,
  ...rest
}) => {
  const { colors: theme, theme: themeColor } = useTheme();

  const textColor =
    themeColor === 'dark' ? theme.primaryDark : theme.accentDark;

  return (
    <Text style={[{ color: textColor }, style]} {...rest}>
      {children}
    </Text>
  );
};

export default ThemedText;
