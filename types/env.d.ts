declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      OPENAI_API_KEY: string;
      // Add other environment variables here
    }
  }
}

// Ensure this file is treated as a module
export {};