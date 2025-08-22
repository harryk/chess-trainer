import { create } from 'zustand';
import { Chess } from 'chess.js';
import { ChessGame, ChessMove } from '@chess-trainer/shared';

interface ChessState {
  game: Chess | null;
  gameId: string | null;
  isConnected: boolean;
  moves: ChessMove[];
  selectedSquare: string | null;
  validMoves: string[];
  isGameOver: boolean;
  winner: 'white' | 'black' | 'draw' | null;
}

interface ChessActions {
  initializeGame: (gameId: string) => void;
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  selectSquare: (square: string) => void;
  clearSelection: () => void;
  setGameState: (game: ChessGame) => void;
  setConnectionStatus: (status: boolean) => void;
  resetGame: () => void;
}

export const useChessStore = create<ChessState & ChessActions>((set, get) => ({
  game: null,
  gameId: null,
  isConnected: false,
  moves: [],
  selectedSquare: null,
  validMoves: [],
  isGameOver: false,
  winner: null,

  initializeGame: (gameId: string) => {
    const chess = new Chess();
    set({
      game: chess,
      gameId,
      moves: [],
      selectedSquare: null,
      validMoves: [],
      isGameOver: false,
      winner: null,
    });
  },

  makeMove: (from: string, to: string, promotion?: string) => {
    const { game } = get();
    if (!game) return false;

    try {
      const move = game.move({ from, to, promotion });
      if (move) {
        set({
          moves: game.history({ verbose: true }),
          isGameOver: game.isGameOver(),
          winner: game.isCheckmate() ? (game.turn() === 'w' ? 'black' : 'white') : null,
          selectedSquare: null,
          validMoves: [],
        });
        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    return false;
  },

  selectSquare: (square: string) => {
    const { game, selectedSquare } = get();
    if (!game) return;

    if (selectedSquare === square) {
      set({ selectedSquare: null, validMoves: [] });
      return;
    }

    const piece = game.get(square);
    if (piece && piece.color === (game.turn() === 'w' ? 'white' : 'black')) {
      const moves = game.moves({ square, verbose: true });
      const validMoves = moves.map(move => move.to);
      set({ selectedSquare: square, validMoves });
    } else if (selectedSquare && get().validMoves.includes(square)) {
      get().makeMove(selectedSquare, square);
    }
  },

  clearSelection: () => {
    set({ selectedSquare: null, validMoves: [] });
  },

  setGameState: (gameState: ChessGame) => {
    const chess = new Chess(gameState.fen);
    set({
      game: chess,
      moves: gameState.moves,
      isGameOver: gameState.isGameOver,
      winner: gameState.winner || null,
    });
  },

  setConnectionStatus: (status: boolean) => {
    set({ isConnected: status });
  },

  resetGame: () => {
    const chess = new Chess();
    set({
      game: chess,
      moves: [],
      selectedSquare: null,
      validMoves: [],
      isGameOver: false,
      winner: null,
    });
  },
}));

