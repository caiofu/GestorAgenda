import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//Componentes (telas para navegação)
import Home from '../Home/Home';
import Estabelecimento from "../Estabelecimento/Estabelecimento";

const Stack = createNativeStackNavigator(); //Responsavel pela navegação Stack 
const Tab   = createBottomTabNavigator(); //Responsavel pela navegaçao BottomTabs

function Tabs()
{
    return(
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen name="Home" component={StackTelas} ></Tab.Screen>
        </Tab.Navigator>
    )
}

function StackTelas()
{
    return(
        <Stack.Navigator >
        <Stack.Screen name="Gestor Agenda | " component={Home} />
        <Stack.Screen name="Estabelecimento" component={Estabelecimento}/>
    </Stack.Navigator>
    )
}
export default function Navegacao()
{
    return(
        <NavigationContainer>
            <Tabs></Tabs>
        </NavigationContainer>
    )
}