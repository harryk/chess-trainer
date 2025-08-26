import { EventEmitter } from 'events';

interface EngineAnalysisRequest {
  fen: string;
  depth?: number;
  multiPv?: number;
}

interface EnginePlayRequest {
  fen: string;
  skill?: number;
  movetime?: number;
}

// Mock engine for server-side - actual Stockfish runs on client
export class MockStockfishEngine extends EventEmitter {
  private isReady: boolean = false;
  private isAnalyzing: boolean = false;

  constructor() {
    super();
    this.initializeEngine();
  }

  private initializeEngine(): void {
    console.log('Initializing mock engine (Stockfish runs on client-side)');
    
    // Simulate engine initialization
    setTimeout(() => {
      this.isReady = true;
      this.emit('ready');
      console.log('Mock engine ready - real engine runs on client');
    }, 100);
  }

  public getStatus(): { ready: boolean; analyzing: boolean } {
    return { ready: this.isReady, analyzing: this.isAnalyzing };
  }

  // The server no longer runs Stockfish - it just relays messages
  // All chess engine logic happens on the client side
  public async analyze(request: EngineAnalysisRequest): Promise<void> {
    console.log('Analysis request received, but engine runs on client-side');
  }

  public async play(request: EnginePlayRequest): Promise<void> {
    console.log('Play request received, but engine runs on client-side');
  }

  public stop(): void {
    console.log('Stop request received, but engine runs on client-side');
  }

  public quit(): void {
    console.log('Mock engine shutting down');
    this.isReady = false;
    this.isAnalyzing = false;
  }
}

// Export both for compatibility
export { MockStockfishEngine as StockfishEngine };