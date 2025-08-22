import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, List, Switch, Button, Divider, useTheme as usePaperTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/providers/ThemeProvider';
import { ResponsiveContainer } from '../../src/components/ResponsiveContainer';

export default function SettingsScreen() {
  const { theme, toggleTheme, isDark } = useTheme();
  const paperTheme = usePaperTheme();
  
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement reset progress
            Alert.alert('Progress Reset', 'Your progress has been reset.');
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    // TODO: Implement data export
    Alert.alert('Export Data', 'Data export feature coming soon!');
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and free up storage space.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement clear cache
            Alert.alert('Cache Cleared', 'Cache has been cleared successfully.');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ResponsiveContainer>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Settings
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Customize your chess training experience
            </Text>
          </View>

          <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Appearance
              </Text>
              <List.Item
                title="Dark Theme"
                description="Switch between light and dark modes"
                left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
                right={() => (
                  <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    color={theme.colors.primary}
                  />
                )}
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{ color: theme.colors.textSecondary }}
              />
            </Card.Content>
          </Card>

          <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Notifications
              </Text>
              <List.Item
                title="Push Notifications"
                description="Receive notifications for game invites and daily challenges"
                left={(props) => <List.Icon {...props} icon="bell" />}
                right={() => (
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    color={theme.colors.primary}
                  />
                )}
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{ color: theme.colors.textSecondary }}
              />
              <Divider style={{ marginVertical: 8 }} />
              <List.Item
                title="Sound Effects"
                description="Play sounds during gameplay"
                left={(props) => <List.Icon {...props} icon="volume-high" />}
                right={() => (
                  <Switch
                    value={soundEnabled}
                    onValueChange={setSoundEnabled}
                    color={theme.colors.primary}
                  />
                )}
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{ color: theme.colors.textSecondary }}
              />
              <Divider style={{ marginVertical: 8 }} />
              <List.Item
                title="Vibration"
                description="Vibrate on piece moves and game events"
                left={(props) => <List.Icon {...props} icon="vibrate" />}
                right={() => (
                  <Switch
                    value={vibrationEnabled}
                    onValueChange={setVibrationEnabled}
                    color={theme.colors.primary}
                  />
                )}
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{ color: theme.colors.textSecondary }}
              />
            </Card.Content>
          </Card>

          <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Game Settings
              </Text>
              <List.Item
                title="Auto-save Games"
                description="Automatically save game progress"
                left={(props) => <List.Icon {...props} icon="content-save" />}
                right={() => (
                  <Switch
                    value={autoSave}
                    onValueChange={setAutoSave}
                    color={theme.colors.primary}
                  />
                )}
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{ color: theme.colors.textSecondary }}
              />
              <Divider style={{ marginVertical: 8 }} />
              <List.Item
                title="Game Time Control"
                description="Set default time controls for games"
                left={(props) => <List.Icon {...props} icon="clock" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {
                  // TODO: Navigate to time control settings
                }}
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{ color: theme.colors.textSecondary }}
              />
            </Card.Content>
          </Card>

          <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Data Management
              </Text>
              <List.Item
                title="Export Data"
                description="Export your games and progress"
                left={(props) => <List.Icon {...props} icon="download" />}
                onPress={handleExportData}
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{ color: theme.colors.textSecondary }}
              />
              <Divider style={{ marginVertical: 8 }} />
              <List.Item
                title="Clear Cache"
                description="Free up storage space"
                left={(props) => <List.Icon {...props} icon="delete-sweep" />}
                onPress={handleClearCache}
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{ color: theme.colors.textSecondary }}
              />
            </Card.Content>
          </Card>

          <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                About
              </Text>
              <List.Item
                title="Version"
                description="1.0.0"
                left={(props) => <List.Icon {...props} icon="information" />}
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{ color: theme.colors.textSecondary }}
              />
              <Divider style={{ marginVertical: 8 }} />
              <List.Item
                title="Terms of Service"
                description="Read our terms and conditions"
                left={(props) => <List.Icon {...props} icon="file-document" />}
                onPress={() => {
                  // TODO: Navigate to terms of service
                }}
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{ color: theme.colors.textSecondary }}
              />
              <Divider style={{ marginVertical: 8 }} />
              <List.Item
                title="Privacy Policy"
                description="Learn about data privacy"
                left={(props) => <List.Icon {...props} icon="shield-account" />}
                onPress={() => {
                  // TODO: Navigate to privacy policy
                }}
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{ color: theme.colors.textSecondary }}
              />
            </Card.Content>
          </Card>

          <View style={styles.dangerZone}>
            <Card style={[styles.dangerCard, { backgroundColor: '#FFEBEE' }]}>
              <Card.Content>
                <Text style={[styles.dangerTitle, { color: '#D32F2F' }]}>
                  Danger Zone
                </Text>
                <Text style={[styles.dangerDescription, { color: '#D32F2F' }]}>
                  These actions cannot be undone
                </Text>
                <Button
                  mode="outlined"
                  onPress={handleResetProgress}
                  style={[styles.dangerButton, { borderColor: '#D32F2F' }]}
                  textColor="#D32F2F"
                >
                  Reset All Progress
                </Button>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </ResponsiveContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionCard: {
    margin: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  dangerZone: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dangerCard: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  dangerDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  dangerButton: {
    alignSelf: 'flex-start',
  },
});
