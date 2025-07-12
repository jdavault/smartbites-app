import React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleProp,
  TextStyle,
  useColorScheme,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type ThemedTextInputProps = TextInputProps & {
  style?: StyleProp<TextStyle>;
};

const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  style,
  ...rest
}) => {
  const { colors: theme } = useTheme();

  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.secondaryLighter,
          color: theme.accentDark,
          padding: 20,
          borderRadius: 6,
        },
        style,
      ]}
      placeholderTextColor={theme.accentDark} // ← Set it here!
      {...rest}
    />
  );
};

export default ThemedTextInput;
