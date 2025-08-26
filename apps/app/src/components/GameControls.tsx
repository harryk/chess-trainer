import React, { useState } from 'react';
import { useChessStore } from '../stores/chessStore';
import { useStockfish } from '../hooks/useStockfish';
import { useAutoPlay } from '../providers/AutoPlayProvider';
import './GameControls.css';

export const GameControls: React.FC = () => {
  const {
    game,
    resetGame,
    isGameOver,
    winner
  } = useChessStore();

  const {
    analyze,
    stop,
    testEngine,
    executeEngineMove,
    isReady,
    isAnalyzing,
    lastMessage
  } = useStockfish();

  const { autoPlayEnabled, setAutoPlayEnabled } = useAutoPlay();
  const [analysisDepth, setAnalysisDepth] = useState(20);

  const handleAnalyze = () => {
    if (game && isReady) {
      analyze(game.fen(), analysisDepth);
    }
  };

  const handleStop = () => {
    stop();
  };

  const handleEngineMove = () => {
    if (game && isReady) {
      analyze(game.fen(), 15);
    }
  };

  const handleTestEngine = () => {
    if (isReady) {
      testEngine();
    }
  };

  const handleMakeEngineMove = async () => {
    if (!game || !isReady || isAnalyzing) {
      console.warn('⚠️ Cannot make engine move - game not ready or already analyzing');
      return;
    }

    try {
      console.log('🤖 Requesting engine move...');
      const result = await executeEngineMove(game.fen(), 15);
      
      if (result && result.bestmove) {
        console.log('🤖 Engine recommends move:', result.bestmove);
        
        // Convert UCI move to chess.js format and make the move
        const move = result.bestmove;
        const from = move.substring(0, 2);
        const to = move.substring(2, 4);
        const promotion = move.length > 4 ? move.substring(4, 5) : undefined;
        
        // Use the chess store to make the move
        const { makeMove } = useChessStore.getState();
        const moveResult = makeMove(from, to, promotion);
        
        if (moveResult) {
          console.log('✅ Engine move executed successfully:', moveResult);
        } else {
          console.warn('⚠️ Failed to execute engine move');
        }
      }
    } catch (error) {
      console.error('❌ Error getting engine move:', error);
    }
  };

  return (
    <div className="game-controls">
      <div className="control-section">
        <h3>Game Controls</h3>
        <div className="button-group">
          <button
            onClick={resetGame}
            className="control-btn"
          >
            New Game
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Stockfish Engine</h3>
        <div className="engine-status">
          <span className={`status-indicator ${isReady ? 'ready' : 'not-ready'}`}>
            {isReady ? '🟢 Ready' : '🔴 Not Ready'}
          </span>
          {isAnalyzing && <span className="analyzing">🔍 Analyzing...</span>}
        </div>

        <div className="auto-play-toggle">
          <label>
            <input
              type="checkbox"
              checked={autoPlayEnabled}
              onChange={(e) => setAutoPlayEnabled(e.target.checked)}
            />
            🤖 Auto-play AI moves
          </label>
          <small>When enabled, Black (AI) will automatically make moves</small>
        </div>

        <div className="button-group">
          <button
            onClick={handleAnalyze}
            disabled={!isReady || isAnalyzing}
            className="control-btn"
          >
            Analyze Position
          </button>
          <button
            onClick={handleStop}
            disabled={!isAnalyzing}
            className="control-btn"
          >
            Stop Analysis
          </button>
          <button
            onClick={handleEngineMove}
            disabled={!isReady || isAnalyzing}
            className="control-btn"
          >
            Get Engine Move
          </button>
          <button
            onClick={handleTestEngine}
            disabled={!isReady}
            className="control-btn test-btn"
          >
            Test Engine
          </button>
          <button
            onClick={handleMakeEngineMove}
            disabled={!isReady || isAnalyzing || isGameOver}
            className="control-btn engine-move-btn"
          >
            🤖 Make Engine Move
          </button>
        </div>

        <div className="analysis-controls">
          <label>
            Analysis Depth:
            <input
              type="range"
              min="1"
              max="30"
              value={analysisDepth}
              onChange={(e) => setAnalysisDepth(Number(e.target.value))}
              disabled={isAnalyzing}
            />
            <span>{analysisDepth}</span>
          </label>
        </div>

        {lastMessage && (
          <div className="engine-output">
            <h4>Engine Output:</h4>
            <pre>{JSON.stringify(lastMessage, null, 2)}</pre>
          </div>
        )}
      </div>

      {isGameOver && (
        <div className="game-result">
          <h3>Game Over</h3>
          <p>{winner ? `${winner === 'white' ? 'White' : winner === 'black' ? 'Black' : 'Draw'} wins!` : 'Draw!'}</p>
        </div>
      )}
    </div>
  );
};
