import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  SafeAreaView,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import ThemedTextInput from '@/components/ThemedTextInput';
import ThemedButton from '@/components/ThemedButton';
import Spacer from '@/components/Spacer';
import { useAuth } from '@/context/AuthContext';
import { RecipeInput } from '@/types/recipes';
import { useTheme } from '@/context/ThemeContext';
import { createRecipe } from '@/services/recipe';

const RecipeJsonImporter: React.FC = () => {
  const { colors: theme } = useTheme();
  const [jsonText, setJsonText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, authChecked } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!user?.$id) {
      Alert.alert('Not logged in', 'You must be logged in to import a recipe');
      return;
    }

    try {
      setLoading(true);
      const parsed: RecipeInput = JSON.parse(jsonText);
      // if (!parsed.title || !parsed.ingredients?.length) {
      //   Alert.alert(
      //     'Invalid JSON',
      //     'Recipe must include a title and ingredients.'
      //   );
      //   return;
      // }
      // //await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
      // console.log('Parsed Recipe:', {
      //   userId: user.$id,
      //   ...parsed,
      // });
      const response = await createRecipe(user.$id, parsed);
      console.log('Recipe created');
      // console.log('Generated Recipe:', recipe);
      setJsonText('');
    } catch (error: any) {
      Alert.alert('Invalid JSON', error.message || 'Could not parse the input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text
                  style={[styles.loadingText, { color: theme.textPrimary }]}
                >
                  Importing Recipe...
                </Text>
              </View>
            ) : (
              <>
                <ThemedText title style={styles.heading}>
                  {user?.firstName}'s Upload Recipe from JSON Page
                </ThemedText>

                <Spacer width="100%" height={10} />

                <ThemedButton
                  onPress={handleSubmit}
                  disabled={!authChecked || !user?.$id}
                  style={styles.button}
                >
                  <Text style={{ color: '#fff' }}>Import Recipe</Text>
                </ThemedButton>

                <Spacer width="100%" height={20} />

                <View
                  style={[styles.inputWrapper, { backgroundColor: theme.card }]}
                >
                  <ThemedTextInput
                    style={[styles.jsonInput, { color: theme.textPrimary }]}
                    placeholder="Paste recipe JSON here"
                    value={jsonText}
                    onChangeText={setJsonText}
                    multiline
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RecipeJsonImporter;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  inputWrapper: {
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 0,
  },
  jsonInput: {
    minHeight: 200,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 160,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});
