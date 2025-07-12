import React, { ReactNode } from 'react';
import {
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { ColorScheme } from '@/constants/Colors';

type ThemedViewProps = ViewProps & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  safe?: boolean;
};

const ThemedView: React.FC<ThemedViewProps> = ({
  style,
  children,
  safe = false,
  ...rest
}) => {
  const { colors: theme } = useTheme();
  const styles = getStyles(theme);

  if (safe) {
    const insets = useSafeAreaInsets();

    const safeStyles: ViewStyle = {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    };

    return (
      <View style={[styles.baseContainer, safeStyles, style]} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.baseContainer, style]} {...rest}>
      {children}
    </View>
  );
};

export default ThemedView;

const getStyles = (theme: typeof ColorScheme.light) => {
  return StyleSheet.create({
    baseContainer: {
      // flex: 1,
      // justifyContent: 'center',
      // alignItems: 'center',
      backgroundColor: theme.secondary,
    },
  });
};
