import { View } from "react-native";
import { NavigationContainer, useRoute, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {FontAwesome5, FontAwesome} from '@expo/vector-icons';

import {ConsultaEstabelecimento} from '../SQLiteManager/SQLEstabelecimento';
//Componentes (telas para navegação)
import Home from '../Home/Home';
import Configuracoes from "../Configuracoes/Configuracoes";
import Estabelecimento from "../Estabelecimento/Estabelecimento";

import { useState, useEffect } from "react";
//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";




const Stack = createNativeStackNavigator(); //Responsavel pela navegação Stack 
const Tab   = createBottomTabNavigator(); //Responsavel pela navegaçao BottomTabs

function Tabs()
{
    //AQUI É ONDE FICA A BARRA NA PARTE INFERIOR COM OS BOTOES DE NAVEGAÇÃO
    return(
        <Tab.Navigator screenOptions={{headerShown: false, tabBarActiveTintColor:'#006699',}}>
            <Tab.Screen name="Tela Inicial" component={StackTelas} options={{tabBarIcon: ({color, size}) => (<FontAwesome5 name="home" size={size} color={color} />),}} ></Tab.Screen>
            <Tab.Screen name="Configuracoes" component={Configuracoes}  options={{tabBarIcon: ({color, size}) => (<FontAwesome name="gear" size={size} color={color} />),headerShown:true}  }></Tab.Screen>
        </Tab.Navigator>
    )
}

function StackTelas()
{

    return(
        <Stack.Navigator>
            
        <Stack.Screen name="Gestor Agenda" component={Home} />
        <Stack.Screen name="Estabelecimento" component={Estabelecimento}/>
       
        </Stack.Navigator>
    )
}

function PrimeiroCadastroEstabelecimento()
{
    return(
        <Stack.Navigator  >
        <Stack.Screen name="Estabelecimento" component={Estabelecimento} />       
      <Stack.Screen name="Gestor Agenda" component={Home} />
     
     
      </Stack.Navigator>
    )
  
}
export default function Navegacao()
{
 
    const {navegacaoEstabelecimento, setNavegacaoEstabelecimento} = useAppState();
    //Tema
    const { tema, MudarTema } = useAppState();
   
    return(
        <NavigationContainer theme={tema === 'light' ? DefaultTheme : DarkTheme}> 
            {navegacaoEstabelecimento ?<PrimeiroCadastroEstabelecimento></PrimeiroCadastroEstabelecimento>: <Tabs></Tabs> }
          
        </NavigationContainer>
    )
}