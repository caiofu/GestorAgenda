import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Switch } from 'react-native-paper';
import { useState } from "react";
import styles from "./StyleConfiguracoes";

//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";

export default function Configuracoes()
{
    const [darkModeOn, setDarkModeOn] = useState(false);
     //Tema
     const { tema, MudarTema } = useAppState();
    
    function AtivarDarkMode()
    {
        setDarkModeOn(!darkModeOn);
        MudarTema();
    }
    return(
        <SafeAreaView>
            <ScrollView>
                <View style={styles.switchContainer}>
                    <Text style={styles.txtSwitchTema}>Tema Escuro</Text>
                    <Switch style={styles.switch} value={darkModeOn} onValueChange={AtivarDarkMode}></Switch>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}