import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import './ResponsiveContainer.css';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
  padding?: number;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 1200,
  padding = 20,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="container"
      style={{
        backgroundColor: theme.colors.background,
        paddingLeft: padding,
        paddingRight: padding,
      }}
    >
      <div className="content">
        {children}
      </div>
    </div>
  );
};


