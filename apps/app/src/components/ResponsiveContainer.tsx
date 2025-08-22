import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

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
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  
  const isLargeScreen = width > 768;
  const containerWidth = isLargeScreen ? Math.min(width - padding * 2, maxWidth) : width - padding * 2;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingHorizontal: padding,
        },
      ]}
    >
      <View
        style={[
          styles.content,
          {
            width: containerWidth,
            maxWidth: maxWidth,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
});
