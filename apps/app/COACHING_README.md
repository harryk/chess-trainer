# Chess Coaching Feature

This document describes the chess coaching functionality that has been implemented in the Chess Trainer Pro application.

## Overview

The coaching feature provides real-time analysis and feedback on player moves using:
- **Stockfish chess engine** for position evaluation
- **OpenAI GPT-4** for natural language coaching advice
- **Real-time move analysis** after each player move

## How It Works

### 1. Move Evaluation
When a player makes a move:
1. The `CoachingService` evaluates the position before and after the move
2. Stockfish analyzes both positions to determine evaluation changes
3. The evaluation results are sent to the backend coaching endpoint

### 2. AI Coaching
The backend:
1. Receives evaluation data (lastMove, evalBefore, evalAfter, bestMove, pv)
2. Sends a structured prompt to OpenAI GPT-4
3. Returns natural language coaching advice

### 3. User Interface
The `CoachFeedback` component displays:
- Loading state while analyzing
- Coaching advice when available
- Error messages if something goes wrong

## Components

### CoachingService (`apps/app/src/services/CoachingService.ts`)
- `evaluateMove(moves: string[]): Promise<EvalResult>` - Evaluates the last move
- `moveToUCI(move: any): string` - Converts chess.js moves to UCI format
- `movesToUCI(moves: any[]): string[]` - Converts move arrays to UCI format

### CoachFeedback (`apps/app/src/components/CoachFeedback.tsx`)
- Displays coaching feedback with loading states
- Handles errors gracefully
- Responsive design for mobile and desktop

### Backend Endpoint (`apps/server/src/index.ts`)
- `POST /api/coach` - Receives evaluation data and returns coaching advice
- Uses OpenAI GPT-4o-mini for natural language generation
- Structured prompt for consistent coaching quality

## Setup Requirements

### Backend
1. Install OpenAI dependency: `pnpm add openai`
2. Set environment variable: `OPENAI_API_KEY=your-api-key-here`
3. Start server: `pnpm dev`

### Frontend
1. Ensure Stockfish is working (already implemented)
2. Coaching service initializes automatically when Stockfish is ready
3. No additional setup required

## Usage

1. **Start a game** - The coaching service initializes automatically
2. **Make a move** - After each player move, coaching analysis begins
3. **View feedback** - Coaching advice appears below the move history
4. **Learn** - Each piece of advice includes:
   - Whether the move was good or bad
   - Why it was good or bad
   - What principle to learn from it

## Example Coaching Response

```
🎯 Coach's Feedback

Your move e2e4 was excellent! Here's why:

1. **Move Quality**: This is the best opening move for White
2. **Why**: It controls the center, develops a piece, and opens lines for both the queen and bishop
3. **Principle**: Always fight for the center in the opening - it gives you more control and attacking opportunities

The engine evaluation improved from 0 to +25 centipawns, confirming this is a strong move.
```

## Technical Details

### Evaluation Process
- **Depth**: 12 plies (configurable)
- **Format**: UCI protocol for Stockfish communication
- **Timing**: Asynchronous evaluation to avoid blocking the UI

### Error Handling
- Network failures when calling OpenAI
- Stockfish engine issues
- Invalid move data
- Graceful fallbacks for all error cases

### Performance
- Coaching analysis runs in background
- No impact on game performance
- Cached responses to avoid duplicate analysis

## Future Enhancements

- **Move difficulty rating** - Adjust advice based on player skill
- **Opening book integration** - Provide opening-specific advice
- **Tactical training** - Focus on specific tactical themes
- **Progress tracking** - Track improvement over time
- **Custom coaching styles** - Different coaching personalities

## Troubleshooting

### Common Issues
1. **No coaching feedback**: Check if Stockfish is ready and OpenAI API key is set
2. **Slow responses**: Increase Stockfish depth or reduce OpenAI token limit
3. **API errors**: Verify OpenAI API key and account status

### Debug Mode
Enable console logging to see:
- Stockfish evaluation process
- OpenAI API calls
- Coaching service initialization

## API Reference

### POST /api/coach
**Request Body:**
```json
{
  "lastMove": "e2e4",
  "evalBefore": 0,
  "evalAfter": 25,
  "bestMove": "e7e5",
  "pv": "e7e5 g1f3 b8c6"
}
```

**Response:**
```json
{
  "advice": "Your move e2e4 was excellent! Here's why..."
}
```

## Contributing

To extend the coaching functionality:
1. Modify `CoachingService.ts` for different evaluation strategies
2. Update the OpenAI prompt in the backend for different coaching styles
3. Enhance the UI components for better user experience
4. Add tests for new functionality
