import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface HeightContextProps {
  heights: Record<string, number>;
  setHeight: (id: string, height: number) => void;
  getTotalHeight: () => number;
}

const HeightContext = createContext<HeightContextProps | undefined>(undefined);

interface HeightProviderProps {
  children: ReactNode;
}

export const HeightProvider: React.FC<HeightProviderProps> = ({ children }) => {
  const [heights, setHeights] = useState<Record<string, number>>({});

  const setHeight = useCallback((id: string, height: number) => {
    setHeights((prevHeights) => ({ ...prevHeights, [id]: height }));
  }, []);

  const getTotalHeight = useCallback(() => {
    return Object.values(heights).reduce((total, height) => total + height, 0);
  }, [heights]);

  return (
    <HeightContext.Provider value={{ heights, setHeight, getTotalHeight }}>
      {children}
    </HeightContext.Provider>
  );
};

export const useHeight = (): HeightContextProps => {
  const context = useContext(HeightContext);
  if (!context) {
    throw new Error('useHeight must be used within a HeightProvider');
  }
  return context;
};
