# Server Setup Guide

## Environment Configuration

To use the coaching functionality, you need to set up your OpenAI API key:

1. **Create a `.env` file** in the `apps/server` directory
2. **Add your OpenAI API key**:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   PORT=3001
   ```

## Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

## Starting the Server

```bash
cd apps/server
pnpm install
pnpm start
```

The server will start on port 3001 and provide:
- `/api/coach` - Chess coaching endpoint
- `/healthz` - Health check endpoint
- WebSocket support for Stockfish engine

## Security Note

Never commit your `.env` file or hardcode API keys in your code. The `.env` file is already in `.gitignore` to prevent accidental commits.
