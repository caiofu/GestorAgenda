import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { useState } from 'react';

//FONT
import { useFonts, Rubik_400Regular, Rubik_700Bold, Rubik_300Light } from '@expo-google-fonts/rubik'

//BANCO
import SQLiteManager, { ConsultaEstabelecimento, ConsultaRamoAtividade, ConsultaUsuarios, ExcluirBancoDeDados, InserirUsuario, excluirBancoDeDados } from './components/SQLiteManager/SQLiteManager';

//ASYNC STORAGE
import { houvePrimeiroAcesso, guardarPrimeiroAcesso, removerAsyncStorage } from './components/AsyncStorage/AsyncStorage';

//COMPONENTES CRIADOS
import Estabelecimento from './components/Estabelecimento/Estabelecimento';
import BoasVindas from './components/BoasVindas/BoasVindas';


export default function App() {
  
  const [primeiroAcesso, setPrimeiroAcesso] = useState(null);

  //Usando as fontes padrões do sistema (a partir daqui pode se usado no sistema todo.)
  const [fontsLoaded, fontError] = useFonts({
    Rubik_700Bold, Rubik_400Regular, Rubik_300Light
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  //ExcluirBancoDeDados();
  // InserirUsuario('Furegati3r22');
  ConsultaEstabelecimento(usuario => {
    console.log(usuario);
  });

  ConsultaRamoAtividade(ret => {
    console.log(ret);
  })

  //Async storage  
  houvePrimeiroAcesso().then(ret => {
    setPrimeiroAcesso(ret);
  });
  console.log('É o primeiro acesso? ' + primeiroAcesso);
  removerAsyncStorage();

  return (
    <SafeAreaView style={styles.container}>
      {primeiroAcesso ? <BoasVindas></BoasVindas> : <Estabelecimento></Estabelecimento>}
      {/* <SQLiteManager></SQLiteManager> */}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

    justifyContent: 'center',
  },
});
