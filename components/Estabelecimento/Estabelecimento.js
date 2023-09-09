import React, { useState } from "react";
import { HelperText, TextInput} from 'react-native-paper';
import {SafeAreaView, Text,  Image, View, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { SelectList } from "react-native-dropdown-select-list";
import { useEffect } from "react";
import * as FileSystem from 'expo-file-system';


import {ConsultaEstabelecimento, ConsultaEstabelecimento1, InserirEstabelecimento} from '../SQLiteManager/SQLEstabelecimento';  

//ESTILO
import styles from './StyleEstabelecimento';
import {ConsultaRamoAtividade, ExcluirBancoDeDados } from "../SQLiteManager/SQLiteManager";


export default function Estabelecimento()
{
 

    //BUSCA O RAMO DE ATIVIDADE (Usamos o useEffect para carregar somente na criaçao do componente)
    const [listaRamoAtividade, setListaRamoAtividade] = useState([]);
    useEffect(() => {
       

        ConsultaEstabelecimento1((resultado) => {
          if (resultado !== null) {
            
            setPrimeiroCadastro(false);
           // let jsonTe = resultado;
        
           setImage(resultado.logo);
           setIdEstabelecimento(resultado.idEstabelecimento);
           setNomeEstabelecimento(resultado.nomeEstabelecimento);
           setCnpj(resultado.cnpj);
           setCnpjValido(true);
           setSelected(resultado.ramoAtividade);
           setRamoAtividade(resultado.ramoAtividade);

          
            // Aqui, você pode acessar o resultado retornado
            //console.log("Resultado da consulta:", resultado);
            
          } else {
            setPrimeiroCadastro(true);
            // Trate o caso em que nenhum resultado foi encontrado
            console.log("Nenhum resultado encontrado.");
          }
          setDadosCarregados(true);
        });

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
    //UseEffect exlcuiso para o selectlis ramo de atividade
    useEffect(() => {
      // Obtendo chave correspondente ao valor do ramo de atividade
      const chaveSelecionada = listaRamoAtividade.find(item => item.value === selected)?.key;
      //console.log("Chave (key) correspondente ao valor de ramo de atividade:", chaveSelecionada);
      setIdRamoAtividade(chaveSelecionada);
    }, [selected, listaRamoAtividade]); //Esse trecho éa dependencia do useEffect estamos falando para o useEffect fica oberservando as mudanças nesse trecho para alteraças
    
    //VARIAVEIS DE ESTADO
    const [dadosCarregados, setDadosCarregados] = useState(false);

    const [nomeEstabelecimento, setNomeEstabelecimento]             = useState(null);
    const [msgNomeEstabelecimento, setMsgNomeEstabelecimento]   = useState(false);
    
    
    const [cnpj, setCnpj]                                       = useState("");
    const [cnpjValido, setCnpjValido]                           = useState(false);
   
    const [ramoAtividade, setRamoAtividade]                     = useState(null);
    const [idRamoAtividade, setIdRamoAtividade]                 = useState(null);
    const [msgRamoAtividade, setMsgRamoAtividade]               = useState(false);

    const [idEstabelecimento, setIdEstabelecimento]             = useState(null);
    
    const [selected, setSelected]                               = useState(""); //Usado para seleção da lista
  
  
    const [image, setImage]                                     = useState(null);
    const [envio, setEnvio]                                     = useState(false);

    const [primeiroCadastro, setPrimeiroCadastro]               = useState(false);
   
    //ENVIO
  
    const [animacaoSalvando, setAnimacaoSalvando] = useState(false);
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
            console.log("IMAGEM NOVA",image)
        
        }
    }
   
    //FUNÇÕES
    async function ValidaEnvio()
    {
        //Estabelecimento
        if (nomeEstabelecimento === null || nomeEstabelecimento === "")
         {
            setEnvio(false);
            setMsgNomeEstabelecimento(true);
          
          } else {
            setEnvio(true);
            setMsgNomeEstabelecimento(false);
            await MoveImagem(); //NAO ESQUECER DE TROCAR O NOME DESSA FUNÇAO POIS ELA FAZ MUITO MAIS QUE MOVER A IMAGEM
            setModalVisivel(true);
          console.log(image)
        
          }
        
          //Mudar diretorio de imagem
          
    }
   
    function ValidaCnpj(txtCnpj)
    {
        //Filtro para aceitar somente numros
       
        let cnpjNumeros = txtCnpj.replace(/[^0-9]/g, '');
        setCnpj(cnpjNumeros);
        console.log(cnpj+ '/ numero: '+cnpjNumeros);
        if(cnpjNumeros.length == 14)
        {
         
            setCnpjValido(true);
           
        }
        else
        {
           
            setCnpjValido(false);
        }
        
        
      
    }

    //
   
   //IMAGEM (MUDAR O NOME POR NAO ESTA SOMENTE MOVENTO A IMAGEM E SIM INSERINDO NA TABELA ESTABELECIMENTO TB)
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
       
       // console.log('DESTINO==',destino)
        await FileSystem.moveAsync({
          from: origem,
          to: destino,
        });
        console.log('Imagem movida para:', destino);
        setImage(destino);

        //INSERINDO DADOS

        //Verificando se é primeiro acesso para trocar o tipo de query entre insert e update
        let tipoAcao= "";
        primeiroCadastro ? tipoAcao = "insercao" : tipoAcao = "atualizacao";
        
        InserirEstabelecimento(
          nomeEstabelecimento,cnpj,destino,ramoAtividade,tipoAcao, idEstabelecimento
        )
          .then((inseridoComSucesso) => {
            // Aqui, você pode executar sua animação com base no resultado
           
            setAnimacaoSalvando(true)
            if (inseridoComSucesso) {
              // Inserção bem-sucedida, execute sua animação de sucesso
      
              setAnimacaoSalvando(false);
            } else {
              
              // Inserção falhou, execute uma animação de erro, se necessário
              // ...
              console.log('erro ao inserir');
            }
          })
          .catch((error) => {
            // Lidar com erros, se houver
            // ...
          });
      } catch (error) {
        console.error('Erro ao mover a imagem:', error);
      }
    } else {
      console.log('Não é possível mover a imagem');
    }
  }

  //MODAL
  const [modalVisivel, setModalVisivel] = useState(false);


    return(
      
      <SafeAreaView style={styles.container}>
      
     
       
        
          <View style={styles.boxLogo}>
            {image != null ? (
              <Image source={{ uri: image }} style={{ width: 200, height: 200, alignSelf: 'center' }} />
            ) : (
              <Image source={require('../../assets/logo/logo-app.png')} style={{ width: 200, height: 200 }} />
            )}
            <TouchableOpacity style={styles.btnLogo} onPress={selecionaImagem}>
              <Text style={styles.btnLogoText}>SELECIONAR LOGO</Text>
            </TouchableOpacity>
          </View>
          <View>

          </View>
          {msgNomeEstabelecimento == true ? (
            <HelperText style={styles.msgHelper}>Este campo é obrigatório</HelperText>
          ) : (
            ''
          )}
          <TextInput
            label="Nome do Estabelecimento"
            onChangeText={setNomeEstabelecimento}
            theme={{
              colors: { primary: msgNomeEstabelecimento ? 'red' : '#006699' },
            }} value={nomeEstabelecimento}
            style={styles.inputFormulario}
          />
          {console.log("CNPJ AGORA:",cnpj.length+"VALIDO: "+cnpjValido)}
         
          {cnpjValido == false  && cnpj.length > 0 ? (
            <HelperText style={styles.msgHelper}>Digite um CNPJ válido!</HelperText>
          ) : (
            ''
          )}
          <TextInput
            label="CNPJ"
            keyboardType="numeric"
            maxLength={14}
            onChangeText={(txtCnpj) => {
              ValidaCnpj(txtCnpj); //Atualiza o estado do CNPJ
            }}
            theme={{
              colors: { primary: cnpjValido == false && cnpj > 0 ? 'red' : '#006699' },
            }}
            style={styles.inputFormulario}
            value={cnpj}
          />

          <SelectList
            placeholder="Ramo de atividade (opcional)"
            searchPlaceholder="Pesquisar"
            fontFamily="Rubik_400Regular"
            boxStyles={styles.inputFormulario}
            setSelected={(val) => {setRamoAtividade(val);}}
            data={listaRamoAtividade}
            save="value"
            defaultOption={{key:idRamoAtividade,value:ramoAtividade}}
            
          />
  
          <TouchableOpacity
            disabled={cnpjValido == false ? true : false}
            style={cnpjValido == false ? styles.btnSalvarDesabilitado : styles.btnSalvar}
            onPress={ValidaEnvio}
          >
       
            <Text style={styles.btnSalvarText}>{primeiroCadastro ? 'SALVAR' : 'ATUALIZAR'}</Text>
          </TouchableOpacity>
          
      
          <Modal animationType="slide" transparent={true} visible={modalVisivel}>
          <View style={styles.contornoModal}>
            <View style={styles.janelaModal}>
              {animacaoSalvando ? (
                <View>
                  <ActivityIndicator size={70} color="#006699" />
                  <Text style={styles.txtAnimacao}>Salvando</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.txtModal}>Dados salvos com sucesso!</Text>
                  <TouchableOpacity style={styles.btnModal} onPress={() => {setModalVisivel(false)}} >
                    <Text style={styles.txtBtnModal}>CONTINUAR</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
      </Modal>
    </SafeAreaView>
    )
}