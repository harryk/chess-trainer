// Chess game types
export interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
  san?: string;
  flags?: string;
}

export interface ChessGame {
  id: string;
  fen: string;
  moves: ChessMove[];
  status: 'playing' | 'checkmate' | 'stalemate' | 'draw';
  turn: 'w' | 'b';
  result?: '1-0' | '0-1' | '1/2-1/2';
}

// Stockfish engine types
export interface EngineAnalysisRequest {
  type: 'analyze';
  fen: string;
  depth?: number;
  multiPv?: number;
}

export interface EnginePlayRequest {
  type: 'play';
  fen: string;
  skill?: number;
  movetime?: number;
}

export type EngineRequest = EngineAnalysisRequest | EnginePlayRequest;

export interface EngineInfo {
  depth?: number;
  seldepth?: number;
  time?: number;
  nodes?: number;
  multipv?: number;
  score?: {
    cp?: number;
    mate?: number;
  };
  pv?: string[];
  nps?: number;
  tbhits?: number;
  hashfull?: number;
}

export interface EngineResponse {
  type: 'info' | 'bestmove' | 'readyok' | 'error';
  data?: EngineInfo | { bestmove: string; ponder?: string } | string;
}

// WebSocket connection types
export interface WebSocketMessage {
  id?: string;
  timestamp: number;
  data: any;
}

export interface ConnectionStatus {
  connected: boolean;
  lastPing?: number;
  latency?: number;
}

// Server health types
export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  engine: {
    status: 'ready' | 'busy' | 'error';
    lastActivity?: string;
  };
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

export const ENGINE_DEFAULTS = {
  DEFAULT_DEPTH: 20,
  DEFAULT_MULTI_PV: 1,
  DEFAULT_SKILL: 20,
  DEFAULT_MOVETIME: 1000,
  MAX_DEPTH: 50,
  MAX_MULTI_PV: 5,
  MAX_SKILL: 20,
  MAX_MOVETIME: 30000,
} as const;

export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ENGINE_REQUEST: 'engine_request',
  ENGINE_RESPONSE: 'engine_response',
  ERROR: 'error',
} as const;

// Utility functions
export const isDarkSquare = (row: number, col: number): boolean => {
  return (row + col) % 2 === 1;
};

export const getSquareName = (row: number, col: number): string => {
  const file = String.fromCharCode(97 + col); // a-h
  const rank = 8 - row; // 8-1
  return `${file}${rank}`;
};

