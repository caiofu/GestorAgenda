import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';

import SQLiteManager, { ConsultaUsuarios, InserirUsuario, excluirBancoDeDados } from './components/SQLiteManager/SQLiteManager';
import Estabelecimento from './components/Estabelecimento/Estabelecimento';
export default function App() {
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
