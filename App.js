import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';

//FONT
import {useFonts, Rubik_400Regular, Rubik_700Bold, Rubik_300Light} from '@expo-google-fonts/rubik'

//BANCO
import SQLiteManager, { ConsultaEstabelecimento, ConsultaRamoAtividade, ConsultaUsuarios, ExcluirBancoDeDados, InserirUsuario, ListaTodasTabelas, excluirBancoDeDados } from './components/SQLiteManager/SQLiteManager';

//COMPONENTES CRIADOS
import Estabelecimento from './components/Estabelecimento/Estabelecimento';
import { useEffect } from 'react';


export default function App() 
{

  
  
  //Usando as fontes padrões do sistema (a partir daqui pode se usado no sistema todo.)
  const [fontsLoaded, fontError] = useFonts({
    Rubik_700Bold , Rubik_400Regular, Rubik_300Light
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }


  // InserirUsuario('Furegati3r22');
  //  ConsultaEstabelecimento( usuario =>{
  //    console.log(usuario);
  //  });
 

   
  return (
    <SafeAreaView style={styles.container}>
      <Estabelecimento></Estabelecimento>
      <SQLiteManager></SQLiteManager>
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
