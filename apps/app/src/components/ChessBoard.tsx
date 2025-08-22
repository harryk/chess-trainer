import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useChessStore } from '../stores/chessStore';
import { useTheme } from '../providers/ThemeProvider';
import { CHESS_PIECES, BOARD_SIZE, SQUARE_SIZE, isDarkSquare, getSquareName } from '@chess-trainer/shared';

const ChessBoard: React.FC = () => {
  const { game, selectedSquare, validMoves, selectSquare } = useChessStore();
  const { theme } = useTheme();

  if (!game) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.message, { color: theme.colors.text }]}>No game loaded</Text>
      </View>
    );
  }

  const renderSquare = (row: number, col: number) => {
    const squareName = getSquareName(row, col);
    const piece = game.get(squareName);
    const isSelected = selectedSquare === squareName;
    const isValidMove = validMoves.includes(squareName);
    const isDark = isDarkSquare(row, col);

    let backgroundColor = isDark ? '#B58863' : '#F0D9B5';
    if (isSelected) {
      backgroundColor = theme.colors.primary;
    } else if (isValidMove) {
      backgroundColor = theme.colors.secondary;
    }

    let pieceSymbol = '';
    if (piece) {
      const pieceKey = `${piece.color === 'w' ? 'WHITE' : 'BLACK'}_${piece.type.toUpperCase()}`;
      pieceSymbol = CHESS_PIECES[pieceKey as keyof typeof CHESS_PIECES] || '';
    }

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.square,
          {
            backgroundColor,
            width: SQUARE_SIZE,
            height: SQUARE_SIZE,
          },
        ]}
        onPress={() => selectSquare(squareName)}
      >
        {pieceSymbol ? (
          <Text style={styles.piece}>{pieceSymbol}</Text>
        ) : null}
        {isValidMove && !piece && (
          <View style={styles.validMoveIndicator} />
        )}
      </TouchableOpacity>
    );
  };

  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      const rowSquares = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        rowSquares.push(renderSquare(row, col));
      }
      board.push(
        <View key={row} style={styles.row}>
          {rowSquares}
        </View>
      );
    }
    return board;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.boardContainer}>
        {renderBoard()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  boardContainer: {
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#8B4513',
  },
  piece: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  validMoveIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 255, 0, 0.5)',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ChessBoard;

