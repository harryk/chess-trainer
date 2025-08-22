import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/providers/ThemeProvider';
import { ResponsiveContainer } from '../../src/components/ResponsiveContainer';
import { useChessStore } from '../../src/stores/chessStore';
import ChessBoard from '../../src/components/ChessBoard';
import GameControls from '../../src/components/GameControls';

export default function PlayScreen() {
  const { theme } = useTheme();
  const { initializeGame } = useChessStore();

  useEffect(() => {
    // Initialize a new game when the component mounts
    initializeGame('local-game');
  }, [initializeGame]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ResponsiveContainer>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Play Chess
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Challenge yourself or play against friends
            </Text>
          </View>

          <Card style={[styles.gameCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Current Game
              </Text>
              <ChessBoard />
              <GameControls />
            </Card.Content>
          </Card>

          <View style={styles.actions}>
            <Card style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                  Quick Play
                </Text>
                <Text style={[styles.actionDescription, { color: theme.colors.textSecondary }]}>
                  Start a new game with default settings
                </Text>
                <Button
                  mode="contained"
                  onPress={() => {
                    // TODO: Implement quick play
                  }}
                  style={[styles.button, { backgroundColor: theme.colors.primary }]}
                  textColor={theme.colors.background}
                >
                  New Game
                </Button>
              </Card.Content>
            </Card>

            <Card style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                  Multiplayer
                </Text>
                <Text style={[styles.actionDescription, { color: theme.colors.textSecondary }]}>
                  Play against friends online
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => {
                    // TODO: Implement multiplayer
                  }}
                  style={[styles.button, { borderColor: theme.colors.primary }]}
                  textColor={theme.colors.primary}
                >
                  Find Game
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
  gameCard: {
    margin: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  actionCard: {
    flex: 1,
    minWidth: 250,
    maxWidth: 300,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
  },
});
