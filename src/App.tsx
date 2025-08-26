import React from 'react';
import ChessBoard from './components/ChessBoard';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chess Trainer</h1>
      </header>
      <main>
        <ChessBoard />
      </main>
    </div>
  );
}

export default App;
