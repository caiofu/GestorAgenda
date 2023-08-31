import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
//FONT
import {useFonts, Rubik_400Regular, Rubik_700Bold, Rubik_300Light} from '@expo-google-fonts/rubik'

//BANCO
import SQLiteManager, { ConsultaUsuarios, InserirUsuario, excluirBancoDeDados } from './components/SQLiteManager/SQLiteManager';

//COMPONENTES CRIADOS
import Estabelecimento from './components/Estabelecimento/Estabelecimento';


export default function App() 
{
  //Usando as fontes padrões do sistema (a partir daqui pode se usado no sistema todo.)
  const [fontsLoaded, fontError] = useFonts({
    Rubik_700Bold , Rubik_400Regular, Rubik_300Light
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  //Fontes padrão do sistema
  // const [fontsLoaded] = useFonts({
    
  //   'Rubik-Bold': require('./assets/fonts/Rubik-Bold.ttf'),
  // });

  // InserirUsuario('Furegati3r22');
  // ConsultaUsuarios( usuario =>{
  //   console.log(usuario);
  // });
 

 
  return (
    <SafeAreaView style={styles.container}>
      <Estabelecimento></Estabelecimento>
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
