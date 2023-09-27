import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import  ListaColaboradores  from './ListaColaboradores'
import  FormColaboradores from './FormColaboradores'
import { Button } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { listarColaboradores, ConsultaTeste } from '../SQLiteManager/SQLiteColaborador'
//import { listarColaboradores } from './SQLiteColaborador';

function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [erro, setErro] = useState(null); // Novo estado para armazenar erros

  useEffect(() => {
    listarColaboradores(
      (colaboradoresArray) => {
        setColaboradores(colaboradoresArray);
        setErro(null); // Limpar erro, se houver
      },
      (error) => {
        setErro(error);
      }
    );
  }, []);

  return (
    <SafeAreaView>
        <View>
            {erro ? (
                <Text>{erro}</Text>
            ) : (
                colaboradores.length === 0 ? (
                <Text>Nenhum colaborador encontrado.</Text>
                ) : (
                <FlatList
                    data={colaboradores}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                    <View>
                        <Text>{item.nome}</Text>
                        <Text>{item.email}</Text>
                        {/* Adicione aqui mais informações dos colaboradores conforme necessário */}
                    </View>
                    )}
                />
                )
            )}
        </View>
    </SafeAreaView>
  );
}

 export default Colaboradores;
// // const Stack = createNativeStackNavigator()

// export default props => {
//     return(
//         <SafeAreaView>
//             <View>

//             </View>
//         </SafeAreaView>
//         // <NavigationContainer independent={true}>
//         //     <Stack.Navigator
//         //     initialRouteName='ListaColaboradores'
//         //     screenOptions={screenOptions}>
//         //         <Stack.Screen 
//         //             name="ListaColaboradores"
//         //             component={ListaColaboradores}
//         //             options={() => {
//         //                 return{
//         //                     headerShown: false,
//         //                     title: "Lista de Colaboradores",
//         //                 }
//         //             }}
//         //         />
//         //         <Stack.Screen
//         //             name="FormColaboradores"
//         //             component={FormColaboradores}
//         //         />
//         //     </Stack.Navigator>
//         // </NavigationContainer>

        
//     )
// }

const screenOptions = {
    headerStyle: {
        backgroundColor: '#fff'
    },
    headerTintColor: '#000000',
    headerTitleStyle: {
        fontFamily: 'Rubik_700Bold'
    }
}