# Chess Trainer

A comprehensive chess training application built with React Native (Expo) and Node.js, featuring a modern monorepo architecture.

## 🏗️ Architecture

- **`apps/app`** - Expo React Native app with web support
- **`apps/server`** - Node.js backend with Hono and WebSocket support
- **`packages/shared`** - Shared types, constants, and utilities

## 🚀 Features

- **Cross-platform**: iOS, Android, and Web support
- **Real-time gameplay**: WebSocket-based multiplayer
- **Modern UI**: Material Design 3 with React Native Paper
- **Theme support**: Light and dark mode
- **State management**: Zustand for local state
- **Type safety**: Full TypeScript support
- **Testing**: Vitest + React Testing Library

## 📋 Prerequisites

- Node.js 18+
- pnpm 8+
- Expo CLI (for mobile development)
- Git

## 🛠️ Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd chess-trainer
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Build shared package**
   ```bash
   pnpm --filter @chess-trainer/shared build
   ```

## 🎮 Development

### Start the backend server

```bash
pnpm dev:server
```

Server runs on `http://localhost:3001` with WebSocket on port `3002`

### Start the Expo app

```bash
pnpm dev:app
```

- **Web**: Opens in browser at `http://localhost:8081`
- **Mobile**: Scan QR code with Expo Go app

### Run both simultaneously

```bash
pnpm dev
```

## 🧪 Testing

### Run all tests

```bash
pnpm test
```

### Run tests for specific package

```bash
pnpm --filter @chess-trainer/app test
pnpm --filter @chess-trainer/server test
pnpm --filter @chess-trainer/shared test
```

### Watch mode

```bash
pnpm --filter @chess-trainer/app test:watch
pnpm --filter @chess-trainer/server test:watch
```

## 🔧 Build

### Build all packages

```bash
pnpm build
```

### Build specific package

```bash
pnpm --filter @chess-trainer/shared build
pnpm --filter @chess-trainer/server build
```

### Build Expo app for web

```bash
pnpm --filter @chess-trainer/app build:web
```

## 📱 Mobile Development

### iOS Simulator

```bash
pnpm --filter @chess-trainer/app ios
```

### Android Emulator

```bash
pnpm --filter @chess-trainer/app android
```

## 🎨 UI Components

- **ChessBoard**: Interactive chess board with piece movement
- **GameControls**: Game management and theme toggle
- **ThemeProvider**: Light/dark theme context

## 🔌 Backend API

### REST Endpoints

- `GET /` - Health check
- `POST /api/games` - Create new game
- `GET /api/games/:id` - Get game state
- `POST /api/games/:id/moves` - Make a move

### WebSocket Events

- `join_game` - Join a specific game
- `make_move` - Submit a chess move
- `game_state` - Receive updated game state
- `move_made` - Notify of successful move

## 🏗️ Project Structure

```
chess-trainer/
├── apps/
│   ├── app/                 # Expo React Native app
│   │   ├── app/            # Expo Router pages
│   │   ├── src/
│   │   │   ├── components/ # UI components
│   │   │   ├── providers/  # Context providers
│   │   │   ├── stores/     # Zustand stores
│   │   │   └── test/       # Test setup
│   │   └── assets/         # Images and icons
│   └── server/             # Node.js backend
│       └── src/            # Server source code
├── packages/
│   └── shared/             # Shared types and utilities
├── .github/                # GitHub Actions workflows
└── docs/                   # Documentation
```

## 🚀 Deployment

### Backend

```bash
pnpm --filter @chess-trainer/server build
pnpm --filter @chess-trainer/server start
```

### Frontend

```bash
pnpm --filter @chess-trainer/app build:web
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Create an issue for bugs or feature requests
- Check the [Expo documentation](https://docs.expo.dev/) for app development
- Review [React Native Paper](https://callstack.github.io/react-native-paper/) for UI components
