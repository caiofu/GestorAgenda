import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from "react-native";
import { PaperProvider, Dialog, Portal, Button, TextInput, HelperText } from "react-native-paper";
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useEffect, useRef, useState } from "react";
import { SelectList, MultipleSelectList } from "react-native-dropdown-select-list";
import { DarkTheme, useNavigation } from "@react-navigation/native";

//STLE
import styles from "./StyleServicos";
import StyleDetalhesServicos from "./StyleDetalhesServicos";

//SQLITE
import { ConsultaRamoAtividade } from "../SQLiteManager/SQLRamoAtividade";
import { GetServicosPorRamo, UpdateAtivoServicoPorId, CriaNovoServico, GetServicosCustomizadosAtivos } from "../SQLiteManager/SQLServicos";
import { ListaTodasTabelas } from "../SQLiteManager/SQLiteManager";

//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";

export default function NovoServico() {
    //NAVIGATION
    const navigation = useNavigation();

    //CONTEXT
    const { tema, atulizaListaServico, setAtualisaListaServico } = useAppState();

    //COR DO TEMA
    const [corTema, setCorTema] = useState('#006699');
    useEffect(() => {

        tema === 'light' ? setCorTema('#006699') : setCorTema(DarkTheme.colors.text);
    }, [tema])

    //RAMO DE ATIVIDADE
    const [ramoAtividadeSelecionado, setRamoAtividadeSelecionado] = useState(""); //Usado para seleção da lista
    const [idRamoAtividade, setIdRamoAtividade] = useState(null);
    const [ramoAtividade, setRamoAtividade] = useState(null);
    const [listaRamoAtividade, setListaRamoAtividade] = useState([]);

    //SERVICOS
    const [servicoSelecionado, setServicoSelecionado] = useState([]);
    const [listaServicos, setListaServicos] = useState([]);

    //BOTOES
    const [btnImportar, setBtnImportar] = useState(false);
    const [btnNovo, setBtnNovo] = useState(false);

    //DIALOGO IMPORTAR SERVIÇO
    //const [importMensagemVisible, setImportMensagemVisible] = useState(false);

    //RESPONSAVEL PELAS MENSAGENS POS AÇÃO
    const [msgAcaoVisivel, setMsgAcaoVisivel] = useState(false);
    const EscondeMsgAcao = (tipoMensagem) => {
        setMsgAcaoVisivel(false);
        setAtualisaListaServico(true)
        //TipoMensagem: E=Erro / S=Sucesso
        if (tipoMensagem === 'E') {
            setMsgAcaoVisivel(false);
        }
        else if (tipoMensagem === 'S') {
            navigation.navigate(dialogTelaRetorno);
        }


    };
    const [dialogTitulo, setDialogTitulo] = useState('');
    const [dialogMensagem, setDialogMensagem] = useState('');
    const [dialogTipoMensagem, setDialogTipoMensagem] = useState('');
    const [dialogTelaRetorno, setDialogTelaRetorno] = useState('Serviços');

    //  const showDialogImport = () => setVisible(true);

    //const hideDialogImport = () => { setImportMensagemVisible(false);   navigation.navigate('Serviços'); setAtualisaListaServico(true)};

    //CONTROLA O TEMA
    //   useEffect(()=>{

    //    tema === 'light' ? setCorTema('#006699') : setCorTema(DarkTheme.colors.text);
    //      },[tema])

    //IMPORTAÇÃO

    //BOTAO IMPORTAR E LISTA DE RAMO DE ATIVIDADE    
    useEffect(() => {
        if (btnImportar) {

            ConsultaRamoAtividade((ramoAtividades) => {
                const retorno = ramoAtividades.map((atividade) => ({
                    key: atividade.idRamoAtividade.toString(),
                    value: atividade.nomeAtividade,
                }));
                //// console.log(retorno);
                setListaRamoAtividade(retorno);

            });
        }

    }, [btnImportar])

    //RESPONSAVEL PELA SELEÇÃO NO LIST RAMO ATIVIDADE
    useEffect(() => {
        // Obtendo chave correspondente ao valor do ramo de atividade
        const chaveSelecionada = listaRamoAtividade.find(item => item.value === ramoAtividadeSelecionado)?.key;
        setIdRamoAtividade(chaveSelecionada);
        // console.log(chaveSelecionada)
    }, [ramoAtividadeSelecionado, listaRamoAtividade]);

    //BUSCA A LISTA DE SERVIÇOS DE ACORDO COM RAMO ESCOLHIDO
    useEffect(() => {
        if (idRamoAtividade != null) {
            GetServicosPorRamo(idRamoAtividade, (servicos) => {

                const retorno = servicos.map((listaServico) => ({
                    key: listaServico.idServico.toString(),
                    // idRamoAtividade: listaServico.idRamoAtividade,
                    value: listaServico.nomeServico,
                    // descricao: listaServico.descricao
                }));
                setListaServicos(retorno);
            });
        }

    }, [idRamoAtividade])

    function ImportarServico() {
        setBtnImportar(true);
    }

    //SALVANDO A IMPORTAÇAO
    const [importadoSucesso, setImportadoSucesso] = useState(false);

    function BotaoSalvaImportacao() {
        let chamadasBemSucedidas = 0;
        const totalChamadas = servicoSelecionado.length;

        // Para cada serviço selecionado, encontre o id correspondente na listaServicos
        servicoSelecionado.forEach((servicoSelecionado) => {
            const servicoEncontrado = listaServicos.find((item) => item.value === servicoSelecionado);

            if (servicoEncontrado) {
                // idsSelecionados.push(servicoEncontrado.key);UpdateAtivoServicoPorId(idServico, 0);
                UpdateAtivoServicoPorId(servicoEncontrado.key, 1, (atualizacaoBemSucedida) => {
                    setImportadoSucesso(atualizacaoBemSucedida);
                    if (atualizacaoBemSucedida) {
                        chamadasBemSucedidas++;
                    }
                    // console.log('contador', chamadasBemSucedidas + 'toatal ', servicoSelecionado.length)
                    if (chamadasBemSucedidas === totalChamadas) {
                        //setImportMensagemVisible(true);
                        setDialogTitulo('Sucesso');
                        setDialogMensagem('Serviço importado')
                        setDialogTipoMensagem('S');
                        setDialogTelaRetorno('Novo Serviço')
                        setBtnImportar(false);
                        setMsgAcaoVisivel(true)
                        setAtualisaListaServico(true);
                    }
                });
            }
        });
    }

    function BotaoSalvaTodosImportacao() {
        let chamadasBemSucedidas = 0;
        const totalChamadas = listaServicos.length;

        listaServicos.forEach((servico) => {
            const servicoEncontrado = servico;

            if (servicoEncontrado) {
                // idsSelecionados.push(servicoEncontrado.key);UpdateAtivoServicoPorId(idServico, 0);
                UpdateAtivoServicoPorId(servicoEncontrado.key, 1, (atualizacaoBemSucedida) => {
                    setImportadoSucesso(atualizacaoBemSucedida);
                    if (atualizacaoBemSucedida) {
                        chamadasBemSucedidas++;
                    }
                    // console.log('contador', chamadasBemSucedidas + 'toatal ', listaRamoAtividade.length)
                    if (chamadasBemSucedidas === totalChamadas) {
                        //setImportMensagemVisible(true);
                        setDialogTitulo('Sucesso');
                        setDialogMensagem('Serviços importados')
                        setDialogTipoMensagem('S');
                        setDialogTelaRetorno('Novo Serviço')
                        setBtnImportar(false);
                        setMsgAcaoVisivel(true)
                        setAtualisaListaServico(true);
                    }
                });
            };
        });
    }

    //NOVO SERVIÇO
    const [novoNomeServico, setNovoNomeServico] = useState('');
    const [novaDescricao, setNovaDescricao] = useState('');
    const [favorito, setFavorivo] = useState(0);
    const [helperNome, setHelperNome] = useState(false);
    const refNome = useRef(null);
    function NovoServico() {
        setBtnNovo(true);
    }

    function CriarServico() {
        //Validação
        if (novoNomeServico === '') {
            setHelperNome(true);
            refNome.current.focus(); //Responsavel por levar o focu ate o input nome
        }
        else {
            setHelperNome(false);

            CriaNovoServico(novoNomeServico, novaDescricao, favorito, (novoID) => {
                if (novoID !== null) {
                    // A inserção foi bem-sucedida
                    // console.log(`Inserção bem-sucedida. Novo ID: ${novoID}`);
                    setDialogTitulo('Sucesso');
                    setDialogMensagem('Serviço criado!')
                    setDialogTelaRetorno('Novo Serviço')
                    setDialogTipoMensagem('S');
                    setMsgAcaoVisivel(true);
                    setBtnNovo(false);
                    //setAtualisaListaServico(true); ATUALIZAR LISTA DE SERVIÇO CUSTOMIZADO
                } else {
                    // A inserção falhou
                    // console.log('Falha ao inserir');
                    setDialogTitulo('Atenção');
                    setDialogMensagem('Não foi possivel criar o serviço')
                    setDialogTipoMensagem('E');
                    setMsgAcaoVisivel(true)

                }
            });
        }

    }

    // Função para fechar o teclado quando tocar fora do campo de entrada
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <PaperProvider  >
            <SafeAreaView >
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} enabled>
                    <ScrollView>
                        <TouchableWithoutFeedback onPress={dismissKeyboard}>


                            <View style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 20, margin: 10, }} >
                                {btnImportar ?
                                    (
                                        <>
                                            <SelectList
                                                placeholder="Selecione o ramo de atividade"
                                                searchPlaceholder=""

                                                fontFamily="Rubik_400Regular"
                                                boxStyles={styles.inputFormularioSelect}
                                                dropdownStyles={{ alignSelf: 'center', width: '89%' }}
                                                setSelected={(val) => { setRamoAtividadeSelecionado(val); }}
                                                data={listaRamoAtividade}
                                                dropdownTextStyles={{ color: corTema }}
                                                save="value"
                                                arrowicon={<FontAwesome5 name="chevron-down" size={17} color={corTema} />}
                                                searchicon={<FontAwesome5 name="search" size={17} color={corTema} />}
                                                closeicon={<FontAwesome name="close" size={24} color={corTema} />}
                                                // defaultOption={{key:idRamoAtividade,value:ramoAtividade}}
                                                inputStyles={{ color: corTema }} />

                                            <MultipleSelectList
                                                placeholder={ramoAtividadeSelecionado === '' ? 'Nenhum ramo de atividade selecionado' : "Escolha o serviço"}
                                                searchPlaceholder=""
                                                fontFamily="Rubik_400Regular"
                                                boxStyles={styles.inputFormularioSelect}
                                                dropdownStyles={{ alignSelf: 'center', width: '89%' }}
                                                dropdownTextStyles={{ color: corTema }}
                                                arrowicon={<FontAwesome5 name="chevron-down" size={17} color={corTema} />}
                                                searchicon={<FontAwesome5 name="search" size={17} color={corTema} />}
                                                closeicon={<FontAwesome name="close" size={24} color={corTema} />}
                                                inputStyles={{ color: corTema }}
                                                notFoundText=""
                                                data={listaServicos}
                                                save="value"
                                                //Para evitar erros quando usuario clica na lista vazia
                                                setSelected={(val) => {
                                                    if (ramoAtividadeSelecionado !== '') {
                                                        setServicoSelecionado(val);
                                                    }
                                                }
                                                }
                                            />

                                            <TouchableOpacity style={servicoSelecionado.length === 0 ? styles.btnDesabilitado : styles.btn} disabled={servicoSelecionado.length === 0 ? true : false} onPress={BotaoSalvaImportacao}>
                                                <View style={[styles.btnContainer, { alignSelf: 'center' }]}>
                                                    <Text style={styles.btnText}>IMPORTAR SELECIONADOS</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={ramoAtividadeSelecionado === '' ? styles.btnDesabilitado : styles.btn} disabled={ramoAtividadeSelecionado === '' ? true : false} onPress={BotaoSalvaTodosImportacao}>
                                                <View style={[styles.btnContainer, { alignSelf: 'center' }]}>
                                                    <Text style={styles.btnText}>IMPORTAR TODOS</Text>
                                                </View>
                                            </TouchableOpacity>

                                            {/* <TouchableOpacity style={styles.btnCancelar} >
                                            <View style={[styles.btnContainer, {alignSelf:'center'}]}>
                                                <Text style={styles.btnText}>CANCELAR</Text>
                                            </View>
                                        </TouchableOpacity> */}
                                        </>
                                    )
                                    : btnNovo ? //Botao novo serviço
                                        (
                                            <>
                                                <View>
                                                    <View>
                                                        <TouchableOpacity onPress={() => setFavorivo(!favorito)} style={[StyleDetalhesServicos.viewFavoritos, { marginBottom: 5, }]} disabled={novoNomeServico !== '' ? false : true}>

                                                            <FontAwesome name="star" size={22} color={favorito ? '#ffca00' : novoNomeServico !== '' ? 'grey' : '#80808069'} />
                                                            <Text style={[StyleDetalhesServicos.txtFavoritos, { color: favorito ? '#ffca00' : novoNomeServico !== '' ? 'grey' : '#80808069' }]}> {favorito ? 'Remover dos favoritos' : 'Marcar como favorito'} </Text>

                                                        </TouchableOpacity>
                                                    </View>
                                                    {helperNome ? <HelperText style={{ color: 'red', fontStyle: 'italic' }}>Nome não pode ser vazio</HelperText> : ''}
                                                    <TextInput
                                                        ref={refNome}
                                                        label="Nome Serviço"
                                                        style={styles.inputFormulario}
                                                        theme={{
                                                            colors: { primary: helperNome ? 'red' : corTema, onSurfaceVariant: helperNome ? 'red' : corTema }
                                                        }}
                                                        onChangeText={setNovoNomeServico}

                                                    >

                                                    </TextInput>
                                                    <TextInput
                                                        label="Descrição"
                                                        style={styles.inputFormulario}
                                                        theme={{
                                                            colors: { primary: corTema, onSurfaceVariant: corTema }
                                                        }}
                                                        onChangeText={setNovaDescricao}
                                                    >

                                                    </TextInput>

                                                    <TouchableOpacity style={styles.btn} onPress={CriarServico}>
                                                        <View style={[styles.btnContainer, { alignSelf: 'center' }]}>
                                                            {/* <FontAwesome5 name="plus" size={28} color="#fff" /> */}
                                                            <Text style={styles.btnTextNovoServico}>SALVAR </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        )
                                        :
                                        (

                                            <>
                                                <TouchableOpacity style={styles.btn} onPress={ImportarServico}>
                                                    <View style={styles.btnContainer}>
                                                        <FontAwesome5 name="file-import" size={28} color="#fff" />
                                                        <Text style={styles.btnText}>importar serviço</Text>
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={styles.btn} onPress={NovoServico}>
                                                    <View style={styles.btnContainer}>
                                                        <FontAwesome name="plus" size={28} color="#fff" />
                                                        <Text style={styles.btnText}>Criar novo</Text>
                                                    </View>
                                                </TouchableOpacity>


                                            </>

                                        )}

                                {/* Dialogo para quando for salvo com sucesso */}


                                <Portal>
                                    <Dialog visible={msgAcaoVisivel} dismissable={false} style={tema === 'light' ? styles.dialogLight : styles.dialogDark}>
                                        <Dialog.Title style={[styles.dialogTitulo, { color: corTema }]}>{dialogTitulo}</Dialog.Title>
                                        <Dialog.Content >
                                            <Text variant="bodyMedium" style={[styles.dialogContent, { color: tema === 'light' ? 'black' : "#fff" }]}>{dialogMensagem}</Text>
                                        </Dialog.Content>
                                        <Dialog.Actions>
                                            <Button labelStyle={{ fontFamily: 'Rubik_700Bold', color: tema === 'light' ? '#006699' : '#fff' }} onPress={() => EscondeMsgAcao(dialogTipoMensagem)}>Continuar</Button>
                                        </Dialog.Actions>
                                    </Dialog>
                                </Portal>
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </PaperProvider>
    )
}