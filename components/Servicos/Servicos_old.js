import React, { useState } from "react";
import { HelperText, TextInput, Button } from 'react-native-paper';
import { SafeAreaView, Text, Image, View, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { SelectList,  MultipleSelectList } from "react-native-dropdown-select-list";
import { useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { ConsultaEstabelecimento, InserirEstabelecimento } from '../SQLiteManager/SQLEstabelecimento';
import { ConsultaRamoAtividade } from "../SQLiteManager/SQLRamoAtividade";
import SelectMultiple from 'react-native-select-multiple';
import styles from './StyleServicos';
import { GetServicosPorRamo, UpdateAtivoServico } from "../SQLiteManager/SQLServicos";

export default function Servicos() {
  const [ramoAtividade, setRamoAtividade] = useState(null);
  const [envio, setEnvio] = useState(false);
  const [animacaoSalvando, setAnimacaoSalvando] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [listaServicos, setListaServicos] = useState([]);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const ramoAtividadeTeste = 2;

  // Get ramo de atividade salvo
  useEffect(() => {
    ConsultaEstabelecimento((resultado) => {
      if (resultado !== null) {
        console.log('O ramo salvo no banco é: ' + resultado.ramoAtividade);
        setRamoAtividade(resultado.ramoAtividade);
      } else {
        console.log("Nenhum resultado encontrado.");
      }
    });
  }, []);


  const data = [
    {key:'1', value:'Mobiles', disabled:true},
    {key:'2', value:'Appliances'},
    {key:'3', value:'Cameras'},
    {key:'4', value:'Computers', disabled:true},
    {key:'5', value:'Vegetables'},
    {key:'6', value:'Diary Products'},
    {key:'7', value:'Drinks'},
];
const [selected, setSelected] = React.useState([]);
  ///

  // Navega para a tela 'Home'
  const navigation = useNavigation();
  const Continuar = () => {
    listaServicos.forEach(element => {
      UpdateAtivoServico(element, 0, ramoAtividadeTeste);
    });

    // setModalVisivel(false);
    servicosSelecionados.forEach(element => {
      UpdateAtivoServico(element.label, 1, ramoAtividadeTeste);
    });

    navigation.navigate('Gestor Agenda');
  };

  useEffect(() => {
    GetServicosPorRamo(ramoAtividadeTeste, (resultado) => {
      let listaGeral = [];
      let listaAtivos = [] ;
      resultado.forEach(element => {
        console.log('element --->', element)
        listaGeral.push(element.nomeServico);

        if (element.ativo == 1) {
          listaAtivos.push(element.nomeServico);
        }

        console.log('Resultado de get servico por ramo - nome:' + element.nomeServico);
        console.log('Resultado de get servico por ramo - ativo:' + element.ativo);
      });
      setListaServicos(listaGeral);
      setServicosSelecionados(listaAtivos);
    });

    //verificar se serviço está ativo, aí salva em servicosSelecionados
  }, []);
console.log('Servicos ativos ---->',servicosSelecionados)
  onSelectionsChange = (selecionados) => {
    // save the selections to this.state
    setServicosSelecionados(selecionados);
    console.log(selecionados);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Selecione os serviços que a empresa oferece:</Text>
      <View>
        <SelectMultiple
          items={listaServicos}
          selectedItems={servicosSelecionados}
          onSelectionsChange={onSelectionsChange} />
      </View>
      <View>
        {/* aqui vou por toda a lógica relacionada aos serviços criados pelo usuário */}
        <SelectMultiple
          items={listaServicos}
          selectedItems={servicosSelecionados}
          onSelectionsChange={onSelectionsChange} />
      </View>
      <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 10, display: 'flex', flexDirection: 'row' }}>
        <TextInput
          style={{ width: '70%', height: 40, borderColor: 'gray', marginBottom: 10 }}
          placeholder="Insira outros serviços"
        // value={inputValue}
        // onChangeText={(text) => setInputValue(text)}
        />
        <Button
          style={{ width: '20%', height: 40, borderColor: 'gray', backgroundColor: '#006699', borderRadius: 5 }}
          title="Save"
        //onPress={handleSave}
        >
          <Text style={styles.btnSalvarText}>OK</Text>
        </Button>

      
      </View>

 
      <TouchableOpacity
        style={styles.btnSalvar}
        onPress={Continuar}
      >
        <Text style={styles.btnSalvarText}>SALVAR</Text>
      </TouchableOpacity>


    </SafeAreaView>
  )
}