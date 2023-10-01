import { View } from "react-native";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {FontAwesome5} from '@expo/vector-icons';

import {ConsultaEstabelecimento} from '../SQLiteManager/SQLEstabelecimento';
//Componentes (telas para navegação)
import Home from '../Home/Home';
import Estabelecimento from "../Estabelecimento/Estabelecimento";
import Colaboradores from "../Colaboradores/Colaboradores";
import { useState, useEffect } from "react";
import { useAppState } from "../Contexts/AppStateContext";
import FormColaboradores from "../Colaboradores/FormColaboradores";


const Stack = createNativeStackNavigator(); //Responsavel pela navegação Stack 
const Tab   = createBottomTabNavigator(); //Responsavel pela navegaçao BottomTabs

function Tabs()
{
    return(
        <Tab.Navigator screenOptions={{headerShown: false, tabBarActiveTintColor:'#006699'}}>
            <Tab.Screen name="Home" component={StackTelas} options={{tabBarIcon: ({color, size}) => (<FontAwesome5 name="home" size={size} color={color} />),}} ></Tab.Screen>
        </Tab.Navigator>
    )
}

function StackTelas()
{

    return(
        <Stack.Navigator  >
            
        <Stack.Screen name="Gestor Agenda" component={Home} />
        <Stack.Screen name="Estabelecimento" component={Estabelecimento}/>
        <Stack.Screen name="Colaboradores" component={Colaboradores}/>
        <Stack.Screen name="FormColaboradores" component={FormColaboradores}/>
        
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


    return(
        <NavigationContainer>
            {navegacaoEstabelecimento ?<PrimeiroCadastroEstabelecimento></PrimeiroCadastroEstabelecimento>: <Tabs></Tabs> }
          
        </NavigationContainer>
    )
}