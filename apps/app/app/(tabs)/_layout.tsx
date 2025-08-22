import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '../../src/providers/ThemeProvider';
import { Platform, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppBar } from '../../src/components/AppBar';

export default function TabLayout() {
  const { theme, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  // Use top tabs on web for large screens, bottom tabs on mobile
  const tabBarPosition = isWeb && isLargeScreen ? 'top' : 'bottom';

  return (
    <>
      <AppBar />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            borderTopWidth: 1,
            height: isWeb && isLargeScreen ? 56 : 80,
            paddingBottom: isWeb && isLargeScreen ? 0 : 8,
            paddingTop: isWeb && isLargeScreen ? 8 : 0,
          },
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarIconStyle: {
            marginBottom: isWeb && isLargeScreen ? 0 : 4,
          },
        }}
        tabBarPosition={tabBarPosition}
      >
        <Tabs.Screen
          name="play"
          options={{
            title: 'Play',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="sports-esports" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="train"
          options={{
            title: 'Train',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="school" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
