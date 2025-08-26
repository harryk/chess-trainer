import React, { createContext, useContext, useState, useEffect } from 'react';

// Define Theme interface locally instead of importing from shared package
interface Theme {
  dark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#1976D2',
    secondary: '#424242',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#D32F2F',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#90CAF9',
    secondary: '#BDBDBD',
    background: '#121212',
    surface: '#1E1E1E',
    error: '#EF5350',
    text: '#FFFFFF',
    textSecondary: '#BDBDBD',
    border: '#424242',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? darkTheme : lightTheme);
    
    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? darkTheme : lightTheme);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev.dark ? lightTheme : darkTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme.dark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

