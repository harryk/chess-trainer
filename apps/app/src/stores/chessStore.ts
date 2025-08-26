import { create } from 'zustand';
import { Chess } from 'chess.js';

// Define interfaces locally instead of importing from shared package
interface ChessMove {
  from: string;
  to: string;
  piece: string;
  color: string;
  san: string;
  flags: string;
}

interface ChessGame {
  fen: string;
  moves: ChessMove[];
  isGameOver: boolean;
  winner?: 'white' | 'black' | 'draw';
}

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

    // If no square is selected, select this one
    if (!selectedSquare) {
      const piece = game.get(square as any);
      if (piece && piece.color === (game.turn() === 'w' ? 'w' : 'b')) {
        const validMoves = game.moves({ square: square as any, verbose: true });
        set({
          selectedSquare: square,
          validMoves: validMoves.map((m: any) => m.to),
        });
      }
    } else {
      // If a square is already selected, try to make a move
      if (selectedSquare !== square) {
        const success = get().makeMove(selectedSquare, square);
        if (success) {
          set({ selectedSquare: null, validMoves: [] });
        }
      } else {
        // Clicking the same square deselects it
        set({ selectedSquare: null, validMoves: [] });
      }
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

