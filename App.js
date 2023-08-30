import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SQLiteManager, { ConsultaUsuarios, InserirUsuario, excluirBancoDeDados } from './components/SQLiteManager/SQLiteManager';

export default function App() {
  // InserirUsuario('Furegati3r22');
  // ConsultaUsuarios( usuario =>{
  //   console.log(usuario);
  // });
 

 
  return (
    <View style={styles.container}>
      <Text>Gestor Agenda! Bora gurizada</Text>
      <SQLiteManager></SQLiteManager>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
