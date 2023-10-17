import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, useColorScheme } from 'react-native';
import { useState, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PaperProvider } from 'react-native-paper';

//CONTEXT
import { AppStateProvider, useAppState } from './components/Contexts/AppStateContext'

//FONT
import { useFonts, Rubik_400Regular, Rubik_700Bold, Rubik_300Light } from '@expo-google-fonts/rubik'

//TEMA
import darkTheme from './Tema/darkTheme';
import lightTheme from './Tema/lightTheme';

//NAVEGAÇÃO
import Navegacao from './components/Navegacao/Navegacao';

//BANCO
import SQLiteManager, { ExcluirBancoDeDados, ListaTodasTabelas } from './components/SQLiteManager/SQLiteManager';

//ASYNC STORAGE
import { houvePrimeiroAcesso, guardarPrimeiroAcesso, removerAsyncStorage, WizardAtivo, guardaWizardAtivo } from './components/AsyncStorage/AsyncStorage';

//COMPONENTES CRIADOS
import BoasVindas from './components/BoasVindas/BoasVindas';
import Wizard from './components/Wizard/Wizard';
import { ConsultaEstabelecimento } from './components/SQLiteManager/SQLEstabelecimento';
import Colaboradores from './components/Colaboradores/Colaboradores';


export default function App() {

  //LIDANDO COM PRIMEIRO ACESSO
  const [primeiroAcesso, setPrimeiroAcesso] = useState(null);

  //LIDANDO COM O TUTORIAL
  const [wizardAtivo, setWizardAtivo] = useState(null);

  //LINDADO COM O BOAS VINDAS
  const [boasVindasAtivo, setBoasVindasAtivo] = useState(null);

  //LIDANDO COM PRIMEIRO CADASTRO DE ESTABELECIMNTO
  const [estabelecimentoCadastro, setEstabelecimentoCadastro] = useState(null);

  //Usando as fontes padrões do sistema (a partir daqui pode se usado no sistema todo.)
  const [fontsLoaded, fontError] = useFonts({
    Rubik_700Bold, Rubik_400Regular, Rubik_300Light
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  



  //Async storage  
  houvePrimeiroAcesso().then(ret => {
    setPrimeiroAcesso(ret);
  });
 

  //VERIFICANDO NO ASYNC STORAGE O ESTADO ATUAL DO PULOU TUTORIAL AO CARREGAR O COMPONENTE
  WizardAtivo().then(ret => {
    setWizardAtivo(ret);
  });

  // Função para atualizar o estado wizardAtivo (quando usuario clicar em pular o tutorial)
  const atualizarWizardAtivo = (novoValor) => {
    setWizardAtivo(novoValor);
  };

  // Função para atualizar o estado boasVindasAtivo (quando usuario clicar em continuar)
  const atualizaBoasVindas = (novoValor) => {
    setBoasVindasAtivo(novoValor);
  };
  //CONSULTA NO BANCO SE JA TEM ESTABELECIMENTO CADASTRADO
 
  ConsultaEstabelecimento((resultado) => {
    if (resultado === null) {
      setEstabelecimentoCadastro(true);
    }
    else {
      setEstabelecimentoCadastro(false);
    }
  })

  //TRECHO QUE RESETA TUDO PARA TESTES
  //  removerAsyncStorage();
  //  guardaWizardAtivo('true');
  //  ExcluirBancoDeDados();
  //--------------------------------

  return (
    <AppStateProvider>
    <SafeAreaProvider>
    
        <SafeAreaView style={styles.container}>
          <SQLiteManager></SQLiteManager>

          {primeiroAcesso ? (<BoasVindas atualizaBoasVindas={atualizaBoasVindas} />)
            : wizardAtivo ? (<Wizard atualizarWizardAtivo={atualizarWizardAtivo} />)
              : <Navegacao ></Navegacao>}
          <StatusBar style="auto" />
        </SafeAreaView>
      
    </SafeAreaProvider>
    </AppStateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

    justifyContent: 'center',
  },
});
