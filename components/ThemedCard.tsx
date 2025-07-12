import React, { ReactNode } from 'react';
import {
  StyleSheet,
  useColorScheme,
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ColorScheme } from '@/constants/Colors';

type ThemedCardProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const ThemedCard: React.FC<ThemedCardProps> = ({
  style,
  children,
  ...rest
}) => {
  const { colors: theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View
      style={[{ backgroundColor: theme.primary }, styles.card, style]}
      {...rest}
    >
      {children}
    </View>
  );
};

export default ThemedCard;

const getStyles = (theme: typeof ColorScheme.light) => {
  return StyleSheet.create({
    card: {
      borderRadius: 5,
      padding: 20,
    },
  });
};
