import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Wizard from './Wizard';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function NavegacaoWizard()
{
    return(
        <NavigationContainer  >
                 <Stack.Navigator initialRouteName='Wizard' screenOptions={{headerShown: false}} >
            <Stack.Screen name='Wizard' component={Wizard}  />
        </Stack.Navigator>
        </NavigationContainer>
   
    )
}