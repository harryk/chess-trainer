import { useEffect, useRef, useCallback, useState } from "react";
import { useChessStore } from '../stores/chessStore';

export interface StockfishMessage {
  type: 'ready' | 'bestmove' | 'info' | 'error';
  data: any;
}

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastMessage, setLastMessage] = useState<StockfishMessage | null>(null);
  
  // Use a ref to track analyzing state without causing re-renders
  const isAnalyzingRef = useRef(false);

  useEffect(() => {
    // Important: type: "classic" - this is crucial!
    workerRef.current = new Worker("/stockfish.wasm.js", { type: "classic" });

    // Attach listener BEFORE sending any messages
    workerRef.current.onmessage = (e) => {
      const message = e.data;
      console.log("📨 Stockfish says:", message);

      if (message === 'readyok') {
        setIsReady(true);
        setLastMessage({ type: 'ready', data: message });
        console.log('✅ Stockfish engine ready');
      } else if (message.startsWith('bestmove')) {
        setIsAnalyzing(false);
        isAnalyzingRef.current = false;
        const parts = message.split(' ');
        const bestmove = parts[1];
        const ponder = parts[3];
        setLastMessage({ 
          type: 'bestmove', 
          data: { bestmove, ponder } 
        });
        console.log('🎯 Best move:', bestmove, ponder ? `ponder: ${ponder}` : '');
      } else if (message.startsWith('info')) {
        setLastMessage({ type: 'info', data: message });
        console.log('📊 Analysis info:', message);
      }
    };

    workerRef.current.onerror = (error) => {
      console.error('❌ Stockfish worker error:', error);
      setLastMessage({ type: 'error', data: error });
    };

    // Send commands *after* attaching onmessage
    console.log('🚀 Initializing Stockfish UCI engine...');
    workerRef.current.postMessage("uci");
    workerRef.current.postMessage("isready");

    return () => {
      workerRef.current?.postMessage("quit");
      workerRef.current?.terminate();
    };
  }, []);

  const send = useCallback((cmd: string) => {
    if (workerRef.current && isReady) {
      console.log('📤 Sending to Stockfish:', cmd);
      workerRef.current.postMessage(cmd);
    } else {
      console.warn('⚠️ Stockfish not ready, command ignored:', cmd);
    }
  }, [isReady]);

  const analyze = useCallback((fen: string, depth: number = 20) => {
    if (!isReady) {
      console.warn('⚠️ Stockfish not ready');
      return;
    }
    
    console.log('🔍 Starting analysis with:', { fen, depth, isReady });
    setIsAnalyzing(true);
    isAnalyzingRef.current = true;
    
    // Simple UCI sequence
    send("ucinewgame");
    send(`position fen ${fen}`);
    send(`go depth ${depth}`);
    
    // Set a timeout to detect if analysis is stuck
    setTimeout(() => {
      if (isAnalyzingRef.current) {
        console.warn('⚠️ Analysis timeout - no response from Stockfish');
        send("stop");
        setIsAnalyzing(false);
        isAnalyzingRef.current = false;
      }
    }, 10000);
  }, [isReady, send]);

  const stop = useCallback(() => {
    if (isReady) {
      send("stop");
      setIsAnalyzing(false);
      isAnalyzingRef.current = false;
    }
  }, [isReady, send]);

  const testEngine = useCallback(() => {
    if (!isReady) {
      console.warn('⚠️ Stockfish not ready for testing');
      return;
    }
    
    console.log('🧪 Testing Stockfish engine...');
    
    // Simple test sequence
    send("ucinewgame");
    send("position startpos");
    send("go depth 3");
    
    // Check response after 2 seconds
    setTimeout(() => {
      console.log('🧪 Checking for responses...');
      if (isAnalyzingRef.current) {
        console.warn('⚠️ Engine still analyzing, stopping...');
        send("stop");
        setIsAnalyzing(false);
        isAnalyzingRef.current = false;
      } else {
        console.log('✅ Engine not analyzing - this is good');
      }
    }, 2000);
    
  }, [isReady, send]);

  const executeEngineMove = useCallback((fen: string, depth: number = 15) => {
    if (!isReady) {
      console.warn('⚠️ Stockfish not ready');
      return null;
    }
    
    console.log('🤖 Getting engine move for position:', fen);
    setIsAnalyzing(true);
    isAnalyzingRef.current = true;
    
    // Reset engine state and analyze
    send("ucinewgame");
    send(`position fen ${fen}`);
    send(`go depth ${depth}`);
    
    // Return a promise that resolves with the best move
    return new Promise<{ bestmove: string; ponder?: string; score?: number }>((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.warn('⚠️ Engine move timeout');
        send("stop");
        setIsAnalyzing(false);
        isAnalyzingRef.current = false;
        reject(new Error('Engine move timeout'));
      }, 15000);
      
      // Store the original onmessage to restore it later
      const originalOnMessage = workerRef.current?.onmessage;
      
      if (workerRef.current) {
        workerRef.current.onmessage = (e) => {
          const message = e.data;
          console.log("🤖 Engine move analysis:", message);
          
          if (message.startsWith('bestmove')) {
            clearTimeout(timeout);
            setIsAnalyzing(false);
            isAnalyzingRef.current = false;
            
            const parts = message.split(' ');
            const bestmove = parts[1];
            const ponder = parts[3];
            
            // Restore original message handler
            if (workerRef.current && originalOnMessage) {
              workerRef.current.onmessage = originalOnMessage;
            }
            
            resolve({ bestmove, ponder });
          }
        };
      }
    });
  }, [isReady, send]);

  const autoPlay = useCallback(async (fen: string, currentTurn: 'w' | 'b', depth: number = 15) => {
    // Only auto-play when it's Black's turn (AI)
    if (currentTurn !== 'b' || !isReady || isAnalyzingRef.current) {
      return;
    }
    
    console.log('🤖 Auto-play: AI turn detected, getting engine move...');
    
    try {
      const result = await executeEngineMove(fen, depth);
      
      if (result && result.bestmove) {
        console.log('🤖 Auto-play: Engine recommends move:', result.bestmove);
        
        // Convert UCI move to chess.js format and make the move
        const move = result.bestmove;
        const from = move.substring(0, 2);
        const to = move.substring(2, 4);
        const promotion = move.length > 4 ? move.substring(4, 5) : undefined;
        
        // Use the chess store to make the move
        const { makeMove } = useChessStore.getState();
        const moveResult = makeMove(from, to, promotion);
        
        if (moveResult) {
          console.log('✅ Auto-play: Engine move executed successfully:', moveResult);
        } else {
          console.warn('⚠️ Auto-play: Failed to execute engine move');
        }
      }
    } catch (error) {
      console.error('❌ Auto-play error:', error);
    }
  }, [isReady, executeEngineMove]);

  return { 
    send, 
    analyze, 
    stop, 
    testEngine,
    executeEngineMove,
    autoPlay,
    isReady, 
    isAnalyzing, 
    lastMessage 
  };
}
