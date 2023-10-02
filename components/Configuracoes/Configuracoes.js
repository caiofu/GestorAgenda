import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Switch } from 'react-native-paper';
import { useState } from "react";
import styles from "./StyleConfiguracoes";
import darkTheme from '../../Tema/darkTheme';
import lightTheme from '../../Tema/lightTheme';

import { FontAwesome } from '@expo/vector-icons';

//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";

export default function Configuracoes()
{

     //Tema
     const { tema, MudarTema } = useAppState();
    
     const [darkModeOn, setDarkModeOn] = useState(tema === 'dark' ? true : false);
    function AtivarDarkMode()
    {
        setDarkModeOn(!darkModeOn);
        MudarTema();
    }
    return(
        <SafeAreaView>
            <ScrollView>
                <View style={styles.switchContainer}>
                  
                    <Text style={[styles.txtSwitchTema, {color: tema === 'light' ? lightTheme.textColor : darkTheme.textColor}  ]}>Tema Escuro</Text>
                    <Switch  style={styles.switch}  color= '#006699'  value={darkModeOn} onValueChange={AtivarDarkMode}></Switch>
                    <View style={{marginLeft:5}}>
                    { tema === 'light' ? <FontAwesome name="sun-o" size={24} color="#006699" /> : <FontAwesome name="moon-o" size={24} color="#fff" />}
                    </View>
                    
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}