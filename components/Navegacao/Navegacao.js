import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Componentes (telas para navegação)
import Home from '../Home/Home';

const Stack = createNativeStackNavigator(); //Responsavel pela navegação
export default function Navegacao()
{
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}