import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { StockfishEngine } from './services/StockfishEngine';
import OpenAI from 'openai';

// Initialize Stockfish engine
const engine = new StockfishEngine();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ Warning: OPENAI_API_KEY environment variable not set. Coaching functionality will not work.');
}

// Initialize HTTP and WebSocket server
const server = createServer();
const wss = new WebSocketServer({ server });

// Handle HTTP requests
server.on('request', (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Health check endpoint
  if (req.url === '/healthz' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        percentage: (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100,
      },
      engine: {
        status: 'ready',
        lastActivity: new Date().toISOString(),
      },
    }));
    return;
  }
  
  // Engine status endpoint
  if (req.url === '/engine/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ready' }));
    return;
  }
  
  // Coaching endpoint
  if (req.url === '/api/coach' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const { lastMove, evalBefore, evalAfter, bestMove, pv } = JSON.parse(body);
        
        const prompt = `
You are a chess coach. The player just played: ${lastMove}.
Stockfish evaluation before the move: ${evalBefore} centipawns.
Stockfish evaluation after the move: ${evalAfter} centipawns.
Best move suggested by Stockfish: ${bestMove}.
Engine line: ${pv}.

Explain clearly for an intermediate player:
1. Was the move good or bad compared to alternatives?
2. Why?
3. What principle should the player learn from this move?

Keep your response concise and educational.`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300,
        });

        const advice = response.choices[0]?.message?.content || "Unable to generate advice at this time.";
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ advice }));
        
      } catch (error) {
        console.error('Coaching error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to generate coaching advice' }));
      }
    });
    return;
  }
  
  // Default response for unknown routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connect',
    data: {
      message: 'Connected to Chess Engine',
      engineStatus: engine.getStatus(),
    },
  }));

  // Handle messages
  ws.on('message', async (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Received message:', message);

      if (message.type === 'play' && message.data) {
        const { fen, skill = 10, movetime = 1000 } = message.data;
        
        // Send acknowledgment
        ws.send(JSON.stringify({
          type: 'info',
          data: {
            message: 'Engine thinking...',
            skill,
            movetime,
          },
        }));

        // Start engine analysis
        try {
          await engine.play({ fen, skill, movetime });
        } catch (error) {
          console.error('Engine error:', error);
          ws.send(JSON.stringify({
            type: 'error',
            data: error instanceof Error ? error.message : 'Engine error',
          }));
        }
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: 'Invalid message format',
      }));
    }
  });

  // Handle close
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Set up engine event handlers
engine.on('bestmove', (data: { bestmove: string; ponder?: string }) => {
  console.log('Engine best move:', data);
  // Broadcast to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify({
        type: 'bestmove',
        data,
      }));
    }
  });
});

engine.on('info', (info: any) => {
  // Broadcast engine info to all clients
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify({
        type: 'info',
        data: info,
      }));
    }
  });
});

engine.on('error', (error: any) => {
  console.error('Engine error:', error);
  // Broadcast error to all clients
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify({
        type: 'error',
        data: error.toString(),
      }));
    }
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  engine.quit();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  engine.quit();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 3001;

server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Chess Trainer Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/healthz`);
  console.log(`🔌 Engine WebSocket: ws://0.0.0.0:${PORT}`);
  console.log(`🌐 Network accessible at: http://172.20.10.4:${PORT}`);
});
