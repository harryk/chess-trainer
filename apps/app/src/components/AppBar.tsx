import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import './AppBar.css';

export const AppBar: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header
      className="header"
      style={{
        backgroundColor: theme.colors.surface,
        boxShadow: `0 2px 4px ${theme.colors.border}20`,
      }}
    >
      <div className="content">
        <h1
          className="title"
          style={{ color: theme.colors.text }}
        >
          Chess Trainer
        </h1>
        <p
          className="subtitle"
          style={{ color: theme.colors.textSecondary }}
        >
          Master the game
        </p>
      </div>
      
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        style={{ color: theme.colors.text }}
        title="Toggle theme"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </header>
  );
};


