import { SafeAreaView, View, Image, Text } from "react-native";
import styles from './BoasVindasStyle.js'
import * as React from 'react';
import { Button } from 'react-native-paper';
import { useFonts, Rubik_400Regular, Rubik_700Bold, Rubik_300Light } from '@expo-google-fonts/rubik'

export default function BoasVindas() {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.boxLogo}>
                <Image source={require('../../assets/logo/logo-sem-fundo.png')} style={{ width: '80%', height: 200, alignSelf: 'center' }}></Image>
            </View>
            <Text style={styles.textoBoasVindas}>Bem-vinda(o) ao GestorAgenda!</Text>
            <Button style={styles.button} textColor='#006699'  mode="contained" onPress={() => console.log('Botão pressionado')}>
                Continuar
            </Button>
        </SafeAreaView>
    );
}