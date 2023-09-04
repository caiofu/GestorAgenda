import React, { useState } from "react";
import { HelperText, TextInput } from 'react-native-paper';
import {SafeAreaView, Text, Button, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';

//ESTILO
import styles from './StyleEstabelecimento';


export default function Estabelecimento()
{
    //VARIAVEIS DE ESTADO
    const [nomeEstabelecimento, setEstabelecimento]             = useState(null);
    const [msgNomeEstabelecimento, setMsgNomeEstabelecimento]   = useState(false);
    
    
    const [cnpj, setCnpj]                                       = useState(null);
    const [cnpjValido, setCnpjValido]                           = useState(false);
   
    const [ramoAtividade, setRamoAtividade]                     = useState(null);
    const [msgRamoAtividade, setMsgRamoAtividade]               = useState(false);

    const [image, setImage]                                     = useState(null);
    const [envio, setEnvio]                                     = useState(false);
   
    const selecionaImagem = async () => 
    {
       
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

    //FUNÇÕES
    function ValidaEnvio()
    {
        //Estabelecimento
        if (nomeEstabelecimento === null || nomeEstabelecimento === "") {
            setEnvio(false);
            setMsgNomeEstabelecimento(true);
          
          } else {
            setEnvio(true);
            setMsgNomeEstabelecimento(false);
          }
        //Ramo de atividade
       
    }

    function ValidaCnpj(txtCnpj)
    {
      
        if(txtCnpj.length < 14)
        {

            return false;
        }
       
        return true;
    }
    
 console.log(cnpjValido);
    return(
    
        <SafeAreaView style={styles.container}>
            <View style={styles.boxLogo}>
                {image != null ? <Image source={{ uri: image }} style={{ width: 200, height: 200, alignSelf:'center' }} /> :<Image source={require('../../assets/logo/logo-app.png')} style={{ width: 200, height: 200 }} />}
                <TouchableOpacity style={styles.btnLogo}   onPress={selecionaImagem}>
                    <Text style={styles.btnLogoText}>SELECIONAR LOGO</Text>
                </TouchableOpacity>
            </View> 
            {msgNomeEstabelecimento == true ? <HelperText style={styles.msgHelper}>Este campo é obrigatório</HelperText> : ''}
            <TextInput label="Nome do Estabelecimento" onChangeText={setEstabelecimento}   theme={{ colors:{primary: msgNomeEstabelecimento ? 'red' : '#006699'},}}  style={styles.inputFormulario}/>

             {cnpjValido === false ? <HelperText style={styles.msgHelper}>Digite um CNPJ valido!</HelperText> : ''}                                                  
            <TextInput label="CNPJ" keyboardType="numeric" maxLength={14} onChangeText={txtCnpj =>{
                setCnpj(txtCnpj);//Atualiza o estado do CNPJ
                setCnpjValido(ValidaCnpj(txtCnpj));//Chama a função de validação e seta a ubfirnalai do CNPJ Valido
            }} theme={{colors:{primary: cnpjValido ? '#006699' : 'red'}}} style={styles.inputFormulario}/>

            <TextInput label="Ramo de atividade"   theme={{colors:{primary: '#006699'}}} style={styles.inputFormulario}/>
            <TouchableOpacity disabled={cnpjValido  == false? true : false } style={cnpjValido  == false? styles.btnSalvarDesabilitado : styles.btnSalvar} onPress={ValidaEnvio}>
                <Text style={styles.btnSalvarText} >SALVAR</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}