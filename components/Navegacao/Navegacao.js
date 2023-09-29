import {useColorScheme } from "react-native";
import { NavigationContainer, useRoute, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {FontAwesome5, FontAwesome} from '@expo/vector-icons';

import { ConsultaEstabelecimento } from '../SQLiteManager/SQLEstabelecimento';
//Componentes (telas para navegação)
import Home from '../Home/Home';
import Configuracoes from "../Configuracoes/Configuracoes";
import Estabelecimento from "../Estabelecimento/Estabelecimento";
import Servicos from "../Servicos/Servicos";
import NovoServico from "../Servicos/NovoServico";
import DetalhesServicos from "../Servicos/DetalhesServicos";


import { useState, useEffect } from "react";

//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";

//ASYNC STORAGE
import {SalvaTema,VerificaTema} from "../AsyncStorage/AsyncStorage";

const Stack = createNativeStackNavigator(); //Responsavel pela navegação Stack 
const Tab = createBottomTabNavigator(); //Responsavel pela navegaçao BottomTabs

function Tabs()
{

    const { tema} = useAppState();
    //AQUI É ONDE FICA A BARRA NA PARTE INFERIOR COM OS BOTOES DE NAVEGAÇÃO
    return(
        <Tab.Navigator screenOptions={{headerShown: false, tabBarActiveTintColor:'#006699',}}>
            <Tab.Screen name="Tela Inicial" component={StackTelas} initialParams={{tema1:tema}} options={{tabBarIcon: ({color, size}) => (<FontAwesome5 name="home" size={size} color={color} />),}} ></Tab.Screen>
            <Tab.Screen name="Configuracoes"  component={Configuracoes}   options={{tabBarIcon: ({color, size}) => (<FontAwesome name="gear" size={size} color={color} />),headerShown:true, headerTintColor: tema === 'light' ? '#006699': DarkTheme.colors.text, title:'Configurações'}   }></Tab.Screen>
        </Tab.Navigator>
    )
}

function StackTelas() {
    const { tema} = useAppState();
    return (
        <Stack.Navigator  >
            <Stack.Screen name="Gestor Agenda" component={Home} options={{headerTintColor: tema === 'light' ? '#006699': DarkTheme.colors.text}} />
            {/* <Stack.Screen name="Serviços" component={Servicos} options={{ headerLeft: null, headerTintColor: tema === 'light' ? '#006699': DarkTheme.colors.text }} /> */}
            <Stack.Screen name="Serviços" component={Servicos} options={{ headerLeft: null, headerTintColor: tema === 'light' ? '#006699': DarkTheme.colors.text }} />
            <Stack.Screen name="Novo Serviço" component={NovoServico} options={{ headerLeft: null, headerTintColor: tema === 'light' ? '#006699': DarkTheme.colors.text }} />
            <Stack.Screen name="Detalhes serviço" component={DetalhesServicos} options={{headerTintColor: tema === 'light' ? '#006699': DarkTheme.colors.text}} />
            <Stack.Screen name="Estabelecimento" component={Estabelecimento} options={{headerTintColor: tema === 'light' ? '#006699': DarkTheme.colors.text}} />
        </Stack.Navigator>
    )
}

function PrimeiroCadastroEstabelecimento() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Estabelecimento" component={Estabelecimento} />
            <Stack.Screen name="Serviços" component={Servicos} options={{ headerLeft: null }} />
            <Stack.Screen name="Gestor Agenda" component={Home} />
        </Stack.Navigator>
    )

}

export default function Navegacao()
{
 
    const {navegacaoEstabelecimento, setNavegacaoEstabelecimento, tema, setTema} = useAppState();
    const temaSistema = useColorScheme();
    //Tema (Provavel que tenha validar antes no boas vindas e no wizard caso seja o primeiro uso)
    
         // Use useEffect para executar as operações de tema uma vez após a renderização.
  useEffect(() => {  
    // Chame suas funções relacionadas ao tema aqui, após a renderização.
    SalvaTema(tema === null ? temaSistema : tema);
 
   
  }, [tema]);
        
   
    return(
        <NavigationContainer theme={tema === 'light' ? DefaultTheme : DarkTheme}> 
            {navegacaoEstabelecimento ?<PrimeiroCadastroEstabelecimento></PrimeiroCadastroEstabelecimento>: <Tabs tema={tema}></Tabs> }
          
        </NavigationContainer>
    )
}