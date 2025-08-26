import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AutoPlayContextType {
  autoPlayEnabled: boolean;
  setAutoPlayEnabled: (enabled: boolean) => void;
}

const AutoPlayContext = createContext<AutoPlayContextType | undefined>(undefined);

export const useAutoPlay = () => {
  const context = useContext(AutoPlayContext);
  if (context === undefined) {
    throw new Error('useAutoPlay must be used within an AutoPlayProvider');
  }
  return context;
};

interface AutoPlayProviderProps {
  children: ReactNode;
}

export const AutoPlayProvider: React.FC<AutoPlayProviderProps> = ({ children }) => {
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);

  return (
    <AutoPlayContext.Provider value={{ autoPlayEnabled, setAutoPlayEnabled }}>
      {children}
    </AutoPlayContext.Provider>
  );
};
