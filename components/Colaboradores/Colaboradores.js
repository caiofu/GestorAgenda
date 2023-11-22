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
        // console.log('[LOGS] - Tela Colaboradores perdeu o foco');
        // Código de limpeza, se necessário, quando a tela perde foco
      };
    }, [])
  );


  function itemColaborador(item){
    return (
      // // console.log(item),
      <List.Item
        style={{margin:5, borderWidth:1, padding:10 ,borderRadius:10, borderColor: '#006699'}} // alterar para colocar mais estilo nisso aqui, agr to sem ideia
        title={item.nomeColaborador}
        titleStyle={{color:'#006699', fontFamily:'Rubik_700Bold'}}
        description={item.ativo === 1 ? "Status: Ativo" : "Status: Inativo"}
        left={() => <List.Icon icon="account-circle" />}
        onPress={() => {
          navigation.navigate('Formulário Colaborador', {colaborador: item});
        }}
      />
    )
  }

  return (
    
    <PaperProvider>
    
        <View style={[styles.container, {flex: 1, padding: 10, flexDirection: 'column'}]}>
          <View style={{alignContent: 'center', alignItems: 'center', borderWidth:1, padding:10, marginBottom:5, backgroundColor:'#fff'}}>
              <Text>Lista de Colaboradores</Text>
          </View>
          <View style={{borderWidth:1, flex:1,marginBottom:70, marginTop:2, borderRadius:4, borderColor:'#006699'}}>
              {erro ? (
                  <Text>{erro}</Text>
              ) : (
                  colaboradores.length === 0 ? (
                  <Text>Nenhum colaborador encontrado.</Text>
                  ) : (
                  <List.Section>
                      <FlatList
                          ListHeaderComponent={<View style={{alignContent: 'center', alignItems: 'center'}}>
                                                  {/* <List.Subheader style={styles.subHeader}>Lista de Colaboradores</List.Subheader> */}
                                              </View>}
                          data={colaboradores}
                          keyExtractor={(item) => item.idColaborador.toString()}
                          renderItem={({ item }) => (
                            itemColaborador(item)
                            //a performance de uma lista melhora com o uso de flatlist e passando uma função ao renderItem
                            //ao invés de renderizar diretamente nele
                          )}
                      />
                  </List.Section>
                  )
              )}
          </View>
          <FAB
            color="#fff"
            style={styles.fab}
            label='Novo Colaborador'
            icon="plus"
            onPress={() => {
              navigation.navigate('Formulário Colaborador', {colaborador: null})}}
          />
        </View>
    
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

