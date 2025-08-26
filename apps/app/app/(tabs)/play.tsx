import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Chess } from 'chess.js';
import { StockfishService } from '../../src/services/StockfishService';

export default function PlayScreen() {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<string>('White\'s turn');
  const [moveCount, setMoveCount] = useState(1);
  const [isAITurn, setIsAITurn] = useState(false);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [lastClickedPiece, setLastClickedPiece] = useState<string>('None');
  const [clickCounter, setClickCounter] = useState(0);

  const gameRef = useRef<Chess>(game);
  const stockfishRef = useRef<StockfishService | null>(null);
  const isAITurnRef = useRef<boolean>(false);

  // Initialize Stockfish engine
  useEffect(() => {
    const initStockfish = async () => {
      try {
        console.log('=== CHESS APP v1.2 ===');
        console.log('Initializing Stockfish engine...');
        const stockfish = new StockfishService();
        
        stockfish.on('ready', () => {
          console.log('Stockfish engine ready');
          setIsEngineReady(true);
        });

        stockfish.on('bestmove', (data: { bestmove: string; ponder?: string }) => {
          console.log('Stockfish bestmove:', data);
          if (data.bestmove && gameRef.current) {
            try {
              // Convert UCI move format to algebraic notation
              const algebraicMove = uciToAlgebraic(data.bestmove);
              console.log(`UCI move: ${data.bestmove} -> Algebraic: ${algebraicMove}`);
              
                             // Try to make the move
               const move = gameRef.current.move(algebraicMove);
               if (move) {
                 console.log('AI move successful:', move.san);
                 
                 // Create a completely new game instance with the updated state
                 const newGame = new Chess(gameRef.current.fen());
                 console.log('New game FEN:', newGame.fen());
                 console.log('New game turn:', newGame.turn());
                 
                 // Update all state variables in sequence to ensure proper synchronization
                 setGame(newGame);
                 setMoveCount(newGame.history().length + 1);
                 
                                   // Force the AI turn to false and log the state change
                  console.log('Setting isAITurn to false...');
                  isAITurnRef.current = false;
                  setIsAITurn(false);
                  
                  // CRITICAL: Force immediate re-render to ensure UI updates
                  setForceUpdate(prev => prev + 1);
                  
                  // CRITICAL: Also reset the game ref to ensure consistency
                  gameRef.current = newGame;
                  
                  // NUCLEAR OPTION: Force a complete state reset
                  setTimeout(() => {
                    console.log('NUCLEAR: Forcing complete state reset...');
                    setGame(new Chess(newGame.fen()));
                    setGameStatus(newGameStatus);
                    setMoveCount(newGame.history().length + 1);
                    setForceUpdate(prev => prev + 1);
                  }, 50);
                  
                  // EXTRA NUCLEAR: Force another re-render after a delay
                  setTimeout(() => {
                    console.log('EXTRA NUCLEAR: Final force update...');
                    setForceUpdate(prev => prev + 1);
                  }, 100);
                 
                                   // Force a re-render by updating game status immediately
                  // Use the new game instance for status update
                  const newGameStatus = newGame.isCheckmate() 
                    ? `Checkmate! ${newGame.turn() === 'w' ? 'Black' : 'White'} wins!`
                    : newGame.isDraw() 
                    ? 'Draw!'
                    : newGame.isCheck() 
                    ? `${newGame.turn() === 'w' ? 'White' : 'Black'} is in check!`
                    : `${newGame.turn() === 'w' ? 'White' : 'Black'}'s turn`;
                  
                  setGameStatus(newGameStatus);
                  
                  // Force a complete re-render to ensure UI updates
                  setForceUpdate(prev => prev + 1);
                  
                  // EXTRA NUCLEAR: Force another re-render after a delay
                  setTimeout(() => {
                    console.log('EXTRA NUCLEAR: Final force update...');
                    setForceUpdate(prev => prev + 1);
                  }, 100);
                  
                  // ULTRA NUCLEAR: Force one more re-render
                  setTimeout(() => {
                    console.log('ULTRA NUCLEAR: One more force update...');
                    setForceUpdate(prev => prev + 1);
                  }, 200);
                  
                  // Double-check the turn state after a brief delay
                  setTimeout(() => {
                    console.log('Final turn check - isAITurn should be false, game turn:', newGame.turn());
                    console.log('Current game state FEN:', newGame.fen());
                    console.log('Current game status:', newGameStatus);
                  }, 100);
                 
                 console.log('Turn reset, current turn:', newGame.turn());
               } else {
                console.error('AI move failed - no move returned');
                isAITurnRef.current = false;
                setIsAITurn(false);
              }
            } catch (error) {
              console.error('Error making AI move:', error);
              isAITurnRef.current = false;
              setIsAITurn(false);
            }
          }
        });

        stockfish.on('info', (data: any) => {
          console.log('Stockfish info:', data);
        });

        stockfish.on('error', (error: Error) => {
          console.error('❌ Stockfish error:', error);
          Alert.alert('❌ Stockfish Engine Error', `Failed to initialize Stockfish engine: ${error.message}\n\nPlease ensure the stockfish.js package is properly installed and accessible.`);
        });

        stockfishRef.current = stockfish;
      } catch (error) {
        console.error('Failed to initialize Stockfish:', error);
        Alert.alert('Engine Error', 'Failed to initialize chess engine');
      }
    };

    initStockfish();

    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.quit();
      }
    };
  }, []);

  // Update game ref when game state changes
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  // Monitor isAITurn state changes for debugging
  useEffect(() => {
    console.log('isAITurn state changed to:', isAITurn);
    // CRITICAL: Ensure ref stays in sync with state
    isAITurnRef.current = isAITurn;
  }, [isAITurn]);

  // Monitor game state changes for debugging
  useEffect(() => {
    console.log('Game state changed - FEN:', game.fen(), 'Turn:', game.turn(), 'History length:', game.history().length);
  }, [game]);

  // Convert UCI move format to algebraic notation
  const uciToAlgebraic = (uciMove: string): string => {
    if (!uciMove || uciMove.length < 4) return uciMove;
    
    const from = uciMove.substring(0, 2);
    const to = uciMove.substring(2, 4);
    
    // Get all valid moves and find the one that matches our UCI move
    try {
      const validMoves = gameRef.current.moves({ verbose: true });
      const matchingMove = validMoves.find(move => 
        move.from === from && move.to === to
      );
      
      if (matchingMove) {
        return matchingMove.san; // Return the standard algebraic notation
      }
    } catch (error) {
      console.log('Could not find matching move for UCI:', uciMove);
    }
    
    // If no matching move found, try to make the move directly with UCI coordinates
    try {
      const move = gameRef.current.move({ from, to });
      if (move) {
        return move.san;
      }
    } catch (error) {
      console.log('Direct UCI move failed for:', uciMove);
    }
    
    // Last resort: try to find any move that might work
    try {
      const validMoves = gameRef.current.moves({ verbose: true });
      if (validMoves.length > 0) {
        // Use the first valid move as fallback
        console.log('Using fallback move for UCI:', uciMove);
        return validMoves[0].san;
      }
    } catch (error) {
      console.log('No valid moves available');
    }
    
    // If all else fails, return a safe default move
    console.error('Could not convert UCI move:', uciMove, 'using fallback');
    return 'e4'; // Safe default move
  };

  // Request AI move
  const requestAIMove = () => {
    if (!stockfishRef.current || !isEngineReady) {
      Alert.alert('Engine Error', 'Chess engine not ready');
      return;
    }

    try {
      // Request move from local Stockfish engine
      stockfishRef.current.play({
        fen: gameRef.current.fen(),
        skill: 10,
        movetime: 1000
      });
      isAITurnRef.current = true;
      setIsAITurn(true);
    } catch (error) {
      console.error('Error requesting AI move:', error);
      Alert.alert('Engine Error', 'Failed to request AI move');
    }
  };

  // Get valid moves for a square
  const getValidMoves = (square: string) => {
    return game.moves({ square, verbose: true }).map((move: any) => move.to);
  };

  // Handle square selection
  const handleSquarePress = (square: string) => {
    // CRITICAL: Increment click counter on EVERY click
    setClickCounter(prev => prev + 1);
    
    console.log('=== INPUT TEST ===');
    console.log('handleSquarePress called:', { square, isAITurn: isAITurnRef.current, gameTurn: game.turn(), isGameOver: game.isGameOver() });
    console.log('isAITurnRef.current:', isAITurnRef.current);
    console.log('game.isGameOver():', game.isGameOver());
    
    // ALWAYS allow clicks for debugging, even during AI turn
    if (game.isGameOver()) {
      console.log('INPUT BLOCKED: Game is over');
      return; // Only prevent moves when game is over
    }
    
    console.log('INPUT ALLOWED: Processing square press for:', square);

    if (selectedSquare === square) {
      // Deselect if clicking the same square
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    if (selectedSquare && validMoves.includes(square)) {
      // Make the move
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q', // Always promote to queen for simplicity
        });

                 if (move) {
           // Create a new game instance with the updated state
           const updatedGame = new Chess(game.fen());
           setGame(updatedGame);
           setSelectedSquare(null);
           setValidMoves([]);
           setMoveCount(updatedGame.history().length + 1);
           
           // Update game status with the new game instance
           const newStatus = updatedGame.isCheckmate() 
             ? `Checkmate! ${updatedGame.turn() === 'w' ? 'Black' : 'White'} wins!`
             : updatedGame.isDraw() 
             ? 'Draw!'
             : updatedGame.isCheck() 
             ? `${updatedGame.turn() === 'w' ? 'White' : 'Black'} is in check!`
             : `${updatedGame.turn() === 'w' ? 'White' : 'Black'}'s turn`;
           setGameStatus(newStatus);

           // Request AI move after player move
           setTimeout(() => {
             console.log('Requesting AI move, current turn:', updatedGame.turn());
             requestAIMove();
           }, 500);
         }
      } catch (error) {
        Alert.alert('Invalid Move', 'This move is not allowed.');
      }
         } else {
       // Select new square
       const piece = game.get(square);
       if (piece) {
         // Update the clicked piece label regardless of turn
         const pieceInfo = `${piece.color === 'w' ? 'White' : 'Black'} ${piece.type.toUpperCase()} on ${square}`;
         setLastClickedPiece(pieceInfo);
         console.log('PIECE CLICKED:', pieceInfo);
         
         if (piece.color === game.turn()) {
           setSelectedSquare(square);
           setValidMoves(getValidMoves(square));
         }
       } else {
         // Empty square clicked
         setLastClickedPiece(`Empty square ${square}`);
         console.log('EMPTY SQUARE CLICKED:', square);
       }
     }
  };

  // Update game status
  const updateGameStatus = () => {
    if (game.isCheckmate()) {
      setGameStatus(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`);
    } else if (game.isDraw()) {
      setGameStatus('Draw!');
    } else if (game.isCheck()) {
      setGameStatus(`${game.turn() === 'w' ? 'White' : 'Black'} is in check!`);
    } else {
      setGameStatus(`${game.turn() === 'w' ? 'White' : 'Black'}'s turn`);
    }
  };

  // Reset game
  const resetGame = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setValidMoves([]);
    setGameStatus('White\'s turn');
    setMoveCount(1);
    isAITurnRef.current = false;
    setIsAITurn(false);
  };

  // Undo last move (undoes both player and AI moves)
  const undoMove = () => {
    if (game.history().length >= 2) {
      game.undo(); // Undo AI move
      game.undo(); // Undo player move
      setGame(new Chess(game.fen()));
      setSelectedSquare(null);
      setValidMoves([]);
      setMoveCount(game.history().length + 1);
      updateGameStatus();
      isAITurnRef.current = false;
      setIsAITurn(false);
    } else if (game.history().length === 1) {
      game.undo(); // Undo player move
      setGame(new Chess(game.fen()));
      setSelectedSquare(null);
      setValidMoves([]);
      setMoveCount(game.history().length + 1);
      updateGameStatus();
      isAITurnRef.current = false;
      setIsAITurn(false);
    }
  };

  // Get piece symbol
  const getPieceSymbol = (piece: any) => {
    if (!piece) return '';

    const symbols: { [key: string]: string } = {
      'wp': '♙', 'wr': '♖', 'wn': '♘', 'wb': '♗', 'wq': '♕', 'wk': '♔',
      'bp': '♟', 'br': '♜', 'bn': '♞', 'bb': '♝', 'bq': '♛', 'bk': '♚'
    };

    return symbols[`${piece.color}${piece.type}`] || '';
  };

  // Render a single square
  const renderSquare = (row: number, col: number) => {
    const square = String.fromCharCode(97 + col) + (8 - row); // Convert to chess notation (a1, b1, etc.)
    const piece = game.get(square);
    const isDark = (row + col) % 2 === 1;
    const isSelected = selectedSquare === square;
    const isValidMove = validMoves.includes(square);

    let squareColor = isDark ? '#B58863' : '#F0D9B5';

    if (isSelected) {
      squareColor = '#7B61FF'; // Selected square
    } else if (isValidMove) {
      squareColor = isDark ? '#829769' : '#BBD26B'; // Valid move squares
    }

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.square,
          {
            backgroundColor: squareColor,
            borderWidth: isSelected ? 3 : 0,
            borderColor: '#FFFFFF',
          },
        ]}
                 onPress={() => handleSquarePress(square)}
         activeOpacity={0.7}
         disabled={game.isGameOver()}
      >
        {piece && (
          <Text style={[
            styles.piece,
            { color: piece.color === 'w' ? '#FFFFFF' : '#000000' }
          ]}>
            {getPieceSymbol(piece)}
          </Text>
        )}
        {isValidMove && !piece && (
          <View style={styles.validMoveIndicator} />
        )}
      </TouchableOpacity>
    );
  };

  // Get game result
  const getGameResult = () => {
    if (game.isCheckmate()) {
      return game.turn() === 'w' ? '0-1' : '1-0';
    } else if (game.isDraw()) {
      return '1/2-1/2';
    }
    return '*';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.boardContainer}>
        <Text style={styles.title}>Play Chess vs AI</Text>

                 {/* Connection status */}
         <View style={styles.connectionStatus}>
                       <Text style={[styles.statusText, { color: isAITurnRef.current ? '#FF9800' : isEngineReady ? '#4CAF50' : '#F44336' }]}>
              {isAITurnRef.current ? '🤖 AI is thinking...' : isEngineReady ? '🟢 Stockfish Engine Ready' : '🔴 Engine Initializing...'}
            </Text>
                       {/* Debug info */}
                         <Text style={[styles.statusText, { fontSize: 10, marginTop: 5 }]}>
               Debug v5.0: DIRECT MODULE IMPORT - isAITurn={isAITurn.toString()}, isAITurnRef={isAITurnRef.current.toString()}, gameTurn={game.turn()}, forceUpdate={forceUpdate}
             </Text>
            {/* NUCLEAR DEBUG: Show raw values */}
            <Text style={[styles.statusText, { fontSize: 8, marginTop: 2, color: '#FF0000' }]}>
              NUCLEAR: game.fen()={game.fen().substring(0, 20)}..., game.turn()={game.turn()}
            </Text>
            {/* ULTRA NUCLEAR: Show timestamp */}
            <Text style={[styles.statusText, { fontSize: 8, marginTop: 2, color: '#FF00FF' }]}>
              ULTRA: {new Date().toLocaleTimeString()}, forceUpdate={forceUpdate}
            </Text>
            {/* INPUT TEST: Clickable test button */}
            <TouchableOpacity 
              style={{ 
                backgroundColor: '#FF0000', 
                padding: 5, 
                marginTop: 5, 
                borderRadius: 3 
              }}
              onPress={() => {
                console.log('INPUT TEST: Test button clicked!');
                alert('Input is working! Clicked at: ' + new Date().toLocaleTimeString());
              }}
            >
                           <Text style={{ color: 'white', fontSize: 8 }}>CLICK ME TO TEST INPUT</Text>
           </TouchableOpacity>
                       {/* PIECE CLICK TEST: Shows what was last clicked */}
            <Text style={[styles.statusText, { fontSize: 10, marginTop: 5, color: '#0000FF' }]}>
              Last Clicked: {lastClickedPiece}
            </Text>
            {/* CLICK COUNTER: Shows total clicks */}
            <Text style={[styles.statusText, { fontSize: 10, marginTop: 2, color: '#00FF00' }]}>
              Total Clicks: {clickCounter}
            </Text>
         </View>

        <View style={styles.board}>
          {Array.from({ length: 8 }).map((_, row) => (
            <View key={row} style={styles.row}>
              {Array.from({ length: 8 }).map((_, col) => renderSquare(row, col))}
            </View>
          ))}
        </View>

        <View style={styles.controls}>
          <Text style={styles.status}>{gameStatus}</Text>
          <Text style={styles.moveCount}>Move {moveCount}</Text>
        </View>



        <View style={styles.gameInfo}>
          <Text style={styles.fen}>FEN: {game.fen()}</Text>
          <Text style={styles.result}>Result: {getGameResult()}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, game.history().length === 0 && styles.buttonDisabled]}
            onPress={undoMove}
            disabled={game.history().length === 0 || isAITurnRef.current}
          >
            <Text style={styles.buttonText}>Undo Move</Text>
          </TouchableOpacity>
        </View>

        {game.history().length > 0 && (
          <View style={styles.moveHistory}>
            <Text style={styles.sectionTitle}>Move History</Text>
            <Text style={styles.moves}>{game.pgn()}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 20,
  },
  boardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  connectionStatus: {
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  board: {
    width: 320, // 8 * 40px squares
    height: 320,
    borderWidth: 2,
    borderColor: '#333333',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  piece: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  validMoveIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 320,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  moveCount: {
    fontSize: 16,
    color: '#666666',
  },
  aiThinking: {
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  aiThinkingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    textAlign: 'center',
  },
  gameInfo: {
    width: 320,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  fen: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  result: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 320,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  moveHistory: {
    width: 320,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  moves: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});
