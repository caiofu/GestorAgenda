import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import  ListaColaboradores  from './ListaColaboradores'
import  FormColaboradores from './FormColaboradores'
import { Button } from 'react-native-paper'

const Stack = createNativeStackNavigator()

export default props => {
    return(
        <NavigationContainer>
            <Stack.Navigator
            initialRouteName='ListaColaboradores'
            screenOptions={screenOptions}>
                <Stack.Screen 
                    name="ListaColaboradores"
                    component={ListaColaboradores}
                    options={() => {
                        return{
                            title: "Lista de Colaboradores",
                            headerRigth: () => {
                                <Button
                                    
                                >

                                </Button>
                            }
                        }
                    }}
                />
                <Stack.Screen
                    name="FormColaboradores"
                    component={FormColaboradores}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const screenOptions = {
    headerStyle: {
        backgroundColor: '#fff'
    },
    headerTintColor: '#000000',
    headerTitleStyle: {
        fontFamily: 'Rubik_700Bold'
    }
}