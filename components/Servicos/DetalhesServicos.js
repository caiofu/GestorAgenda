import { SafeAreaView, TouchableOpacity, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import { Text, Button, TextInput, PaperProvider, Portal, Dialog } from 'react-native-paper';
import { StatusBar } from "expo-status-bar";
import { GetServicosPorRamo, GetServicosPorId, UpdateAtivoServicoPorId, UpdateServicoPorId, UpdateFavoritoServicoPorId, GetServicosCustomizadosPorId, UpdateServicoCustomizadoPorId, UpdateAtivoServicoCustomizadoPorId, UpdateFavoritoServicoCustomizadoPorId } from "../SQLiteManager/SQLServicos";
import { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import StyleDetalhesServicos from './StyleDetalhesServicos';
import styles from "./StyleServicos";
import { DarkTheme, useNavigation } from "@react-navigation/native";
//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";

export default function DetalhesServicos(props) {
    //NAVIGATION
    const navigation = useNavigation();

    //CONTEXT
    const { tema, setAtualisaListaServico, atulizaListaServico } = useAppState();

    // Acesse o valor do idServico por meio de props.route.params
    const idServico = props.route.params.id;
    const tipoServico = props.route.params.tipoServico;

    const [servico, setServico] = useState({});
    const [iconeEstrela, setIconeEstrela] = useState('star-outline');

    //RESPONSAVEL PELAS MENSAGENS POS AÇÃO
    const [msgAcaoVisivel, setMsgAcaoVisivel] = useState(false);
    const [msgConfirmacaoVisivel, setMsgConfirmacaoVisivel] = useState(false);

    const EscondeMsgAcao = (tipoMensagem) => {
        setMsgAcaoVisivel(false);
        setAtualisaListaServico(true)
        //TipoMensagem: E=Erro / S=Sucesso
        if (tipoMensagem === 'E') {
            setMsgAcaoVisivel(false);
        }
        else if (tipoMensagem === 'S') {
            navigation.navigate('Serviços');
        }
    };

    const EscondeMsgConfirmacao = () => {
        setMsgConfirmacaoVisivel(false);
    };


    const [dialogTitulo, setDialogTitulo] = useState('');
    const [dialogMensagem, setDialogMensagem] = useState('');
    const [dialogTipoMensagem, setDialogTipoMensagem] = useState('');
    const [dialogTelaRetorno, setDialogTelaRetorno] = useState('')

    //TEMA
    const [corTema, setCorTema] = useState('#006699');
    const [corTemaTexto, setCorTemaTexto] = useState('#595a67')

    useEffect(() => {
        if (tema === 'light') {
            setCorTema('#006699');
            setCorTemaTexto('#595a67');
        }
        else {
            setCorTema(DarkTheme.colors.text);
            setCorTemaTexto(DarkTheme.colors.text);
        }

    }, [tema])

    //MENSAGEM INPUT (RESPONSAVEL POR DEIXAR VERMELHO CASO O CAMPO NAO PASSAR PELA VALIDAÇÃO)
    const [msgNomeServico, setMsgNomeServico] = useState(false);

    useEffect(() => {
        //VERIFICA EM QUE LISTA VAI  BUSCA (SERVIÇO IMPORTADOS OU SERVIÇOS CRIADOS)
        if (tipoServico === 'importado') {
            GetServicosPorId(idServico, (servico) => {
                const retorno = servico;
                //setIconeEstrela(servico.favorito === 1 ? 'star' : 'star-outline');
                setServico(retorno);
            });
        }
        else if (tipoServico === 'criado') {
            GetServicosCustomizadosPorId(idServico, (servico) => {
                const retorno = servico;
                //setIconeEstrela(servico.favorito === 1 ? 'star' : 'star-outline');
                setServico(retorno);
            });
        }
    }, [atulizaListaServico])

    function atualizarServicoState(dado) {
        setServico(dado);
    }

    function confirmaInativarServico() {
        setMsgConfirmacaoVisivel(true);
        setDialogTitulo('Deseja remover?');
        setDialogTipoMensagem('E');
        setDialogTelaRetorno('Serviços');
    }

    function inativarServico() {
        EscondeMsgConfirmacao();
        
        //VERIFICA O TIPO DO SERVIÇO  CRIADO OU IMPORTADO
        if (tipoServico === 'importado') {
            UpdateAtivoServicoPorId(idServico, 0, (atualizacaoBemSucedida) => {
                if (atualizacaoBemSucedida) {
                    setMsgAcaoVisivel(true);
                    setAtualisaListaServico(true);
                    //Retirando dos favoritos
                    UpdateFavoritoServicoPorId(idServico, 0);
                    setIconeEstrela(0);

                    //Setando a mensagem
                    setDialogTitulo('Sucesso!');
                    setDialogTipoMensagem('S');
                    setDialogTelaRetorno('Serviços')
                    setDialogMensagem('Serviço removido.');
                }
                else {
                    console.log('erro ao desavitar serviço')
                }
            });
        }
        else if (tipoServico === 'criado') {
            console.log('desativando serviço criado.')
            UpdateAtivoServicoCustomizadoPorId(idServico, 0, (atualizacaoBemSucedida) => {
                if (atualizacaoBemSucedida) {
                    setMsgAcaoVisivel(true);
                    setAtualisaListaServico(true);
                    //Retirando dos favoritos
                    UpdateFavoritoServicoCustomizadoPorId(idServico, 0);
                    setIconeEstrela(0);

                    //Setando a mensagem
                    setDialogTitulo('Sucesso!');
                    setDialogTipoMensagem('S');
                    setDialogTelaRetorno('Serviços')
                    setDialogMensagem('Serviço removido.');
                }
                else {
                    console.log('erro ao desavitar serviço')
                }
            });
        }
    }

    function atualizarServicoBanco() {
        //Validaçoes (Nome Obrigatorio)
        if (servico.nomeServico === '') {
            setDialogTipoMensagem('E');
            setDialogTitulo('Atenção');
            setDialogMensagem('Campo nome não pode ser vazio!');
            setMsgNomeServico(true);
            setMsgAcaoVisivel(true);
        }
        else {
            //VERIFICA O TIPO DO SERVIÇO  CRIADO OU IMPORTADO
            if (tipoServico === 'importado') {
                UpdateServicoPorId(idServico, servico.nomeServico, servico.descricao);
                setDialogTipoMensagem('S');
                setDialogTitulo('Sucesso');
                setDialogMensagem('Serviço atualizado!');
                setMsgNomeServico(false);
                setMsgAcaoVisivel(true);
            }
            else if (tipoServico === 'criado') {
                UpdateServicoCustomizadoPorId(idServico, servico.nomeServico, servico.descricao);
                setDialogTipoMensagem('S');
                setDialogTitulo('Sucesso');
                setDialogMensagem('Serviço atualizado!');
                setMsgNomeServico(false);
                setMsgAcaoVisivel(true);
            }
        }
    }

    function atualizarFavoritoBanco() {
        //VERIFICA O TIPO DO SERVIÇO  CRIADO OU IMPORTADO
        if (tipoServico === 'importado') {
            valor = servico.favorito === 1 ? 0 : 1
            UpdateFavoritoServicoPorId(idServico, valor);

            //Atualiza o state do context
            setAtualisaListaServico(true);
        }
        else if (tipoServico === 'criado') {
            valor = servico.favorito === 1 ? 0 : 1
            UpdateFavoritoServicoCustomizadoPorId(idServico, valor);

            //Atualiza o state do context
            setAtualisaListaServico(true);
        }
    }

    // Função para fechar o teclado quando tocar fora do campo de entrada
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    return (
        <PaperProvider>
            <SafeAreaView style={StyleDetalhesServicos.container}>
                <ScrollView>
                    <TouchableWithoutFeedback onPress={dismissKeyboard}>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled>
                            <View style={StyleDetalhesServicos.dadosDiv}>
                                <View>

                                    <TouchableOpacity onPress={atualizarFavoritoBanco} style={StyleDetalhesServicos.viewFavoritos} disabled={servico.nomeServico !== '' ? false : true}>
                                        <FontAwesome name="star" size={22} color={servico.favorito === 1 ? '#ffca00' : servico.nomeServico !== '' ? 'grey' : '#80808069'} />
                                        <Text style={[StyleDetalhesServicos.txtFavoritos, { color: servico.favorito === 1 ? '#ffca00' : servico.nomeServico !== '' ? 'grey' : '#80808069' }]}> {servico.favorito === 1 ? 'Remover dos favoritos' : 'Marcar como favorito'} </Text>
                                    </TouchableOpacity>
                                </View>
                                {/* <Text variant="titleLarge" style={{ color: 'gray' }}>Nome:</Text> */}
                                <TextInput
                                    label="Nome"
                                    value={servico.nomeServico}
                                    style={styles.inputFormulario}
                                    textColor={corTemaTexto}
                                    theme={{
                                        colors: { primary: msgNomeServico ? 'red' : corTema, onSurfaceVariant: msgNomeServico ? 'red' : corTema }
                                    }}
                                    onChangeText={(text) => atualizarServicoState({ ...servico, nomeServico: text })}
                                />
                                {/* <Text variant="titleLarge" style={{ color: 'gray' }}>Descrição:</Text> */}
                                <TextInput
                                    label="Descrição"
                                    value={servico.descricao}
                                    style={styles.inputFormulario}
                                    textColor={corTemaTexto}
                                    theme={{
                                        colors: { primary: corTema, onSurfaceVariant: corTema },

                                    }}
                                    onChangeText={(text) => atualizarServicoState({ ...servico, descricao: text })}
                                    multiline={true}
                                />
                            </View>

                            <View style={StyleDetalhesServicos.viewBotoesAcao}>
                                {/* <Button buttonColor="red" mode="contained"  >
                                    
                                </Button> */}
                                <TouchableOpacity onPress={confirmaInativarServico} style={[StyleDetalhesServicos.btnAcao, { backgroundColor: 'red' }]}>
                                    <Text style={StyleDetalhesServicos.btnAcaoText}>Remover serviço</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={atualizarServicoBanco} style={StyleDetalhesServicos.btnAcao}>
                                    <Text style={StyleDetalhesServicos.btnAcaoText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Dialogos para quando serviço for removido: */}
                            {/* Confirmar exclusão: */}
                            <Portal>
                                <Dialog visible={msgConfirmacaoVisivel} dismissable={false} style={tema === 'light' ? styles.dialogLight : styles.dialogDark}>
                                    <Dialog.Title style={[styles.dialogTitulo, { color: corTema }]}>{dialogTitulo}</Dialog.Title>
                                    <Dialog.Content>
                                        <Text variant="bodyMedium" style={[styles.dialogContent, { color: tema === 'light' ? 'black' : "#fff" }]}>{dialogMensagem}</Text>
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        <Button labelStyle={{ fontFamily: 'Rubik_700Bold', color: tema === 'light' ? '#006699' : '#fff' }} onPress={() => inativarServico()}>Confirmar</Button>
                                        <Button labelStyle={{ fontFamily: 'Rubik_700Bold', color: tema === 'light' ? '#006699' : '#fff' }} onPress={() => EscondeMsgConfirmacao()}>Cancelar</Button>
                                    </Dialog.Actions>
                                </Dialog>
                            </Portal>

                            {/* Aviso de exclusão: */}
                            <Portal>
                                <Dialog visible={msgAcaoVisivel} dismissable={false} style={tema === 'light' ? styles.dialogLight : styles.dialogDark}>
                                    <Dialog.Title style={[styles.dialogTitulo, { color: corTema }]}>{dialogTitulo}</Dialog.Title>
                                    <Dialog.Content>
                                        <Text variant="bodyMedium" style={[styles.dialogContent, { color: tema === 'light' ? 'black' : "#fff" }]}>{dialogMensagem}</Text>
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        <Button labelStyle={{ fontFamily: 'Rubik_700Bold', color: tema === 'light' ? '#006699' : '#fff' }} onPress={() => EscondeMsgAcao(dialogTipoMensagem)}>Continuar</Button>
                                    </Dialog.Actions>
                                </Dialog>
                            </Portal>

                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>
    )
}