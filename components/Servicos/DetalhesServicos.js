import { SafeAreaView, TouchableOpacity, View } from "react-native";
import { Text, Button, TextInput,PaperProvider, Portal, Dialog, Tooltip } from 'react-native-paper';

import { StatusBar } from "expo-status-bar";
import { GetServicosPorRamo, GetServicosPorId, UpdateAtivoServicoPorId, UpdateServicoPorId, UpdateFavoritoServicoPorId } from "../SQLiteManager/SQLServicos";
import { useState, useEffect } from 'react';

import { FontAwesome } from '@expo/vector-icons';
import StyleDetalhesServicos from './StyleDetalhesServicos';
import styles from "./StyleServicos";
import {  useNavigation } from "@react-navigation/native";
//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";


export default function DetalhesServicos(props) {

    //NAVIGATION
    const navigation = useNavigation();


    //CONTEXT
    const {tema,  setAtualisaListaServico, atulizaListaServico } = useAppState();

    // Acesse o valor do idServico por meio de props.route.params
    const idServico = props.route.params.id;
    const [servico, setServico] = useState({});
    const [iconeEstrela, setIconeEstrela] = useState('star-outline');

    //RESPONSAVEL PELAS MENSAGENS POS AÇÃO
    const [msgAcaoVisivel, setMsgAcaoVisivel] = useState(false);
    const EscondeMsgAcao = (tipoMensagem) => { 
        setMsgAcaoVisivel(false);
        setAtualisaListaServico (true)
        //TipoMensagem: E=Erro / S=Sucesso
        if(tipoMensagem === 'E')
        {
            setMsgAcaoVisivel(false);
        }
        else if(tipoMensagem === 'S')
        {
            navigation.navigate('Serviços');
        }
        
       
    };
    const [dialogTitulo, setDialogTitulo]       = useState('');
    const [dialogMensagem, setDialogMensagem]   = useState('');
    const [dialogTipoMensagem, setDialogTipoMensagem]       = useState('');

    //TEMA
    const [corTema, setCorTema] = useState('#006699');

    useEffect(()=>{
 
     tema === 'light' ? setCorTema('#006699') : setCorTema(DarkTheme.colors.text);
       },[tema])

    //MENSAGEM INPUT (RESPONSAVEL POR DEIXAR VERMELHO CASO O CAMPO NAO PASSAR PELA VALIDAÇÃO)
    const [msgNomeServico, setMsgNomeServico]   = useState(false);   

    useEffect(() => {
     
        GetServicosPorId(idServico, (servico) => {
            const retorno = servico;
            //setIconeEstrela(servico.favorito === 1 ? 'star' : 'star-outline');
            setServico(retorno);
         
        });
    }, [atulizaListaServico])

    function atualizarServicoState(dado) {
        console.log('Dado: ' + dado.descricao);
        setServico(dado);
    }

    function inativarServico() {
        UpdateAtivoServicoPorId(idServico, 0, (atualizacaoBemSucedida) => {
            if(atualizacaoBemSucedida)
            {
                setMsgAcaoVisivel(true);
                setAtualisaListaServico(true);
                //Retirando dos favoritos
                UpdateFavoritoServicoPorId(idServico, 0);
                setIconeEstrela(0);
                
                //Setando a mensagem
                setDialogTitulo('Sucesso!');
                setDialogMensagem('Serviço removido.');
               
            }
            else
            {
                console.log('erro ao desavitar serviço')
            }
        });
    }

    function atualizarServicoBanco() 
    {
        //Validaçoes (Nome Obrigatorio)
       
        if(servico.nomeServico === '')
        {
          
           setDialogTipoMensagem('E');
           setDialogTitulo('Atenção');
           setDialogMensagem('Campo nome não pode ser vazio!');
           setMsgNomeServico(true);
           setMsgAcaoVisivel(true);
           
        }
        else
        {
            UpdateServicoPorId(idServico, servico.nomeServico, servico.descricao);
            setDialogTipoMensagem('S');
            setDialogTitulo('Sucesso');
            setDialogMensagem('Serviço atualizado!');
            setMsgNomeServico(false);
            setMsgAcaoVisivel(true);
        }
       
    }

    function atualizarFavoritoBanco() {
        console.log('Valor em favorito DetalhesServicos: ' + servico.favorito)
        valor = servico.favorito === 1 ? 0 : 1
        UpdateFavoritoServicoPorId(idServico, valor);
        setIconeEstrela(valor);
        //Atualiza o state do context
        setAtualisaListaServico(true); 
    }

    return (
        <PaperProvider>
            <SafeAreaView style={StyleDetalhesServicos.container}>
                <View style={StyleDetalhesServicos.dadosDiv}>
                    <View>
                        <TouchableOpacity onPress={atualizarFavoritoBanco}>
                            <View style={StyleDetalhesServicos.viewFavoritos}>
                                <FontAwesome name="star" size={22} color={servico.favorito  === 1 ? '#ffca00' : 'grey'}/>
                                <Text style={[StyleDetalhesServicos.txtFavoritos, {color: servico.favorito === 1 ? '#ffca00' : 'grey'}]}> {servico.favorito === 1 ? 'Remover dos favoritos': 'Marcar como favorito'} </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* <Text variant="titleLarge" style={{ color: 'gray' }}>Nome:</Text> */}
                    <TextInput
                        label="Nome"
                        value={servico.nomeServico}
                        style={styles.inputFormulario}
                        theme={{
                            colors: { primary: msgNomeServico ? 'red' : corTema, onSurfaceVariant:  msgNomeServico ? 'red' : corTema   }
                          }}
                        onChangeText={(text) => atualizarServicoState({ ...servico, nomeServico: text })}
                    />
                    {/* <Text variant="titleLarge" style={{ color: 'gray' }}>Descrição:</Text> */}
                    <TextInput
                        label="Descrição"
                        value={servico.descricao}
                        textColor="#595a67"
                        theme={{
                            colors: {  corTema, onSurfaceVariant:  corTema   },
                         
                          }}
                        onChangeText={(text) => atualizarServicoState({ ...servico, descricao: text })}
                        multiline={true}
                    />
                </View>

                <View style={StyleDetalhesServicos.viewBotoesAcao}>
                    {/* <Button buttonColor="red" mode="contained"  >
                        
                    </Button> */}
                    <TouchableOpacity onPress={inativarServico} style={[StyleDetalhesServicos.btnAcao,{backgroundColor:'red'}]}>
                        <Text style={StyleDetalhesServicos.btnAcaoText}>Remover serviço</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={atualizarServicoBanco} style={StyleDetalhesServicos.btnAcao}>
                        <Text style={StyleDetalhesServicos.btnAcaoText}>Salvar</Text>
                    </TouchableOpacity>

                    
                </View>

                  {/* Dialogo para quando serviço for removido */}
          
            <Portal>
                <Dialog visible={msgAcaoVisivel} dismissable={false}  style={{}}>
                    <Dialog.Title>{dialogTitulo}</Dialog.Title>
                    <Dialog.Content>
                    <Text variant="bodyMedium">{dialogMensagem}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                    <Button onPress={() =>EscondeMsgAcao(dialogTipoMensagem)}>Continuar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            </SafeAreaView>
        </PaperProvider>
    )
}