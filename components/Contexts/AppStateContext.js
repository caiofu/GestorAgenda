
import React, { createContext, useContext, useState } from 'react';

const AppStateContext = createContext();

export const useAppState = () => {
  return useContext(AppStateContext);
};

export const AppStateProvider = ({ children }) => {
  const [navegacaoEstabelecimento, setNavegacaoEstabelecimento] = useState(null); 

  return (
    <AppStateContext.Provider value={{ navegacaoEstabelecimento, setNavegacaoEstabelecimento }}>
      {children}
    </AppStateContext.Provider>
  );
};
