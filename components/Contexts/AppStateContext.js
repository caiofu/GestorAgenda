
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import {SalvaTema, VerificaTema} from '../AsyncStorage/AsyncStorage';

const AppStateContext = createContext();

export const useAppState = () => {
  return useContext(AppStateContext);
};

export const AppStateProvider = ({ children }) => {
  //RESPONSAVEL PELA NAVEGAÇAO TORNANDO O ACESSO A PRIMEIRA VEZ OBRIGATORIO
  const [navegacaoEstabelecimento, setNavegacaoEstabelecimento] = useState(null);
  const [tema, setTema] = useState(null);

  useEffect(() => {
    async function carregaTema(){ //Usamos dentro de uma função async para poder espera o resultado de VerificaTema
      const temaAsync = await  VerificaTema();
      setTema( temaAsync !== null ? temaAsync : useColorScheme());
      console.log('Tema async ==>', temaAsync)
    }
  
    carregaTema();
  }, [])
  //RESPONSAVEL PELA TROCA DE TEMA
 

  console.log('CARREGOU O TEMA NO CONTEXT ------>', tema)
  
  const MudarTema =() =>
  {
    setTema(tema === 'light' ? 'dark' : 'light'); //Muda no appContext para popular para todo o app
    SalvaTema(tema); //salva no asyncStorage
  };

  return (
    <AppStateContext.Provider value={{ navegacaoEstabelecimento, setNavegacaoEstabelecimento, tema, MudarTema, setTema }}>
      {children}
    </AppStateContext.Provider>
   );
};
