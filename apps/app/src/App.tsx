import React from 'react';
import { useChessStore } from './stores/chessStore';
import { AppBar } from './components/AppBar';
import ChessBoard from './components/ChessBoard';
import { GameControls } from './components/GameControls';
import { ThemeProvider } from './providers/ThemeProvider';
import { AutoPlayProvider } from './providers/AutoPlayProvider';
import './App.css';

function App() {
  const { initializeGame } = useChessStore();

  React.useEffect(() => {
    initializeGame('default-game');
  }, [initializeGame]);

  return (
    <ThemeProvider>
      <AutoPlayProvider>
        <div className="app">
          <AppBar />
          <div className="main-content">
            <ChessBoard />
            <GameControls />
          </div>
        </div>
      </AutoPlayProvider>
    </ThemeProvider>
  );
}

export default App;

