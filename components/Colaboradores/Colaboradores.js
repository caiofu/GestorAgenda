import { NavigationContainer, useFocusEffect, useNavigation} from '@react-navigation/native'
import  FormColaboradores from './FormColaboradores'
import { List, FAB, PaperProvider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { listarColaboradores, ConsultaTeste } from '../SQLiteManager/SQLiteColaborador'
//import { listarColaboradores } from './SQLiteColaborador';

function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [erro, setErro] = useState(null); //estado para armazenar erros

  const navigation = useNavigation();
  // useEffect(() => {
  //   listarColaboradores(
  //     (colaboradoresArray) => {
  //       setColaboradores(colaboradoresArray);
  //       setErro(null); // Limpar erro, se houver
  //     },
  //     (error) => {
  //       setErro(error);
  //     }
  //   );
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      listarColaboradores(
        (colaboradoresArray) => {
          setColaboradores(colaboradoresArray);
          setErro(null); // Limpar erro, se houver
        },
        (error) => {
          setErro(error);
        }
      );
      return () => {
        console.log('Tela Colaboradores perdeu o foco');
        // Código de limpeza, se necessário, quando a tela perde foco
      };
    }, [])
  );


  function itemColaborador(item){
    return (
      // console.log(item),
      <List.Item
        style={{margin:10}} // alterar para colocar mais estilo nisso aqui, agr to sem ideia
        title={item.nomeColaborador}
        description={item.descricao}
        left={() => <List.Icon icon="account-circle" />}
        onPress={() => {
          console.log('pressed')
          navigation.navigate('Formulário Colaborador', {colaborador: item});
        }}
      />
    )
  }

  return (
    <PaperProvider>
      <SafeAreaView
        style={styles.container}
      >
        {/* <ScrollView> */}
            <View>
                {erro ? (
                    <Text>{erro}</Text>
                ) : (
                    colaboradores.length === 0 ? (
                    <Text>Nenhum colaborador encontrado.</Text>
                    ) : (
                    <List.Section>
                        <FlatList
                            ListHeaderComponent={<View style={{alignContent: 'center', alignItems: 'center'}}>
                                                    <List.Subheader style={styles.subHeader}>Lista de Colaboradores</List.Subheader>
                                                 </View>}
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
            </View>
        {/* </ScrollView> */}
        <FAB
          style={styles.fab}
          label='Novo Colaborador'
          icon="plus"
          onPress={() => {
            navigation.navigate('Formulário Colaborador', {colaborador: null})}}
        />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  subHeader: {
    fontFamily: 'Rubik_700Bold', // Define a fonte para Rubik Bold
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right:0,
    bottom:0,
    backgroundColor: '#006699', // Cor de fundo da bola
  },
});

 export default Colaboradores;

