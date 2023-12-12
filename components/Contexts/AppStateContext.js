import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { SalvaTema, VerificaTema, setUsaTemaSistema, getUsaTemaSistema } from '../AsyncStorage/AsyncStorage';

const AppStateContext = createContext();

export const useAppState = () => {
  return useContext(AppStateContext);
};

export const AppStateProvider = ({ children }) => {
  //RESPONSAVEL PELA NAVEGAÇAO TORNANDO O ACESSO A PRIMEIRA VEZ OBRIGATORIO
  const [navegacaoEstabelecimento, setNavegacaoEstabelecimento] = useState(null);

  //RESPONSAVEL PELO TEMA
  const [tema, setTema] = useState(null);
  const temaSistema = useColorScheme();
  const [temaPadraoSistema, setTemaPadraoSistema] = useState(false);
  const [usaTemaSistemaAsyncStorage, setUsaTemaSistemaAsyncStorage] = useState();

  useEffect(() => {
    async function carregaSetUsaTemaSistema() {
      const usaTemaSistema = await getUsaTemaSistema();
      setUsaTemaSistemaAsyncStorage(usaTemaSistema);
    }
    carregaSetUsaTemaSistema();
  }, [usaTemaSistemaAsyncStorage]);

  useEffect(() => {
    async function carregaTema() { //Usamos dentro de uma função async para poder espera o resultado de VerificaTema
      const temaAsync = await VerificaTema();
      // console.log('TEMAASYNC ==', temaAsync + 'tema ===>', tema)
      setTema(temaAsync !== '' ? temaAsync : temaSistema);
    }
    carregaTema();
  }, [temaPadraoSistema, setTemaPadraoSistema]) // testar colocar temaPadraoSistema aqui como dependencia. comentar todos os console log
  //problema: ao clicar em usar tema do sistema, o tema não muda. Mas quando dá reload, ele muda.

  //RESPONSAVEL PELA TROCA DE TEMA

  const MudarTema = () => {
    const novoTema = tema === 'light' ? 'dark' : 'light'; // Determina o novo tema
    setTema(novoTema); //Muda no appContext para popular para todo o app
    SalvaTema(tema); //salva no asyncStorage
  };
  

  //RESPONSAVEL PELO SERVIÇO (ATUALIZAÇAO DA LISTA)
  const [atulizaListaServico, setAtualisaListaServico] = useState(true);

  //RESPONSAVEL PELO FAVORITOS DE SERVIÇOS
  const [atualizaFavoritos, setAtulizaFavoritos] = useState(false);

  //RESPONSAVEL POR ATUALIZAR A LISTA DE AGENDAMENTO
  const [atualizaAgendamentos, setAtualizaAgendamentos] = useState(false);

  //RESPONSAVEL POR TROCAR A LOGO
  const [attLogo, setAttLogo] = useState('padrao');
  const [attNomeEstabelecimento, setAttNomeEstabelecimento]   = useState(null);

  // console.log(`tema = ${tema} temaSistema = ${temaSistema} temaPadraoSistema = ${temaPadraoSistema}`);



  return (
    <AppStateContext.Provider
      value={{
        navegacaoEstabelecimento,
        setNavegacaoEstabelecimento,
        tema, MudarTema,
        setTema,
        atulizaListaServico,
        setAtualisaListaServico,
        atualizaFavoritos,
        setAtulizaFavoritos,
        temaPadraoSistema,
        setTemaPadraoSistema,
        atualizaAgendamentos,
        setAtualizaAgendamentos,
        usaTemaSistemaAsyncStorage, 
        setUsaTemaSistemaAsyncStorage,
              attLogo,
              setAttLogo,
              attNomeEstabelecimento,
              setAttNomeEstabelecimento,
              
      }}>
      {children}
    </AppStateContext.Provider>
  );
};
