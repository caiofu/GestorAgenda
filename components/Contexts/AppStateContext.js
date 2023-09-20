
import React, { createContext, useContext, useState } from 'react';

const AppStateContext = createContext();

export const useAppState = () => {
  return useContext(AppStateContext);
};

export const AppStateProvider = ({ children }) => {
  //RESPONSAVEL PELA NAVEGAÇAO TORNANDO O ACESSO A PRIMEIRA VEZ OBRIGATORIO
  const [navegacaoEstabelecimento, setNavegacaoEstabelecimento] = useState(null); 
  //RESPONSAVEL PELA TROCA DE TEMA
  const [tema, setTema] = useState('light'); //não esquecer depois de trazer o tema que esta no dispositivo.
  
  const MudarTema =() =>
  {
    setTema(tema === 'light' ? 'dark' : 'light');
  };

  return (
    <AppStateContext.Provider value={{ navegacaoEstabelecimento, setNavegacaoEstabelecimento, tema, MudarTema }}>
      {children}
    </AppStateContext.Provider>
  );
};
