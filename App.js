import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useState, useContext } from 'react';

//FONT
import { useFonts, Rubik_400Regular, Rubik_700Bold, Rubik_300Light } from '@expo-google-fonts/rubik'

//NAVEGAÇÃO
import Navegacao from './components/Navegacao/Navegacao';

//BANCO
import SQLiteManager from './components/SQLiteManager/SQLiteManager';

//ASYNC STORAGE
import { houvePrimeiroAcesso, guardarPrimeiroAcesso, removerAsyncStorage, WizardAtivo, guardaWizardAtivo } from './components/AsyncStorage/AsyncStorage';

//COMPONENTES CRIADOS
import Estabelecimento from './components/Estabelecimento/Estabelecimento';
import BoasVindas from './components/BoasVindas/BoasVindas';


//testes
import NavegacaoWizard from './components/Wizard/NavegacaoWizard';
import Wizard from './components/Wizard/Wizard';
import { SafeAreaProvider } from 'react-native-safe-area-context';




export default function App() 
{
  //LIDANDO COM PRIMEIRO ACESSO
  const [primeiroAcesso, setPrimeiroAcesso] = useState(null);
  
  //LIDANDO COM O TUTORIAL
  const [wizardAtivo, setWizardAtivo] = useState(null);
   
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
  console.log('É o primeiro acesso? ' + primeiroAcesso);

   //VERIFICANDO NO ASYNC STORAGE O ESTADO ATUAL DO PULOU TUTORIAL AO CARREGAR O COMPONENTE
   WizardAtivo().then(ret => {
    setWizardAtivo(ret);
   console.log('reeeeeeet', ret)
  });

  // Função para atualizar o estado wizardAtivo (quando usuario clicar em pular o tutorial)
  const atualizarWizardAtivo = (novoValor) => {
    setWizardAtivo(novoValor);
  };
 console.log("WIZARD ATIVO ---->", wizardAtivo)

  return (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <SQLiteManager></SQLiteManager>
       {/* {primeiroAcesso ? <BoasVindas></BoasVindas> : <Estabelecimento></Estabelecimento>}
      
       
      <Navegacao></Navegacao> */}
     {wizardAtivo ? <Wizard atualizarWizardAtivo={atualizarWizardAtivo}  /> :  <Navegacao></Navegacao> }

      <StatusBar style="auto" />
     
     
     
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

    justifyContent: 'center',
  },
});
