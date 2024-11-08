import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface HeightContextProps {
  heights: Record<string, number>;
  setHeight: (id: string, height: number) => void;
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
console.log(heights)
  return (
    <HeightContext.Provider value={{ heights, setHeight }}>
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
