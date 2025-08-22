import React, { useState } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Appbar, Menu, Divider, useTheme as usePaperTheme } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';

export const AppBar: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const paperTheme = usePaperTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Appbar.Header
      style={[
        styles.header,
        {
          backgroundColor: theme.colors.surface,
          elevation: 2,
          shadowColor: theme.colors.border,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      ]}
    >
      <Appbar.Content
        title="Chess Trainer"
        titleStyle={[
          styles.title,
          { color: theme.colors.text },
        ]}
        subtitle="Master the game"
        subtitleStyle={[
          styles.subtitle,
          { color: theme.colors.textSecondary },
        ]}
      />
      
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            onPress={openMenu}
            iconColor={theme.colors.text}
          />
        }
        contentStyle={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: 1,
        }}
      >
        <Menu.Item
          onPress={() => {
            toggleTheme();
            closeMenu();
          }}
          title={isDark ? 'Light Mode' : 'Dark Mode'}
          leadingIcon={isDark ? 'weather-sunny' : 'weather-night'}
          titleStyle={{ color: theme.colors.text }}
        />
        <Divider />
        <Menu.Item
          onPress={() => {
            // TODO: Implement help
            closeMenu();
          }}
          title="Help"
          leadingIcon="help-circle"
          titleStyle={{ color: theme.colors.text }}
        />
        <Menu.Item
          onPress={() => {
            // TODO: Implement about
            closeMenu();
          }}
          title="About"
          leadingIcon="information"
          titleStyle={{ color: theme.colors.text }}
        />
      </Menu>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'web' ? 64 : 56,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
});
