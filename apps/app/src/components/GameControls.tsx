import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useChessStore } from '../stores/chessStore';
import { useTheme } from '../providers/ThemeProvider';

const GameControls: React.FC = () => {
  const { game, isGameOver, winner, resetGame } = useChessStore();
  const { theme, toggleTheme, isDark } = useTheme();

  if (!game) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.controls}>
        <Button
          mode="contained"
          onPress={resetGame}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          textColor={theme.colors.background}
        >
          New Game
        </Button>
        
        <Button
          mode="outlined"
          onPress={toggleTheme}
          style={[styles.button, { borderColor: theme.colors.primary }]}
          textColor={theme.colors.primary}
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </View>

      {isGameOver && (
        <View style={styles.gameOver}>
          <Text style={[styles.gameOverText, { color: theme.colors.text }]}>
            Game Over!
          </Text>
          {winner && (
            <Text style={[styles.winnerText, { color: theme.colors.primary }]}>
              {winner.charAt(0).toUpperCase() + winner.slice(1)} wins!
            </Text>
          )}
        </View>
      )}

      <View style={styles.status}>
        <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
          Turn: {game.turn() === 'w' ? 'White' : 'Black'}
        </Text>
        <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
          Moves: {game.history().length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 8,
    margin: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    minWidth: 120,
  },
  gameOver: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  winnerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  status: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 16,
  },
});

export default GameControls;

