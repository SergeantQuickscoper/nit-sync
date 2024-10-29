import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Import your global CSS file
import "../global.css";



import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  type RootStackParamList = {
    Default: undefined; // No parameters
    SignUp: { email: string }; // ScreenB expects an email parameter
  };

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{headerShown : false}}/>
        <Stack.Screen name="SignUpScreen/index"  options={{headerShown : false}} />
        <Stack.Screen name="OTPScreen/index"  options={{headerShown : false}}/>
        <Stack.Screen name="CompleteAccountScreen/index"  options={{headerShown : false}}/>
        <Stack.Screen name="NewAccountWelcomeScreen/index"  options={{headerShown : false}}/>
        <Stack.Screen name="EnterEmailForVerificationScreen/index"  options={{headerShown : false}}/>
        <Stack.Screen name="PasswordResetOTPScreen/index"  options={{headerShown : false}}/>
      </Stack>
    </ThemeProvider>
  );
}
