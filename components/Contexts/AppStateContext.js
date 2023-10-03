import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import {SalvaTema, VerificaTema} from '../AsyncStorage/AsyncStorage';

const AppStateContext = createContext();

export const useAppState = () => {
  return useContext(AppStateContext);
};

export const AppStateProvider = ({ children }) => {
  //RESPONSAVEL PELA NAVEGAÇAO TORNANDO O ACESSO A PRIMEIRA VEZ OBRIGATORIO
  const [navegacaoEstabelecimento, setNavegacaoEstabelecimento] = useState(null);

  //RESPONSAVEL PELO TEMA
  const [tema, setTema] = useState(null);
  const temaSistema  = useColorScheme();
  const [temaPadraoSistema, setTemaPadraoSistema] = useState(false);

  useEffect(() => {
    async function carregaTema(){ //Usamos dentro de uma função async para poder espera o resultado de VerificaTema
      const temaAsync = await  VerificaTema();
      console.log('TEMAASYNC ==', temaAsync + 'tema ===>', tema)
      setTema( temaAsync !== '' ? temaAsync : temaSistema);
    }
    carregaTema();
  }, [])

  //RESPONSAVEL PELA TROCA DE TEMA
   
  const MudarTema =() =>
  {
    const novoTema = tema === 'light' ? 'dark' : 'light'; // Determina o novo tema
    setTema(novoTema); //Muda no appContext para popular para todo o app
    SalvaTema(tema); //salva no asyncStorage
  };

  //RESPONSAVEL PELO SERVIÇO (ATUALIZAÇAO DA LISTA)
  const [atulizaListaServico, setAtualisaListaServico] = useState(true);

  //RESPONSAVEL PELO FAVORITOS DE SERVIÇOS
  const [atualizaFavoritos, setAtulizaFavoritos] = useState(false);
  return (
    <AppStateContext.Provider value={{ navegacaoEstabelecimento, setNavegacaoEstabelecimento, tema, MudarTema, setTema, atulizaListaServico, setAtualisaListaServico, atualizaFavoritos, setAtulizaFavoritos, temaPadraoSistema, setTemaPadraoSistema}}>
      {children}
    </AppStateContext.Provider>
   );
};
