import { StockfishService } from './StockfishService';

export type EvalResult = {
  lastMove: string;
  evalBefore: number; // centipawns
  evalAfter: number;
  bestMove: string;
  pv: string;
};

export class CoachingService {
  private stockfish: StockfishService;

  constructor(stockfish: StockfishService) {
    this.stockfish = stockfish;
  }

  /**
   * Evaluates a position using Stockfish
   */
  private async evaluatePosition(moves: string[]): Promise<{ eval: number; bestMove: string; pv: string }> {
    return new Promise((resolve) => {
      let evalScore = 0;
      let bestMove = "";
      let pv = "";

      const handleInfo = (info: any) => {
        if (info.score?.cp !== undefined) {
          evalScore = info.score.cp;
        }
        if (info.pv && info.pv.length > 0) {
          pv = info.pv.join(' ');
        }
      };

      const handleBestMove = (data: { bestmove: string; ponder?: string }) => {
        bestMove = data.bestmove;
        this.stockfish.off('info', handleInfo);
        this.stockfish.off('bestmove', handleBestMove);
        resolve({ eval: evalScore, bestMove, pv });
      };

      this.stockfish.on('info', handleInfo);
      this.stockfish.on('bestmove', handleBestMove);

      // Set position and start analysis
      const movesString = moves.length > 0 ? `moves ${moves.join(' ')}` : '';
      this.stockfish.analyze({ fen: 'startpos', depth: 12 });
    });
  }

  /**
   * Evaluates the last move by comparing positions before and after
   */
  async evaluateMove(moves: string[]): Promise<EvalResult> {
    if (moves.length === 0) {
      throw new Error('No moves to evaluate');
    }

    const lastMove = moves[moves.length - 1];
    const movesBefore = moves.slice(0, -1);

    // Evaluate position before the last move
    const before = await this.evaluatePosition(movesBefore);
    
    // Evaluate position after the last move
    const after = await this.evaluatePosition(moves);

    return {
      lastMove,
      evalBefore: before.eval,
      evalAfter: after.eval,
      bestMove: after.bestMove,
      pv: after.pv,
    };
  }

  /**
   * Converts chess.js move to UCI format
   */
  static moveToUCI(move: any): string {
    return `${move.from}${move.to}${move.promotion || ''}`;
  }

  /**
   * Converts chess.js moves array to UCI format
   */
  static movesToUCI(moves: any[]): string[] {
    return moves.map(move => this.moveToUCI(move));
  }
}
