import React, { useState } from "react";
import { TextInput } from 'react-native-paper';
import {SafeAreaView, Text, Button, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';

//ESTILO
import styles from './StyleEstabelecimento';


export default function Estabelecimento()
{
    const [image, setImage] = useState(null);
    const selecionaImagem = async () => {
       
        let resultado = await ImagePicker.launchImageLibraryAsync({
            //Definindo as opções do imagePicker
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3]
        });
      
        if(resultado.canceled)
        {
            console.log('seleção cancelada'); //Posteriormente podemos retirar esse if era para testar e ter uma base do funcionamento
        }
        else if (resultado.assets)
        {
            setImage(resultado.assets[0].uri);
        
        }
    }
   //FOI INSTALADO O IMAGE PICKER DO EXPO (FAZER TRATATIVAS PARA FUNCIONAR)
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.boxLogo}>
                {image != null ? <Image source={{ uri: image }} style={{ width: 200, height: 200, alignSelf:'center' }} /> :<Image source={require('../../assets/logo/logo-app.png')} style={{ width: 200, height: 200 }} />}
                <TouchableOpacity style={styles.btnLogo}   onPress={selecionaImagem}>
                    <Text style={styles.btnLogoText}>SELECIONAR LOGO</Text>
                </TouchableOpacity>
            </View>  
            <TextInput label="Nome do Estabelecimento"   theme={{colors:{primary: '#006699'}}} style={styles.inputFormulario}/>
            <TextInput label="CNPJ"   theme={{colors:{primary: '#006699'}}} style={styles.inputFormulario}/>
            <TextInput label="Ramo de atividade"   theme={{colors:{primary: '#006699'}}} style={styles.inputFormulario}/>
            <TouchableOpacity style={styles.btnSalvar}>
                <Text style={styles.btnSalvarText}>SALVAR</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}