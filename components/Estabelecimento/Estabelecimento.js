import React, { useState } from "react";
import { HelperText, TextInput, List } from 'react-native-paper';
import {SafeAreaView, Text, Button, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { SelectList } from "react-native-dropdown-select-list";
import { useEffect } from "react";
import * as FileSystem from 'expo-file-system';

import {ConsultaEstabelecimento, InserirEstabelecimento} from '../SQLiteManager/SQLEstabelecimento';  

//ESTILO
import styles from './StyleEstabelecimento';
import {ConsultaRamoAtividade, ExcluirBancoDeDados } from "../SQLiteManager/SQLiteManager";


export default function Estabelecimento()
{
 

    //BUSCA O RAMO DE ATIVIDADE (Usamos o useEffect para carregar somente na criaçao do componente)
    const [listaRamoAtividade, setListaRamoAtividade] = useState([]);
    useEffect(() => {
        // Chame a função de consulta diretamente
        ConsultaRamoAtividade((ramoAtividades) => {
        const retorno = ramoAtividades.map((atividade) => ({
            key: atividade.idRamoAtividade.toString(),
            value: atividade.nomeAtividade,
        }));
            //console.log(retorno);
            setListaRamoAtividade(retorno);
        });
    }, []);
 
    //VARIAVEIS DE ESTADO
    const [nomeEstabelecimento, setEstabelecimento]             = useState(null);
    const [msgNomeEstabelecimento, setMsgNomeEstabelecimento]   = useState(false);
    
    
    const [cnpj, setCnpj]                                       = useState(null);
    const [cnpjValido, setCnpjValido]                           = useState(false);
   
    const [ramoAtividade, setRamoAtividade]                     = useState(null);
    const [msgRamoAtividade, setMsgRamoAtividade]               = useState(false);

    //testes
    const [selected, setSelected] =useState("");
  
    //fim testes
    const [image, setImage]                                     = useState(null);
    const [envio, setEnvio]                                     = useState(false);
   
    const selecionaImagem = async () => 
    {
       
        const resultado = await ImagePicker.launchImageLibraryAsync({
            //Definindo as opções do imagePicker
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        if (nomeEstabelecimento === null || nomeEstabelecimento === "")
         {
            setEnvio(false);
            setMsgNomeEstabelecimento(true);
          
          } else {
            setEnvio(true);
            setMsgNomeEstabelecimento(false);
            MoveImagem();
            InserirEstabelecimento('','',image,'');
           
          }
        
          //Mudar diretorio de imagem
          
    }
    ConsultaEstabelecimento();
    function ValidaCnpj(txtCnpj)
    {
        //Filtro para aceitar somente numros
       
        let cnpjNumeros = txtCnpj.replace(/[^0-9]/g, '');
        setCnpj(cnpjNumeros);
       // console.log(cnpj+ '/ numero: '+cnpjNumeros);
        if(cnpjNumeros.length == 14)
        {
         
            setCnpjValido(true);
           
        }
        else
        {
           
            setCnpjValido(false);
        }
        
        
      
    }

   //IMAGEM
   async function MoveImagem() {
    if (image !== null) {
      const nomeImagem = image.split('/').pop();
      const origem = image;
      const pastaLogoUsuario = `${FileSystem.documentDirectory}logoUsuario/`;
      const destino = `${pastaLogoUsuario}${nomeImagem}`;
  
      try {
        // Cria a pasta "logoUsuario" se não existir
        const pastaInfo = await FileSystem.getInfoAsync(pastaLogoUsuario);
        if (!pastaInfo.exists) {
          await FileSystem.makeDirectoryAsync(pastaLogoUsuario);
        }
  
        await FileSystem.moveAsync({
          from: origem,
          to: destino,
        });
        console.log('Imagem movida para:', destino);
        setImage(destino);
      } catch (error) {
        console.error('Erro ao mover a imagem:', error);
      }
    } else {
      console.log('Não é possível mover a imagem');
    }
  }

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
       
             {cnpjValido ==false  && cnpj > 0 ? <HelperText style={styles.msgHelper}>Digite um CNPJ valido!</HelperText> : ''}                                                 
            <TextInput label="CNPJ" keyboardType="numeric" maxLength={14}  onChangeText={txtCnpj =>{
                ValidaCnpj(txtCnpj);//Atualiza o estado do CNPJ
               
            }} theme={{colors:{primary: cnpjValido == false && cnpj > 0 ? 'red' :'#006699' }}} style={styles.inputFormulario}/>



            <SelectList placeholder="Ramo de atividade (opcional)" searchPlaceholder="Pesquisar" fontFamily="Rubik_400Regular" boxStyles={styles.inputFormulario}
                    setSelected={(val) => setSelected(val)} 
                    data={listaRamoAtividade} 
                    save="value"
            />

            <TouchableOpacity disabled={cnpjValido  == false? true : false } style={cnpjValido  == false? styles.btnSalvarDesabilitado : styles.btnSalvar} onPress={ValidaEnvio}>
                <Text style={styles.btnSalvarText} >SALVAR</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}