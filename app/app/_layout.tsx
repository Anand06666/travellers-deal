import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from "nativewind";
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "../global.css";
import "../constants/i18n";

const THEME_KEY = 'user-theme';

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme) {
          setColorScheme(savedTheme as any);
        } else {
          setColorScheme('system');
        }
      } catch (error) {
        console.log('Error loading theme', error);
      }
    };
    loadTheme();

    const interval = setInterval(async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme && savedTheme !== colorScheme) {
        setColorScheme(savedTheme as any);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [colorScheme]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} backgroundColor="transparent" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
