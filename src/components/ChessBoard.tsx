import React, { useState, useEffect } from 'react';
import { StockfishService } from '../services/StockfishService';
import './ChessBoard.css';

export default function ChessBoard() {
  const [stockfish, setStockfish] = useState<StockfishService | null>(null);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [gameState, setGameState] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [currentTurn, setCurrentTurn] = useState<'w' | 'b'>('w');

  useEffect(() => {
    // Initialize Stockfish engine
    const engine = new StockfishService();
    setStockfish(engine);

    // Check if engine is ready
    const checkReady = setInterval(() => {
      if (engine.isEngineReady()) {
        setIsEngineReady(true);
        clearInterval(checkReady);
      }
    }, 100);

    return () => {
      clearInterval(checkReady);
      engine.destroy();
    };
  }, []);

  const handleSquareClick = async (row: number, col: number) => {
    if (!isEngineReady || !stockfish) {
      console.log('Engine not ready yet');
      return;
    }

    try {
      console.log('Getting best move for position:', gameState);
      const bestMove = await stockfish.getBestMove(gameState, 5);
      console.log('Best move:', bestMove);
      
      // For now, just log the move
      // In a full implementation, you'd update the game state
      alert(`Engine suggests: ${bestMove}`);
    } catch (error) {
      console.error('Error getting best move:', error);
    }
  };

  // Create a simple 8x8 grid
  const renderSquare = (row: number, col: number) => {
    const isDark = (row + col) % 2 === 1;
    const squareColor = isDark ? '#B58863' : '#F0D9B5';
    
    return (
      <div
        key={`${row}-${col}`}
        className="square"
        style={{
          backgroundColor: squareColor,
        }}
        onClick={() => handleSquareClick(row, col)}
      >
        {/* Simplified piece rendering */}
        {row === 1 && (
          <span className="piece">♟</span>
        )}
        {row === 6 && (
          <span className="piece">♙</span>
        )}
        {row === 0 && col === 0 && (
          <span className="piece">♜</span>
        )}
        {row === 0 && col === 1 && (
          <span className="piece">♞</span>
        )}
        {row === 0 && col === 2 && (
          <span className="piece">♝</span>
        )}
        {row === 0 && col === 3 && (
          <span className="piece">♛</span>
        )}
        {row === 0 && col === 4 && (
          <span className="piece">♚</span>
        )}
        {row === 0 && col === 5 && (
          <span className="piece">♝</span>
        )}
        {row === 0 && col === 6 && (
          <span className="piece">♞</span>
        )}
        {row === 0 && col === 7 && (
          <span className="piece">♜</span>
        )}
        {row === 7 && col === 0 && (
          <span className="piece">♖</span>
        )}
        {row === 7 && col === 1 && (
          <span className="piece">♘</span>
        )}
        {row === 7 && col === 2 && (
          <span className="piece">♗</span>
        )}
        {row === 7 && col === 3 && (
          <span className="piece">♕</span>
        )}
        {row === 7 && col === 4 && (
          <span className="piece">♔</span>
        )}
        {row === 7 && col === 5 && (
          <span className="piece">♗</span>
        )}
        {row === 7 && col === 6 && (
          <span className="piece">♘</span>
        )}
        {row === 7 && col === 7 && (
          <span className="piece">♖</span>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="title">Chess Board</div>
      
      <div className="status">
        <p>Engine Status: {isEngineReady ? '✅ Ready' : '⏳ Loading...'}</p>
        <p>Current Turn: {currentTurn === 'w' ? 'White' : 'Black'}</p>
        <p>FEN: {gameState}</p>
      </div>

      <div className="board">
        {Array.from({ length: 8 }, (_, row) => (
          <div key={row} className="row">
            {Array.from({ length: 8 }, (_, col) => renderSquare(row, col))}
          </div>
        ))}
      </div>

      <div className="subtitle">
        Click any square to get engine analysis
      </div>
    </div>
  );
}
