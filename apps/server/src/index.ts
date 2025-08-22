import { Hono } from 'hono';
import { WebSocketServer } from 'ws';
import { Chess } from 'chess.js';
import { ChessGame, ChessMove, ApiResponse } from '@chess-trainer/shared';

const app = new Hono();
const port = process.env.PORT || 3001;

// In-memory storage for games (in production, use a database)
const games = new Map<string, Chess>();

// WebSocket server
const wss = new WebSocketServer({ port: 3002 });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      handleWebSocketMessage(ws, data);
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

function handleWebSocketMessage(ws: any, data: any) {
  switch (data.type) {
    case 'join_game':
      const game = games.get(data.gameId);
      if (game) {
        ws.gameId = data.gameId;
        ws.send(JSON.stringify({
          type: 'game_state',
          game: getGameState(data.gameId)
        }));
      }
      break;
    case 'make_move':
      if (ws.gameId) {
        const game = games.get(ws.gameId);
        if (game) {
          try {
            const move = game.move(data.move);
            if (move) {
              // Broadcast move to all players in the game
              wss.clients.forEach((client: any) => {
                if (client.gameId === ws.gameId && client.readyState === 1) {
                  client.send(JSON.stringify({
                    type: 'move_made',
                    move: move,
                    game: getGameState(ws.gameId)
                  }));
                }
              });
            }
          } catch (error) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Invalid move'
            }));
          }
        }
      }
      break;
  }
}

function getGameState(gameId: string) {
  const game = games.get(gameId);
  if (!game) return null;

  return {
    id: gameId,
    fen: game.fen(),
    moves: game.history({ verbose: true }),
    isGameOver: game.isGameOver(),
    winner: game.isCheckmate() ? (game.turn() === 'w' ? 'black' : 'white') : undefined
  };
}

// REST API endpoints
app.get('/', (c) => {
  return c.json({ message: 'Chess Trainer Server' });
});

app.post('/api/games', (c) => {
  const gameId = Math.random().toString(36).substring(7);
  const chess = new Chess();
  games.set(gameId, chess);
  
  const response: ApiResponse<{ gameId: string }> = {
    success: true,
    data: { gameId }
  };
  
  return c.json(response);
});

app.get('/api/games/:id', (c) => {
  const gameId = c.req.param('id');
  const game = games.get(gameId);
  
  if (!game) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Game not found'
    };
    return c.json(response, 404);
  }
  
  const response: ApiResponse<ChessGame> = {
    success: true,
    data: getGameState(gameId)!
  };
  
  return c.json(response);
});

app.post('/api/games/:id/moves', async (c) => {
  const gameId = c.req.param('id');
  const game = games.get(gameId);
  
  if (!game) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Game not found'
    };
    return c.json(response, 404);
  }
  
  const body = await c.req.json();
  const { move } = body;
  
  try {
    const result = game.move(move);
    if (result) {
      const response: ApiResponse<ChessMove> = {
        success: true,
        data: result
      };
      return c.json(response);
    } else {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid move'
      };
      return c.json(response, 400);
    }
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid move'
    };
    return c.json(response, 400);
  }
});

console.log(`Server running on port ${port}`);
console.log(`WebSocket server running on port 3002`);

export default {
  port,
  fetch: app.fetch,
};

