import { SafeAreaView, View, Image, Text } from "react-native";
import styles from './BoasVindasStyle.js'

export default function BoasVindas() {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.boxLogo}>
                <Image source={require('../../assets/logo/logo-app.png')} style={{ width: 200, height: 200, alignSelf: 'center' }}></Image>
            </View>
            <Text style={styles.textoBoasVindas}>Bem vindo ao GestorAgenda!</Text>
            <Text style={styles.textoBoasVindas}>Botão continuar</Text>
        </SafeAreaView>
    );
}