import { SafeAreaView, View, Image, Text } from "react-native";
import styles from './BoasVindasStyle.js'
import * as React from 'react';
import { Button } from 'react-native-paper';


//ASYNC STORAGE
import {guardarPrimeiroAcesso} from "../AsyncStorage/AsyncStorage.js";

export default function BoasVindas({atualizaBoasVindas}) {
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