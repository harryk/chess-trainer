// Chess game types
export interface ChessMove {
  from: string;
  to: string;
  piece: string;
  promotion?: string;
  san: string;
  flags: string[];
}

export interface ChessGame {
  id: string;
  fen: string;
  moves: ChessMove[];
  isGameOver: boolean;
  winner?: 'white' | 'black' | 'draw';
}

// Theme types
export interface Theme {
  dark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Constants
export const CHESS_PIECES = {
  WHITE_PAWN: '♙',
  WHITE_ROOK: '♖',
  WHITE_KNIGHT: '♘',
  WHITE_BISHOP: '♗',
  WHITE_QUEEN: '♕',
  WHITE_KING: '♔',
  BLACK_PAWN: '♟',
  BLACK_ROOK: '♜',
  BLACK_KNIGHT: '♞',
  BLACK_BISHOP: '♝',
  BLACK_QUEEN: '♛',
  BLACK_KING: '♚',
} as const;

export const BOARD_SIZE = 8;
export const SQUARE_SIZE = 45; // in pixels

// Utility functions
export const isDarkSquare = (row: number, col: number): boolean => {
  return (row + col) % 2 === 1;
};

export const getSquareName = (row: number, col: number): string => {
  const file = String.fromCharCode(97 + col); // a-h
  const rank = 8 - row; // 8-1
  return `${file}${rank}`;
};

