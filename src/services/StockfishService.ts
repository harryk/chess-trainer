import Stockfish from 'stockfish';

export class StockfishService {
  private engine: any;
  private isReady = false;

  constructor() {
    this.engine = Stockfish();
    this.initializeEngine();
  }

  private initializeEngine() {
    this.engine.addMessageListener((message: string) => {
      console.log('Stockfish:', message);

      if (message === 'uciok') {
        this.isReady = true;
        console.log('✅ Stockfish engine ready!');
      }
    });

    // Send UCI commands to initialize the engine
    this.engine.postMessage('uci');
    this.engine.postMessage('isready');
  }

  public async getBestMove(fen: string, depth: number = 10): Promise<string> {
    if (!this.isReady) {
      throw new Error('Engine not ready yet');
    }

    return new Promise((resolve, reject) => {
      let bestMove = '';

      const messageHandler = (message: string) => {
        if (message.startsWith('bestmove')) {
          bestMove = message.split(' ')[1];
          this.engine.removeMessageListener(messageHandler);
          resolve(bestMove);
        }
      };

      this.engine.addMessageListener(messageHandler);

      // Set position and calculate best move
      this.engine.postMessage(`position fen ${fen}`);
      this.engine.postMessage(`go depth ${depth}`);
    });
  }

  public isEngineReady(): boolean {
    return this.isReady;
  }

  public destroy() {
    if (this.engine) {
      this.engine.postMessage('quit');
    }
  }
}
