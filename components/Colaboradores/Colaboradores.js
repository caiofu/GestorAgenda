import { NavigationContainer, useFocusEffect, useNavigation} from '@react-navigation/native'
import  FormColaboradores from './FormColaboradores'
import { List, FAB } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { listarColaboradores, ConsultaTeste } from '../SQLiteManager/SQLiteColaborador'
//import { listarColaboradores } from './SQLiteColaborador';

function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [erro, setErro] = useState(null); // Novo estado para armazenar erros

  const navigation = useNavigation();
  // useEffect(() => {
  //   listarColaboradores(
  //     (colaboradoresArray) => {
  //       setColaboradores(colaboradoresArray);
  //       console.log(colaboradores);
  //       setErro(null); // Limpar erro, se houver
  //     },
  //     (error) => {
  //       setErro(error);
  //     }
  //   );
  // }, []);

  //tive que usar isso pois devido a tela estar dentro de um navigation, ao entrar e sair do módulo o componente não estava renderizando.
  //com useFocusEffect, força a renderização, pois ele verifica a entrada e saída do componente.
  useFocusEffect(
      React.useCallback(() => {
        console.log('caindo aqui');
      listarColaboradores(
            (colaboradoresArray) => {
              setColaboradores(c => c = colaboradoresArray);
              setErro(null); // Limpar erro, se houver
            },
            (error) => {
              setErro(error);
            }
          );
      return () => {
        // Código de limpeza, se necessário
        console.log('saiu da tela de colaboradores');
      };
    }, [])
  );
  
  function itemColaborador(item){
    return (
      <List.Item
        title={item.nomeColaborador}
        description={'finge que tem um email aqui'}
        left={() => <List.Icon icon="account-circle" />}
        onPress={() => {
          navigation.navigate('FormColaboradores', {colaborador: item});
        }}
      />
    )
  }

  return (
    <SafeAreaView>
        <View>
            {erro ? (
                <Text>{error}</Text>
            ) : (
                colaboradores.length === 0 ? (
                <Text>Nenhum colaborador encontrado.</Text>
                ) : (
                <List.Section>
                  <List.Subheader>Lista de Colaboradores</List.Subheader>
                    <FlatList
                        data={colaboradores}
                        keyExtractor={(item) => item.idColaborador.toString()}
                        renderItem={({ item }) => (
                          itemColaborador(item)
                          //a performance de uma lista melhora com o uso de flatlist e passando uma função ao renderItem
                          //ao invés de criar diretamente nele 
                        )}
                    />
                </List.Section>
                )
            )}
            <FAB
              style={styles.fab}
              icon="plus"
              onPress={FormColaboradores}
            />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  fab: {
    position: 'absolute',
    margin: 16,
    right:0,
    bottom:0,
    backgroundColor: '#007bff', // Cor de fundo da bola
  },
});

 export default Colaboradores;

// const screenOptions = {
//     headerStyle: {
//         backgroundColor: '#fff'
//     },
//     headerTintColor: '#000000',
//     headerTitleStyle: {
//         fontFamily: 'Rubik_700Bold'
//     }
// }