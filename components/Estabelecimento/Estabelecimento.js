import React, { useState } from "react";
import { TextInput } from 'react-native-paper';
import {SafeAreaView, Text, } from "react-native";
import * as ImagePicker from 'expo-image-picker';

//ESTILO
import styles from './StyleEstabelecimento';


export default function Estabelecimento()
{
   //FOI INSTALADO O IMAGE PICKER DO EXPO (FAZER TRATATIVAS PARA FUNCIONAR)
    return(
        <SafeAreaView sltyle={styles.container}>
            <TextInput label="Nome do Estabelecimento"   theme={{colors:{primary: '#006699'}}} style={styles.inputFormulario}/>
            <TextInput label="CNPJ"   theme={{colors:{primary: '#006699'}}} style={styles.inputFormulario}/>
            <TextInput label="Ramo de atividade"   theme={{colors:{primary: '#006699'}}} style={styles.inputFormulario}/>
           
        </SafeAreaView>
    )
}