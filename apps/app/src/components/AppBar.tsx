import React from 'react';
import './AppBar.css';

const AppBar: React.FC = () => {
  return (
    <header className="app-bar">
      <div className="app-bar-content">
        <div className="logo-section">
          <div className="logo-icon">♟️</div>
          <h1 className="app-title">Chess Trainer Pro</h1>
        </div>
      </div>
    </header>
  );
};

export default AppBar;


