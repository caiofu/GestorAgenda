import { SafeAreaView, View, Image, Text, useColorScheme, } from "react-native";
import styles from './BoasVindasStyle.js'
import { useEffect } from "react"; 
import { Button } from 'react-native-paper';


//ASYNC STORAGE
import {guardarPrimeiroAcesso, SalvaTema} from "../AsyncStorage/AsyncStorage.js";

//CONTEXT 
import { useAppState } from "../Contexts/AppStateContext";


export default function BoasVindas({atualizaBoasVindas}) {

    //CARREGANDO O TEMA A PRIMEIRA VEZ.
    const { tema, setTema} = useAppState();
   
    const temaSistema = useColorScheme();
    
    useEffect(() => {
        // Atualizar o tema apenas quando o componente for montado
        setTema(temaSistema);
      }, []);
    
    //SalvaTema(tema === null ? temaSistema : tema);
    function Continuar()
    {
        
        guardarPrimeiroAcesso();
        atualizaBoasVindas(false);
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.boxLogo}>
                <Image source={require('../../assets/logo/logo-sem-fundo.png')} style={{ width: '80%', height: 200, alignSelf: 'center' }}></Image>
            </View>
            <Text style={styles.textoBoasVindas}>Bem-vinda(o) ao GestorAgenda!</Text>
            <Button style={styles.button} textColor='#006699'  mode="contained" onPress={Continuar}>
                <Text style={styles.continueButtonText}>Continuar</Text>
            </Button>
        </SafeAreaView>
    );
}