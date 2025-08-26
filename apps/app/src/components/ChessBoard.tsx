import React, { useState, useEffect, useCallback } from 'react';
import { useChessStore } from '../stores/chessStore';
import { useStockfish } from '../hooks/useStockfish';
import { useAutoPlay } from '../providers/AutoPlayProvider';
import { CoachFeedback } from './CoachFeedback';
import './ChessBoard.css';

// Better chess piece symbols
const PIECES: { [key: string]: string } = {
  'wP': '♙', // White Pawn
  'wR': '♖', // White Rook
  'wN': '♘', // White Knight
  'wB': '♗', // White Bishop
  'wQ': '♕', // White Queen
  'wK': '♔', // White King
  'bP': '♟', // Black Pawn
  'bR': '♜', // Black Rook
  'bN': '♞', // Black Knight
  'bB': '♝', // Black Bishop
  'bQ': '♛', // Black Queen
  'bK': '♚', // Black King
};

const ChessBoard: React.FC = () => {
  const { game, selectedSquare, validMoves, makeMove, resetGame, isGameOver, winner, moves } = useChessStore();
  const { isReady, autoPlay, analyzePositionForCoaching } = useStockfish();
  const { autoPlayEnabled } = useAutoPlay();
  
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [coachAdvice, setCoachAdvice] = useState<string>('');
  const [isCoachingLoading, setIsCoachingLoading] = useState<boolean>(false);
  const [coachingError, setCoachingError] = useState<string>('');

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
      console.log('�� Auto-play: Black\'s turn detected, triggering AI move...');
      // Add a small delay to allow the UI to update
      const timer = setTimeout(() => {
        console.log('🤖 Executing auto-play with position:', game.fen());
        autoPlay(game.fen(), game.turn(), 15);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [game?.turn(), isReady, isGameOver, autoPlayEnabled, autoPlay]);

  // Evaluate player moves for coaching
  const evaluatePlayerMove = useCallback(async (move: any) => {
    if (!game) return;
    
    try {
      setIsCoachingLoading(true);
      setCoachingError('');
      
             // Get Stockfish evaluation before the move
       const positionBefore = move.before || game.fen();
       const analysisBefore = await analyzePositionForCoaching(positionBefore, 15);
       const evalBefore = analysisBefore?.evaluation || 0;
       
       // Make the move temporarily to get evaluation after
       const tempGame = new (game.constructor as any)();
       tempGame.load(positionBefore);
       
       // Extract move parameters from the move object
       const moveParams = {
         from: move.from,
         to: move.to,
         promotion: move.promotion || undefined
       };
       
       tempGame.move(moveParams);
       const positionAfter = tempGame.fen();
       const analysisAfter = await analyzePositionForCoaching(positionAfter, 15);
       const evalAfter = analysisAfter?.evaluation || 0;
       
       // Get best move and principal variation from the before analysis
       const { bestMove, pv } = analysisBefore || { bestMove: '', pv: '' };
      
      // Prepare data for OpenAI coaching
      const coachingData = {
        lastMove: `${move.from}${move.to}`,
        evalBefore: evalBefore,
        evalAfter: evalAfter,
        bestMove: bestMove,
        pv: pv
      };
      
      // Get coaching advice from OpenAI backend
      const response = await fetch('http://localhost:3001/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coachingData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get coaching advice');
      }
      
      const data = await response.json();
      setCoachAdvice(data.advice);
      
    } catch (error) {
      console.error('Coaching error:', error);
      setCoachingError(error instanceof Error ? error.message : 'Failed to get coaching advice');
    } finally {
      setIsCoachingLoading(false);
    }
  }, [game, moves]);

  

  // Trigger coaching evaluation after each player move
  useEffect(() => {
    if (moves.length > 0 && game && game.turn() === 'b') {
      // Player just made a move (it's now Black's turn)
      const lastPlayerMove = moves[moves.length - 1];
      if (lastPlayerMove.color === 'w') {
        evaluatePlayerMove(lastPlayerMove);
      }
    }
  }, [moves, game, evaluatePlayerMove]);

  const handleSquareClick = (square: string) => {
    if (!game || isGameOver) return;

    if (selectedSquare === square) {
      // Deselect if clicking the same square
      useChessStore.setState({ selectedSquare: null, validMoves: [] });
      return;
    }

    if (selectedSquare && validMoves.includes(square)) {
      // Make the move
      const from = selectedSquare;
      const to = square;
      const piece = game.get(from as any);
      
      if (piece) {
        const move = makeMove(from, to);
        if (move) {
          setLastMove({ from, to });
          // Clear selection after move
          useChessStore.setState({ selectedSquare: null, validMoves: [] });
        }
      }
    } else {
      // Select a piece
      const piece = game.get(square as any);
      if (piece && piece.color === game.turn()) {
        const moves = game.moves({ square: square as any, verbose: true });
        const validSquares = moves.map((move: any) => move.to);
        useChessStore.setState({ selectedSquare: square, validMoves: validSquares });
      }
    }
  };

  const getSquareClass = (square: string) => {
    let className = 'square';
    
    // Light/Dark squares
    const [file, rank] = square.split('');
    const fileIndex = 'abcdefgh'.indexOf(file);
    const rankIndex = parseInt(rank) - 1;
    const isLight = (fileIndex + rankIndex) % 2 === 0;
    className += isLight ? ' light' : ' dark';
    
    // Selected square
    if (selectedSquare === square) {
      className += ' selected';
    }
    
    // Valid move squares
    if (validMoves.includes(square)) {
      className += ' valid-move';
    }
    
    // Last move squares
    if (lastMove && (lastMove.from === square || lastMove.to === square)) {
      className += ' last-move';
    }
    
    return className;
  };

  const getPieceDisplay = (piece: any) => {
    if (!piece) return null;
    
    const pieceKey = `${piece.color}${piece.type.toUpperCase()}`;
    const pieceSymbol = PIECES[pieceKey];
    
    return (
      <div 
        className={`piece ${piece.color === 'w' ? 'white' : 'black'}`}
      >
        {pieceSymbol}
      </div>
    );
  };

  const formatMove = (move: any, index: number) => {
    const moveNumber = Math.floor(index / 2) + 1;
    const isWhiteMove = index % 2 === 0;
    
    if (isWhiteMove) {
      return (
        <span key={index} className="move-entry">
          <span className="move-number">{moveNumber}.</span>
          <span className="move-text">{move.san}</span>
        </span>
      );
    } else {
      return (
        <span key={index} className="move-text">{move.san}</span>
      );
    }
  };

  if (!game) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading chess game...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="board">
        {Array.from({ length: 8 }, (_, rank) => (
          <div key={rank} className="row">
            {Array.from({ length: 8 }, (_, file) => {
              const square = `${String.fromCharCode(97 + file)}${8 - rank}`;
              const piece = game.get(square);
              
              return (
                <div
                  key={square}
                  className={getSquareClass(square)}
                  onClick={() => handleSquareClick(square)}
                  data-square={square}
                >
                  {getPieceDisplay(piece)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="game-info">
        <div className="turn">
          {isGameOver ? 'Game Over' : `${game.turn() === 'w' ? 'White' : 'Black'} to move`}
        </div>
        <div className="subtitle">
          {game.inCheck() && 'Check!'}
          {game.isCheckmate() && 'Checkmate!'}
          {game.isDraw() && 'Draw!'}
          {game.isStalemate() && 'Stalemate!'}
        </div>
        
        {isGameOver && (
          <div className="game-over">
            <h2>{winner ? `Winner: ${winner}` : 'Game Over'}</h2>
            <button className="reset-button" onClick={resetGame}>
              New Game
            </button>
          </div>
        )}
      </div>

      <div className="move-history">
        <h3>Move History</h3>
        <div className="moves-container">
          {moves.length > 0 ? (
            <div className="moves-list">
              {moves.map((move, index) => formatMove(move, index))}
            </div>
          ) : (
            <p className="no-moves">No moves yet. Make the first move!</p>
          )}
        </div>
      </div>

      <CoachFeedback
        advice={coachAdvice}
        isLoading={isCoachingLoading}
        error={coachingError}
      />
    </div>
  );
};

export default ChessBoard;