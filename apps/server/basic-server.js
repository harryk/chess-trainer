const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connect',
    data: {
      message: 'Connected to Chess Engine',
      engineStatus: { ready: true, analyzing: false },
    },
  }));

  // Handle messages
  ws.on('message', async (data) => {
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

        // Simulate engine thinking for 1 second
        setTimeout(() => {
          // Send a mock best move (e2e4 for simplicity)
          ws.send(JSON.stringify({
            type: 'bestmove',
            data: { bestmove: 'e2e4' },
          }));
        }, 1000);
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

// Add a simple health endpoint
server.on('request', (req, res) => {
  if (req.url === '/healthz' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Basic Chess Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/healthz`);
  console.log(`🔌 Engine WebSocket: ws://localhost:${PORT}`);
});

