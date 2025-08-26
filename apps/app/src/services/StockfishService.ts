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

interface EngineInfo {
  depth?: number;
  nodes?: number;
  score?: { cp?: number; mate?: number };
  pv?: string[];
  time?: number;
}

interface EngineBestMove {
  bestmove: string;
  ponder?: string;
}

// Simple event emitter
class SimpleEventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, data?: any): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  off(event: string, callback: Function): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb: Function) => cb !== callback);
    }
  }
}

// Stockfish service using stockfish.js package
export class StockfishService extends SimpleEventEmitter {
  private engine: any = null;
  private isReady: boolean = false;
  private isAnalyzing: boolean = false;
  private messageQueue: string[] = [];
  private isProcessing: boolean = false;

  constructor() {
    super();
    this.initializeEngine();
  }

  private async initializeEngine(): Promise<void> {
    try {
      console.log('🚀 Initializing Stockfish engine using stockfish.js package...');
      
      // Try to load stockfish.js package using dynamic import
      let StockfishModule: any = null;
      
      try {
        console.log('📦 Trying to load stockfish.js package...');
        // @ts-ignore - Ignore TypeScript module resolution issues
        StockfishModule = await import('stockfish.js');
        console.log('✅ Stockfish.js package loaded successfully');
        console.log('🔍 Module structure:', Object.keys(StockfishModule));
        console.log('🔍 Module type:', typeof StockfishModule);
        
        // Check if the module has the expected structure
        if (StockfishModule && typeof StockfishModule === 'function') {
          console.log('✅ Found function export, creating engine instance...');
          
          // Create the engine instance
          this.engine = StockfishModule();
          console.log('🔧 Stockfish engine instance created:', this.engine);

          // Check if the engine has the required methods
          if (this.engine && typeof this.engine.postMessage === 'function') {
            console.log('✅ Engine has postMessage method');
            
            // Set up message handling
            this.engine.onmessage = (event: any) => {
              this.handleEngineMessage(event.data);
            };

            // Initialize the engine
            this.sendMessage('uci');
            this.sendMessage('isready');

            // Wait for engine to be ready
            setTimeout(() => {
              if (!this.isReady) {
                console.warn('⚠️ Engine not ready after timeout, proceeding anyway...');
                this.isReady = true;
                this.emit('ready');
              }
            }, 5000);

          } else {
            console.error('❌ Engine missing required methods');
            console.log('🔍 Engine methods:', Object.getOwnPropertyNames(this.engine));
            throw new Error('Stockfish module missing required methods');
          }

        } else if (StockfishModule && StockfishModule.default && typeof StockfishModule.default === 'function') {
          console.log('✅ Found default function export, creating engine instance...');
          
          // Create the engine instance from the default export
          this.engine = StockfishModule.default();
          console.log('🔧 Stockfish engine instance created:', this.engine);

          // Check if the engine has the required methods
          if (this.engine && typeof this.engine.postMessage === 'function') {
            console.log('✅ Engine has postMessage method');
            
            // Set up message handling
            this.engine.onmessage = (event: any) => {
              this.handleEngineMessage(event.data);
            };

            // Initialize the engine
            this.sendMessage('uci');
            this.sendMessage('isready');

            // Wait for engine to be ready
            setTimeout(() => {
              if (!this.isReady) {
                console.warn('⚠️ Engine not ready after timeout, proceeding anyway...');
                this.isReady = true;
                this.emit('ready');
              }
            }, 5000);

          } else {
            console.error('❌ Engine missing required methods');
            console.log('🔍 Engine methods:', Object.getOwnPropertyNames(this.engine));
            throw new Error('Stockfish module missing required methods');
          }

        } else {
          console.error('❌ Module is not a function and no default function found');
          console.log('🔍 Module:', StockfishModule);
          console.log('🔍 Module.default:', StockfishModule?.default);
          console.log('🔍 Module.default type:', typeof StockfishModule?.default);
          throw new Error('Stockfish module is not a function and no default function found');
        }

      } catch (importError) {
        console.error('❌ Failed to load stockfish.js package:', importError);
        throw new Error('Could not load Stockfish engine module');
      }

    } catch (error) {
      console.error('❌ Failed to initialize Stockfish engine:', error);
      this.emit('error', error);
    }
  }

  private handleEngineMessage(message: string): void {
    console.log('📨 Engine message:', message);
    
    if (message === 'readyok') {
      console.log('✅ Stockfish engine ready');
      this.isReady = true;
      this.emit('ready');
      
      // Configure engine
      this.sendMessage('setoption name MultiPV value 1');
      this.sendMessage('setoption name Threads value 1');
      this.sendMessage('setoption name Hash value 16');
      
    } else if (message.startsWith('bestmove')) {
      const parts = message.split(' ');
      const bestmove = parts[1];
      const ponder = parts[3];
      
      console.log('🎯 Engine best move:', bestmove, ponder ? `ponder: ${ponder}` : '');
      this.isAnalyzing = false;
      this.emit('bestmove', { bestmove, ponder });
      
    } else if (message.startsWith('info')) {
      this.parseInfoMessage(message);
    }
  }

  private parseInfoMessage(message: string): void {
    const parts = message.split(' ');
    const info: EngineInfo = {};
    
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      
      switch (part) {
        case 'depth':
          info.depth = parseInt(parts[++i]);
          break;
        case 'nodes':
          info.nodes = parseInt(parts[++i]);
          break;
        case 'time':
          info.time = parseInt(parts[++i]);
          break;
        case 'score':
          const scoreType = parts[++i];
          const scoreValue = parseInt(parts[++i]);
          if (scoreType === 'cp') {
            info.score = { cp: scoreValue };
          } else if (scoreType === 'mate') {
            info.score = { mate: scoreValue };
          }
          break;
        case 'pv':
          const pv: string[] = [];
          while (++i < parts.length && !parts[i].startsWith('info')) {
            pv.push(parts[i]);
          }
          if (pv.length > 0) {
            info.pv = pv;
            i--; // Adjust for the loop increment
          }
          break;
      }
    }
    
    if (Object.keys(info).length > 0) {
      this.emit('info', info);
    }
  }

  private sendMessage(message: string): void {
    if (this.engine && this.isReady) {
      this.engine.postMessage(message);
    } else {
      // Queue message if engine not ready
      this.messageQueue.push(message);
    }
  }

  private processMessageQueue(): void {
    if (this.isProcessing || !this.isReady || !this.engine) return;
    
    this.isProcessing = true;
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.engine.postMessage(message);
      }
    }
    this.isProcessing = false;
  }

  public async analyze(request: EngineAnalysisRequest): Promise<void> {
    if (!this.isReady) throw new Error('Engine not ready');
    if (this.isAnalyzing) throw new Error('Engine is already analyzing');
    
    this.isAnalyzing = true;
    console.log('🔍 Starting Stockfish analysis for position:', request.fen);
    
    try {
      // Set position
      this.sendMessage(`position fen ${request.fen}`);
      
      // Start analysis
      const depth = request.depth || 20;
      this.sendMessage(`go depth ${depth}`);
      
    } catch (error) {
      this.isAnalyzing = false;
      throw error;
    }
  }

  public async play(request: EnginePlayRequest): Promise<void> {
    if (!this.isReady) throw new Error('Engine not ready');
    if (this.isAnalyzing) throw new Error('Engine is already analyzing');
    
    this.isAnalyzing = true;
    console.log('🎮 Requesting Stockfish move for position:', request.fen);
    
    try {
      // Set position
      this.sendMessage(`position fen ${request.fen}`);
      
      // Set skill level if specified
      if (request.skill !== undefined) {
        this.sendMessage(`setoption name Skill Level value ${request.skill}`);
      }
      
      // Start move calculation
      if (request.movetime) {
        this.sendMessage(`go movetime ${request.movetime}`);
      } else {
        this.sendMessage('go movetime 1000'); // Default 1 second
      }
      
    } catch (error) {
      this.isAnalyzing = false;
      throw error;
    }
  }

  public stop(): void {
    if (this.isAnalyzing) {
      console.log('⏹️ Stopping Stockfish analysis');
      this.sendMessage('stop');
      this.isAnalyzing = false;
    }
  }

  public quit(): void {
    console.log('👋 Quitting Stockfish engine');
    if (this.engine) {
      this.sendMessage('quit');
      this.engine = null;
    }
    this.isReady = false;
    this.isAnalyzing = false;
  }

  // Method to check if engine is ready
  public getReady(): boolean {
    return this.isReady;
  }

  // Method to check if engine is analyzing
  public getAnalyzing(): boolean {
    return this.isAnalyzing;
  }
}
