import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { useChessStore } from '../stores/chessStore';
import { useStockfish } from '../hooks/useStockfish';
import { useAutoPlay } from '../providers/AutoPlayProvider';
import './ChessBoard.css';

export default function ChessBoard() {
  const { theme } = useTheme();
  const {
    game,
    selectedSquare,
    validMoves,
    isGameOver,
    winner,
    selectSquare,
    resetGame,
  } = useChessStore();

  const { autoPlay, isReady } = useStockfish();
  const { autoPlayEnabled } = useAutoPlay();

  // Test if selectSquare is properly bound
  console.log('🔧 selectSquare function test:', {
    isFunction: typeof selectSquare === 'function',
    selectSquare: selectSquare,
    game: !!game
  });

  // Simple test - check if selectSquare is callable (this will run every render)
  if (game && typeof selectSquare === 'function') {
    console.log('🧪 Simple test - selectSquare is callable');
  }

  // Test calling selectSquare directly in render (this will run every render)
  if (game && typeof selectSquare === 'function') {
    console.log('🧪 Direct test - about to call selectSquare...');
    try {
      // Don't actually call it here as it would cause infinite re-renders
      console.log('✅ selectSquare is callable and ready');
    } catch (error) {
      console.error('❌ selectSquare is not callable:', error);
    }
  }

  // Debug logging
  React.useEffect(() => {
    console.log('🔍 ChessBoard Debug:', {
      game: !!game,
      gameTurn: game?.turn(),
      selectedSquare,
      validMoves,
      isGameOver,
      winner,
    });
  }, [game, selectedSquare, validMoves, isGameOver, winner]);

  // Auto-play AI moves when it's Black's turn (only if enabled)
  React.useEffect(() => {
    console.log('🤖 Auto-play useEffect triggered:', {
      game: !!game,
      isReady,
      isGameOver,
      currentTurn: game?.turn(),
      autoPlayEnabled,
      shouldTrigger: game && isReady && !isGameOver && game?.turn() === 'b' && autoPlayEnabled
    });
    
    if (game && isReady && !isGameOver && game.turn() === 'b' && autoPlayEnabled) {
      console.log('🤖 Auto-play: Black\'s turn detected, triggering AI move...');
      // Add a small delay to allow the UI to update
      const timer = setTimeout(() => {
        console.log('🤖 Executing auto-play with position:', game.fen());
        autoPlay(game.fen(), game.turn(), 15);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [game?.turn(), isReady, isGameOver, autoPlayEnabled, autoPlay]);

  // Get piece symbol for display
  const getPieceSymbol = (piece: any) => {
    const symbols: { [key: string]: string } = {
      'wp': '♙', 'wr': '♖', 'wn': '♘', 'wb': '♗', 'wq': '♕', 'wk': '♔',
      'bp': '♟', 'br': '♜', 'bn': '♞', 'bb': '♝', 'bq': '♛', 'bk': '♚'
    };
    return symbols[`${piece.color}${piece.type}`] || '';
  };

  // Check if a square is selected
  const isSquareSelected = (square: string) => selectedSquare === square;

  // Check if a square is a valid move target
  const isValidMoveTarget = (square: string) => validMoves.includes(square);

  // Handle square click
  const handleSquareClick = (square: string) => {
    console.log('🖱️ Square clicked:', square, {
      isGameOver,
      selectedSquare,
      validMoves,
      currentTurn: game?.turn()
    });
    
    if (isGameOver) {
      console.log('❌ Game is over, cannot make moves');
      return;
    }
    
    console.log('🚀 About to call selectSquare with:', square);
    selectSquare(square);
    console.log('✅ selectSquare called');
  };

  // Create a simple 8x8 grid
  const renderSquare = (row: number, col: number) => {
    const isDark = (row + col) % 2 === 1;
    const squareClass = isDark ? 'square dark' : 'square light';
    const squareName = String.fromCharCode(97 + col) + (8 - row); // a1, b1, etc.
    
    const piece = game?.get(squareName as any);
    const isSelected = isSquareSelected(squareName);
    const isValidTarget = isValidMoveTarget(squareName);
    
    let additionalClasses = '';
    if (isSelected) additionalClasses += ' selected';
    if (isValidTarget) additionalClasses += ' valid-move';
    
    return (
      <div
        key={`${row}-${col}`}
        className={`${squareClass}${additionalClasses}`}
        onClick={() => handleSquareClick(squareName)}
        style={{ cursor: 'pointer' }}
      >
        {piece && (
          <span className="piece">{getPieceSymbol(piece)}</span>
        )}
      </div>
    );
  };

  if (!game) {
    return (
      <div className="container">
        <div className="loading">Loading chess game...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title" style={{ color: theme.colors.text }}>
        Chess Trainer
      </h1>
      
      {isGameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          {winner && <p>Winner: {winner}</p>}
          <button onClick={resetGame} className="reset-button">
            New Game
          </button>
        </div>
      )}
      
      <div className="board">
        {Array.from({ length: 8 }, (_, row) => (
          <div key={row} className="row">
            {Array.from({ length: 8 }, (_, col) => renderSquare(row, col))}
          </div>
        ))}
      </div>
      
      <div className="game-info">
        <p className="turn" style={{ color: theme.colors.text }}>
          {game.turn() === 'w' ? 'White' : 'Black'}'s turn
        </p>
        <p className="subtitle" style={{ color: theme.colors.textSecondary }}>
          Click squares to make moves
        </p>
        <p className="debug-info" style={{ fontSize: '12px', opacity: 0.7 }}>
          Debug: Selected: {selectedSquare || 'none'} | Valid moves: {validMoves.length}
        </p>
      </div>
    </div>
  );
}
