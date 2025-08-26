# Chess Trainer Shared Package

This package contains shared types, constants, and utilities for the Chess Trainer application.

## Chess Engine WebSocket API

The chess engine server provides a WebSocket endpoint for real-time chess analysis and AI gameplay using Stockfish.

### Connection

**Endpoint:** `ws://localhost:3001/ws/engine`

**Protocol:** WebSocket

### Message Format

All messages use the following structure:

```typescript
interface WebSocketMessage {
  id?: string;           // Optional message ID for tracking
  timestamp: number;     // Unix timestamp in milliseconds
  data: any;            // Message payload
}
```

### Request Types

#### 1. Analysis Request

Request chess position analysis with specified depth and multi-PV lines.

```typescript
interface EngineAnalysisRequest {
  type: 'analyze';
  fen: string;           // FEN string of the position
  depth?: number;        // Analysis depth (default: 20, max: 50)
  multiPv?: number;     // Number of principal variations (default: 1, max: 5)
}
```

**Example:**
```json
{
  "id": "analysis-1",
  "timestamp": 1640995200000,
  "data": {
    "type": "analyze",
    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "depth": 25,
    "multiPv": 3
  }
}
```

#### 2. Play Request

Request the engine to play a move in the given position.

```typescript
interface EnginePlayRequest {
  type: 'play';
  fen: string;           // FEN string of the position
  skill?: number;        // Engine skill level (default: 20, max: 20)
  movetime?: number;     // Maximum thinking time in ms (default: 1000, max: 30000)
}
```

**Example:**
```json
{
  "id": "play-1",
  "timestamp": 1640995200000,
  "data": {
    "type": "play",
    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "skill": 15,
    "movetime": 5000
  }
}
```

### Response Types

#### 1. Info Updates

Real-time analysis information during engine calculation.

```typescript
interface EngineInfo {
  depth?: number;        // Current search depth
  seldepth?: number;     // Selective search depth
  time?: number;         // Time spent in milliseconds
  nodes?: number;        // Nodes searched
  multipv?: number;      // Principal variation number
  score?: {
    cp?: number;         // Centipawn score (positive = white advantage)
    mate?: number;       // Mate in N moves (positive = white mates)
  };
  pv?: string[];         // Principal variation moves (UCI format)
  nps?: number;          // Nodes per second
  tbhits?: number;       // Tablebase hits
  hashfull?: number;     // Hash table usage percentage
}
```

**Example:**
```json
{
  "type": "info",
  "data": {
    "depth": 15,
    "time": 1250,
    "nodes": 1250000,
    "score": { "cp": 25 },
    "pv": ["e2e4", "e7e5", "g1f3"],
    "nps": 1000000
  }
}
```

#### 2. Best Move

Final engine move after analysis completion.

```typescript
interface BestMoveResponse {
  type: 'bestmove';
  data: {
    bestmove: string;    // Best move in UCI format (e.g., "e2e4")
    ponder?: string;     // Ponder move (if available)
  };
}
```

**Example:**
```json
{
  "type": "bestmove",
  "data": {
    "bestmove": "e2e4",
    "ponder": "e7e5"
  }
}
```

#### 3. Engine Ready

Confirmation that the engine is ready to accept requests.

```typescript
interface ReadyResponse {
  type: 'readyok';
  data: string;          // "Engine ready"
}
```

#### 4. Error Response

Error messages for invalid requests or engine failures.

```typescript
interface ErrorResponse {
  type: 'error';
  data: string;          // Error description
}
```

### Connection Management

#### Connection Status

The server tracks connection status and provides connection statistics.

```typescript
interface ConnectionStatus {
  connected: boolean;    // Whether the connection is active
  lastPing?: number;     // Last ping timestamp
  latency?: number;      // Connection latency in milliseconds
}
```

#### Health Check

**Endpoint:** `GET /healthz`

Returns server health status including engine status.

```typescript
interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;     // ISO timestamp
  uptime: number;        // Server uptime in seconds
  memory: {
    used: number;        // Memory usage in bytes
    total: number;       // Total memory in bytes
    percentage: number;  // Memory usage percentage
  };
  engine: {
    status: 'ready' | 'busy' | 'error';
    lastActivity?: string; // Last engine activity timestamp
  };
}
```

### Usage Examples

#### JavaScript/TypeScript Client

```typescript
import { EngineRequest, EngineAnalysisRequest } from '@chess-trainer/shared';

class ChessEngineClient {
  private ws: WebSocket;
  private messageId = 0;

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      this.handleResponse(response);
    };

    this.ws.onopen = () => {
      console.log('Connected to chess engine');
    };
  }

  public analyzePosition(fen: string, depth: number = 20, multiPv: number = 1) {
    const request: EngineAnalysisRequest = {
      type: 'analyze',
      fen,
      depth,
      multiPv,
    };

    this.sendMessage(request);
  }

  public playMove(fen: string, skill: number = 20, movetime: number = 1000) {
    const request: EnginePlayRequest = {
      type: 'play',
      fen,
      skill,
      movetime,
    };

    this.sendMessage(request);
  }

  private sendMessage(data: any) {
    const message = {
      id: `msg-${++this.messageId}`,
      timestamp: Date.now(),
      data,
    };

    this.ws.send(JSON.stringify(message));
  }

  private handleResponse(response: any) {
    switch (response.type) {
      case 'info':
        console.log('Analysis update:', response.data);
        break;
      case 'bestmove':
        console.log('Best move:', response.data.bestmove);
        break;
      case 'error':
        console.error('Engine error:', response.data);
        break;
    }
  }
}

// Usage
const client = new ChessEngineClient('ws://localhost:3001/ws/engine');

// Analyze starting position
client.analyzePosition(
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  25,
  3
);

// Get engine move
client.playMove(
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
  15,
  2000
);
```

#### Python Client

```python
import websockets
import json
import asyncio
from typing import Dict, Any

class ChessEngineClient:
    def __init__(self, url: str):
        self.url = url
        self.message_id = 0

    async def connect(self):
        self.websocket = await websockets.connect(self.url)
        print("Connected to chess engine")

    async def analyze_position(self, fen: str, depth: int = 20, multi_pv: int = 1):
        request = {
            "type": "analyze",
            "fen": fen,
            "depth": depth,
            "multiPv": multi_pv
        }
        
        await self.send_message(request)

    async def play_move(self, fen: str, skill: int = 20, movetime: int = 1000):
        request = {
            "type": "play",
            "fen": fen,
            "skill": skill,
            "movetime": movetime
        }
        
        await self.send_message(request)

    async def send_message(self, data: Dict[str, Any]):
        message = {
            "id": f"msg-{self.message_id}",
            "timestamp": int(asyncio.get_event_loop().time() * 1000),
            "data": data
        }
        
        self.message_id += 1
        await self.websocket.send(json.dumps(message))

    async def listen(self):
        async for message in self.websocket:
            response = json.loads(message)
            await self.handle_response(response)

    async def handle_response(self, response: Dict[str, Any]):
        response_type = response.get("type")
        
        if response_type == "info":
            print(f"Analysis update: {response['data']}")
        elif response_type == "bestmove":
            print(f"Best move: {response['data']['bestmove']}")
        elif response_type == "error":
            print(f"Engine error: {response['data']}")

# Usage
async def main():
    client = ChessEngineClient("ws://localhost:3001/ws/engine")
    await client.connect()
    
    # Start listening for responses
    asyncio.create_task(client.listen())
    
    # Analyze starting position
    await client.analyze_position(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        25,
        3
    )
    
    # Keep connection alive
    await asyncio.sleep(30)

if __name__ == "__main__":
    asyncio.run(main())
```

### Error Handling

#### Common Error Scenarios

1. **Invalid FEN**: The server validates FEN strings before processing
2. **Engine Busy**: Cannot start new analysis while engine is calculating
3. **Engine Not Ready**: Engine initialization failed or not complete
4. **Invalid Parameters**: Depth, MultiPV, skill, or movetime out of bounds

#### Error Response Format

```json
{
  "type": "error",
  "data": "Engine is already analyzing"
}
```

### Performance Considerations

- **Analysis Depth**: Higher depths provide better analysis but take longer
- **Multi-PV**: Multiple principal variations increase calculation time
- **Skill Level**: Higher skill levels may use more time for better moves
- **Move Time**: Set appropriate time limits for real-time gameplay

### Security Notes

- The WebSocket endpoint is not authenticated by default
- Implement authentication for production use
- Validate all incoming FEN strings
- Rate limit requests to prevent abuse
- Monitor connection counts and resource usage

### Troubleshooting

#### Common Issues

1. **Connection Refused**: Ensure server is running on correct port
2. **Engine Not Responding**: Check if Stockfish is properly initialized
3. **Invalid Messages**: Verify message format and required fields
4. **Performance Issues**: Adjust depth, MultiPV, and time limits

#### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=chess-engine npm run dev
```

### API Limits

- **Maximum Analysis Depth**: 50
- **Maximum Multi-PV Lines**: 5
- **Maximum Skill Level**: 20
- **Maximum Move Time**: 30 seconds
- **Maximum Concurrent Connections**: Unlimited (monitor server resources)

