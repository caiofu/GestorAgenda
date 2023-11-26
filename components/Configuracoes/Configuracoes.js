import { ScrollView, View, Text, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Switch, Checkbox } from 'react-native-paper';
import { useState, useEffect } from "react";
import styles from "./StyleConfiguracoes";
import darkTheme from '../../Tema/darkTheme';
import lightTheme from '../../Tema/lightTheme';
import { FontAwesome } from '@expo/vector-icons';
//ASYNC
import { RemoveTemaAsync, SalvaTema, setUsaTemaSistema, getUsaTemaSistema } from "../AsyncStorage/AsyncStorage";
//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";

export default function Configuracoes() {
    //Tema
    const { tema, MudarTema, temaPadraoSistema, setTemaPadraoSistema, usaTemaSistemaAsyncStorage, setUsaTemaSistemaAsyncStorage } = useAppState();
    console.log(usaTemaSistemaAsyncStorage);

    const [darkModeOn, setDarkModeOn] = useState(tema === 'dark' ? true : false);

    function AtivarDarkMode() {
        setDarkModeOn(!darkModeOn);
        MudarTema();
    }

    //Tema do sistema
    const [temaSistema, setTemaSistema] = useState(usaTemaSistemaAsyncStorage === 'true' ? 'checked' : 'unchecked');
    const [desativaSwitch, setDesativaSwitch] = useState(usaTemaSistemaAsyncStorage === 'true' ? false : true);

    useEffect(() => {
        if (temaSistema === 'checked') {
            setTemaPadraoSistema(true);
            setDesativaSwitch(true);
        }
        else {
            setTemaPadraoSistema(false);
            setDesativaSwitch(false);
        }
    }, [usaTemaSistemaAsyncStorage]);

    useEffect(() => {
        getUsaTemaSistema().then(ret => {
            setUsaTemaSistemaAsyncStorage(ret);
        });
    }, [temaSistema, usaTemaSistemaAsyncStorage]);

    function MudaTemaSitema() {
        if (temaSistema === 'checked') {
            setTemaSistema('unchecked');
            setUsaTemaSistema('false');
            setDesativaSwitch(false);
            // console.log("Entrou no if - 111");
        }
        else //Padrao do sistema operacional
        {
            setTemaSistema('checked');
            setUsaTemaSistema('true');

            setTemaPadraoSistema(true);
            setDesativaSwitch(true);

            //Excluir async
            RemoveTemaAsync();
            // console.log("Entrou no else - 111");
        }
    }

    return (
        <SafeAreaView>
            <ScrollView>

                <View style={styles.CheckboxContainer}>
                    <Checkbox
                        status={temaSistema}
                        onPress={() => { MudaTemaSitema() }}
                        color={tema === 'light' ? '#006699' : ''}
                        uncheckedColor={tema === 'light' ? '' : '#fff'}
                    />
                    <Text style={[styles.txtSwitchTema, { color: tema === 'light' ? lightTheme.textColor : darkTheme.textColor }]}>Usar tema do Sistema</Text>
                </View>

                <View style={[styles.switchContainer, { backgroundColor: desativaSwitch ? '#adadadb3' : null }]}>

                    <Text style={[styles.txtSwitchTema, { color: tema === 'light' ? lightTheme.textColor : darkTheme.textColor }]}>Tema Escuro</Text>
                    <Switch style={styles.switch} color='#006699' value={darkModeOn} onValueChange={AtivarDarkMode} disabled={desativaSwitch}></Switch>
                    <View style={{ marginLeft: 5 }}>
                        {tema === 'light' ? <FontAwesome name="sun-o" size={24} color="#006699" /> : <FontAwesome name="moon-o" size={24} color="#fff" />}
                    </View>

                </View>

            </ScrollView>
        </SafeAreaView>
    )
}