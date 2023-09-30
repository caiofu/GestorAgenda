import { SafeAreaView, TouchableOpacity, View } from "react-native";
import { Text, Button, TextInput,PaperProvider, Portal, Dialog } from 'react-native-paper';

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
    const EscondeMsgAcao = () => { setMsgAcaoVisivel(false);   navigation.navigate('Serviços'); setAtualisaListaServico (true)};

    useEffect(() => {
     
        GetServicosPorId(idServico, (servico) => {
            const retorno = servico;
            //setIconeEstrela(servico.favorito === 1 ? 'star' : 'star-outline');
            setServico(retorno);
            console.log('passo pelo efeect?')
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
                console.log('serviço desativoad')
            }
            else
            {
                console.log('erro ao desavitar serviço')
            }
        });
    }

    function atualizarServicoBanco() {
        UpdateServicoPorId(idServico, servico.nomeServico, servico.descricao);
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
                    <Text variant="titleLarge" style={{ color: 'gray' }}>Nome:</Text>
                    <TextInput
                        value={servico.nomeServico}
                        onChangeText={(text) => atualizarServicoState({ ...servico, nomeServico: text })}
                    />
                    <Text variant="titleLarge" style={{ color: 'gray' }}>Descrição:</Text>
                    <TextInput
                        value={servico.descricao}
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
                    <Dialog.Title>Sucesso!</Dialog.Title>
                    <Dialog.Content>
                    <Text variant="bodyMedium">Serviço Removido da lista</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                    <Button onPress={EscondeMsgAcao}>Continuar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            </SafeAreaView>
        </PaperProvider>
    )
}