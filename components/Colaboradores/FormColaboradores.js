//FRONT
import { useEffect, useRef, useState } from 'react'
import { Text, View, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { TextInput, List, HelperText, ProgressBar,  Dialog, Portal, PaperProvider, Switch } from 'react-native-paper'
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { MultipleSelectList } from "react-native-dropdown-select-list"; //a aposentar

//LISTAGEM DOS SERVIÇOS
import DropDownPicker from 'react-native-dropdown-picker'; //novo componente para renderizar serviços favoritos
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import comparator from 'lodash'; // comparação de listas

//BANCO DE DADOS
import { GetServicosEstabelecimento, GetServicosColaborador, FavoritarServicoColaborador, DesfavoritarServicoColaborador } from '../SQLiteManager/SQLServicoColaborador';
import { CriaNovoColaborador, UpdateColaboradorPorId, ValidaNomeColaborador, AlteraStatusColaboradorPorId } from '../SQLiteManager/SQLiteColaborador';

//NAVIGATION
import {  DarkTheme, useNavigation } from "@react-navigation/native";

//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";

export default function FormColaboradores({route}) {
    //NAVIGATION
    const navigation = useNavigation();

    //CONTEXT
    const {tema, atulizaListaServico, setAtualisaListaServico } = useAppState();

    //COR DO TEMA
    const [corTema, setCorTema] = useState('#006699');
    useEffect(()=>{
 
       tema === 'light' ? setCorTema('#006699') : setCorTema(DarkTheme.colors.text);
         },[tema])

    //// console.log(route); //verificar os parâmetro fornecidos à tela de formulário.
    //Dados colaboradora
    const [idColaborador, setIdColaborador] = useState(null);
    const [nome, setNome] = useState('');
    const [statusColaborador, setStatusColaborador] = useState(null);
    const [funcao, setFuncao] = useState('');
    const [edicaoCadastro, setEdicaoCadastro] = useState(null);
    const [helperNome, setHelperNome] = useState(false);
    const [nomeRepetido, setNomeRepetido] = useState(false);
    const refNome = useRef(null);

    //SWITCH
    const [desativaSwitch, setDesativaSwitch] = useState(false);

    //Estados relacionados aos serviços
    const [desabilitaLista, setDesabilitaLista] = useState(true);
    const [listaServicosEstabelecimento, setListaServicosEstabelecimento] = useState([]);
    const [listaServicosSelecionados, setListaServicosSelecionados] = useState([]);
    const [listaServicosPreEdicao, setListaServicosPreEdicao] = useState([]);
    // const [listaNovosServicosSelecionados, setlistaNovosServicosSelecionados] = useState([]); //usado somente para edição de cadastro
    // const [listaServicosDesfavoritados, setListaServicosDesfavoritados] = useState([]); // usado somente para edição de cadastro
    // const [servicoSelecionado, setServicoSelecionado] = useState(null);

    //Erros
    const [erro, setErro] = useState(null); //estado para armazenar erros

    //DropDownPicker
    const [isOpen, setIsOpen] = useState(false); //para que o MultipleSelectList venha sempre aberto
    const [max, setMax] = useState(null);
    const maxHeight = heightPercentageToDP('40%'); // Define a altura máxima do DropDownPicker como 40% da altura da tela

    //Estados Botão
    const [desabilitaBotao, setDesabilitaBotao] = useState(true);
    
    //constante que recebe parâmetro de colaborador, caso for null, significa que veio do botão 
    const colaborador = route.params.colaborador;

    //Inicialização dos dados
    useEffect(() => {
        //BUSCA SERVIÇOS VINCULADOS AO ESTABELECIMENTO e ALTERA O ESTADO ISOPEN PARA TRAZER O DROPDOWNPICKER ABERTO POR PADRÃO
        GetServicosEstabelecimento(
            //   route.params.colaborador ? route.params.colaborador.idColaborador : null,
            (servicosArray) => {
            setListaServicosEstabelecimento(servicosArray);
            setMax(servicosArray.length);
            setIsOpen(true);
            setErro(null); // Limpar erro, se houver
            },
            (error) => {
                setErro(error);
                // console.log('[LOGS] - Erro GetServicosEstabelecimento: ', error)
            }
        );
        //condição para editar o cadastro
        if(colaborador){
            setIdColaborador(colaborador.idColaborador);
            setNome(colaborador.nomeColaborador);
            setStatusColaborador(colaborador.ativo === 1 ? true : false);
            setFuncao(colaborador.descricao);
            setEdicaoCadastro(true);
            if(colaborador.ativo === 1){
                setDesabilitaLista(false);
                setDesabilitaBotao(false);
            }
            else{
                // console.log('Ta caindo aqui!!!!');
                setDesabilitaLista(true);
                setDesabilitaBotao(true);
            }
            //setDesabilitaLista(false);
            // // console.log(route.params.colaborador.idColaborador);
            GetServicosColaborador(colaborador.idColaborador, (servicosColaboradorArray)=>{
                // // console.log("Serviços sendo inseridos em setListaServicosSelecionados");
                const ValuesServicosColaborador = servicosColaboradorArray.map((servico)=>servico.value);
                // console.log(servicosColaboradorArray);
                setListaServicosPreEdicao(ValuesServicosColaborador); //usada para comparar com o estado final da lista no momento de salvar a edição
                setListaServicosSelecionados(ValuesServicosColaborador);
                // // console.log("ValuesServicosColaborador: ", ValuesServicosColaborador);
            })
            // setDesabilitaBotao(false)
        }
        else {
            setNome('');
            setFuncao('');
            setStatusColaborador(true);
            setDesabilitaBotao(true);
            setEdicaoCadastro(false);
        }
    }, []);

    //ATIVAÇÃO E INATIVAÇÃO DE COLABORADOR
    function AlteraStatusColaborador(){
        AlteraStatusColaboradorPorId(idColaborador, !statusColaborador, (sucesso)=>{
            if(sucesso){
                setStatusColaborador(!statusColaborador);
                setDesabilitaLista(statusColaborador);
                setDesabilitaBotao(statusColaborador);
            }
        })
    }
    //FINALIZAÇÃO DO PROCESSO DE CADASTRO OU EDIÇÃO DE COLABORADOR
    //Cadastro de novo colaborador
    function CriarColaborador(){
        //Validação
        if(nome === '')
        {
            setHelperNome(true);
            refNome.current.focus(); //Responsável por levar o foco ate o input nome
        }
        else
        {
            ValidaNomeColaborador(nome, (verificacao)=>{
                if(verificacao){
                    setHelperNome(false);
                    CriaNovoColaborador(nome, funcao, (novoID) => {
                        if (novoID !== null) {
                            // A inserção foi bem-sucedida
                            // console.log('[LOGS] - Inserção bem-sucedida em CriaNovoColaborador. Novo ID: ${novoID}');
                            //Etapa de vínculo do novo colaborador com serviços favoritos(caso selecionado algum)
                            const totalChamadas = listaServicosSelecionados.length;
                            if(totalChamadas != 0){
                                FavoritarServicos(novoID, totalChamadas, listaServicosSelecionados, (sucesso)=>{
                                    if(sucesso){
                                        //Chama a caixa de dialogo
                                        setTextoBoxDialog("Colaborador criado com sucesso!");
                                        setBoxDialogSucesso(true); //Chama o box de mensagem pela mudança de estado
                                        // // console.log("inserir dialog informando sucesso da função CriarColaborador linha 86");
                                    }
                                    else{
                                        console.warn("O cadastro foi feito, mas houve algum problema com o vínculo de serviços! Favor contatar o suporte técnico.");
                                    }
                                });
                            }
                            else{
                                // console.log("[LOGS] - Sem serviços a serem favoritados.");
                            }
                            // setDialogTitulo('Sucesso');
                            // setDialogMensagem('Serviço criado!')
                            // setDialogTelaRetorno('Novo Serviço')
                            // setDialogTipoMensagem('S');
                            // setMsgAcaoVisivel(true);
                            // setBtnNovo(false);
                            //setAtualisaListaServico(true); ATUALIZAR LISTA DE SERVIÇO CUSTOMIZADO
                        } else {
                        // A inserção falhou
                        // console.log('Falha ao inserir');
                        // setDialogTitulo('Atenção');
                        // setDialogMensagem('Não foi possivel criar o serviço')
                        // setDialogTipoMensagem('E');
                        // setMsgAcaoVisivel(true)
                        }
                    });
                }
                else{//se caiu aqui é porque já existe cadastro com o nome informado
                    setNomeRepetido(true);
                    setHelperNome(true);
                    refNome.current.focus(); //Responsável por levar o foco ate o input nome
                }
            }) 
        }
    }

    //Edição de colaborador
    async function SalvarEdicao(){
        if(nome === '')
        {
            setHelperNome(true);
            refNome.current.focus(); //Responsavel por levar o focu ate o input nome
        }
        else
        {
            setHelperNome(false);
            UpdateColaboradorPorId(idColaborador, nome, funcao, async (sucesso) => {
                if (sucesso) {
                    // A inserção foi bem-sucedida
                    // console.log('[LOGS] - UpdateColaboradorPorId - Edição bem sucedida.');

                    let listaNovosServicosSelecionados = []; 
                    let listaServicosDesfavoritados = [];
                    let sucessoTotal = null;
                    listaNovosServicosSelecionados = comparator.difference(listaServicosSelecionados, listaServicosPreEdicao);
                    listaServicosDesfavoritados = comparator.difference(listaServicosPreEdicao, listaServicosSelecionados);

                    let totalChamadas = 0;
                    // console.log("[LOGS] - Início de validação das listas")
                    if(comparator.isEqual(listaServicosPreEdicao, listaServicosSelecionados)){
                        // console.log("[LOGS] - Lista não foi alterada!");
                        sucessoTotal = true;
                    }
                    if(listaNovosServicosSelecionados.length !== 0){
                        await new Promise((resolve) => {
                            totalChamadas = listaNovosServicosSelecionados.length;
                            FavoritarServicos(idColaborador, totalChamadas, listaNovosServicosSelecionados, async (sucesso)=>{
                                if(await sucesso){
                                    //Chama a caixa de dialogo
                                    sucessoTotal = true;
                                    // setTextoBoxDialog("Colaborador atualizado com sucesso!");
                                    // setBoxDialogSucesso(true); //Chama o box de mensagem pela mudança de estado
                                    // // console.log("inserir dialog informando sucesso da função CriarColaborador linha 86");
                                }
                                else{
                                    sucessoTotal = false;
                                    console.warn("A edição de dados deu certo, mas houve algum problema com o vínculo de serviços! Favor contatar o suporte técnico.");
                                }
                                resolve();
                            });
                        }) 
                    }
                    if(listaServicosDesfavoritados.length !==0){
                        await new Promise ((resolve) => {
                            totalChamadas = listaServicosDesfavoritados.length;
                            DesfavoritarServicos(idColaborador, totalChamadas, listaServicosDesfavoritados, async (sucesso)=> {
                                if(await sucesso){
                                    sucessoTotal = true;
                                }
                                else{
                                    sucessoTotal = false;
                                    console.warn("A edição de dados deu certo, mas houve algum problema com o desvínculo de serviços! Favor contatar o suporte técnico.");
                                }
                                resolve();
                            })
                        })
                    }
                    // console.log("Sucesso total: ", sucessoTotal);
                    if(sucessoTotal){
                        setTextoBoxDialog("Colaborador atualizado com sucesso!");
                        setBoxDialogSucesso(true); //Chama o box de mensagem pela mudança de estado
                    }
                    else {
                        // console.log("Deu tudo errado no Salvar Edição. Corram para as colinas");
                    }
                } else {
                // console.log('Falha ao atualizar');
                }
            });
        }
    }

    function FavoritarServicos(idColaborador, totalChamadas, listaServicos, callback){
        let chamadasBemSucedidas = 0;
        //Antes da chamada desta função, foi validado se o tamanho de listaServicoSelecionado é diferente de 0
        //A partir disso é possível iterar a lista.
        listaServicos.forEach((novoServico) => {
            const servico = listaServicosEstabelecimento.find((item)=>item.value === novoServico);
            // // console.log('servico:', servico);
            // // console.log("servico.label", servico.label);
            // // console.log("servico.value", servico.value);
            
        if(servico){
            // console.log("[LOGS] - Informações do serviço: ", {servico});
            // // console.log(servico);
            FavoritarServicoColaborador(idColaborador, servico.value, servico.label, (sucesso)=>{
                if(sucesso){
                    // console.log(chamadasBemSucedidas);
                    chamadasBemSucedidas++;
                    // console.log('[LOGS] - Serviço ', chamadasBemSucedidas + ' de ', listaServicos.length + " favoritado!")
                }
                else{
                    // console.log("[LOGS] - Erro em FavoritarServicoColaborador. Serviço que deu problema: " + {servico});
                    callback(false);
                }
                // console.log('Serviço', chamadasBemSucedidas + '. Total ', listaServicos.length)
                if(chamadasBemSucedidas === totalChamadas){
                    // console.log('[LOGS] - Sucesso JOB FavoritarServicos!');
                    callback(true);
                }
            })
        }
           
        });
    }

    function DesfavoritarServicos(idColaborador, totalChamadas, listaServicos, callback){
        let chamadasBemSucedidas = 0;

        //Antes da chamada desta função, foi validado se o tamanho de listaServicoSelecionado é diferente de 0
        //A partir disso é possível iterar a lista.
        listaServicos.forEach((novoServico) => {
            const servico = listaServicosEstabelecimento.find((item)=>item.value === novoServico);
            // // console.log('servico:', servico);
            // // console.log("servico.label", servico.label);
            // // console.log("servico.value", servico.value);
        if(servico){
            // console.log("[LOGS] - Informações do serviço a ser desfavoritado: ", {servico});
            // // console.log(servico);
            DesfavoritarServicoColaborador(idColaborador, servico.value, (sucesso)=>{
                if(sucesso){
                    // console.log(chamadasBemSucedidas);
                    chamadasBemSucedidas++;
                    // console.log('[LOGS] - Serviço ', chamadasBemSucedidas + ' de ', listaServicos.length + " desfavoritado!")
                }
                else{
                    // console.log("[LOGS] - Erro em DesfavoritarServicoColaborador. Serviço que deu problema: " + {servico});
                    callback(false);
                }
                // console.log('Serviço ', chamadasBemSucedidas + '. Total ', listaServicos.length)
                if(chamadasBemSucedidas === totalChamadas){
                    // console.log('[LOGS] - Sucesso JOB DesfavoritarServicos!');
                    callback(true);
                }
            })
        }
           
        });
    }

    //BOX DIALOG
    const [boxVisivel, setBoxVisivel] = useState(false);
    const [barraProgresso , setBarraProgresso] = useState(0)
    const [textoBoxDialog, setTextoBoxDialog] = useState("")
    const [boxDialogSucesso, setBoxDialogSucesso] = useState(null);

    function BoxDialog(){
        setBoxVisivel(true);
        let novoProgresso = 0;
       const intervalo =   setInterval(() =>{
            novoProgresso += 0.1;
            if(novoProgresso >=1) //Para finalizar o intervalo
            {
                clearInterval(intervalo);
                boxDialogSucesso ? navigation.navigate('Colaboradores') : '';
                setBoxVisivel(false);
                setBarraProgresso(0);
                // console.log('Box diálogo sucesso: ',boxDialogSucesso)
            }
            else
            {
                setBarraProgresso(novoProgresso);
            }

        }, 200);
    }

    useEffect(() =>{
        if(boxDialogSucesso !== null)
        {
            BoxDialog();
           
        }
    }, [boxDialogSucesso])

    return(
        <PaperProvider>
            <SafeAreaView style={styles.container}>
                {edicaoCadastro
                    ?
                        <View style={{flexDirection: "row", alignSelf: 'flex-end', alignItems: "center", paddingRight: 15}}>
                        <Text>{statusColaborador ? "Ativo" : "Inativo"}</Text>
                        <Switch  style={{}}  color= '#006699'  value={statusColaborador} onValueChange={AlteraStatusColaborador}></Switch>
                        </View>
                    :   
                        ''
                }
                <View style={styles.inputContainer}>
                    {/* NOME COLABORADOR */}
                    {helperNome  ?  <HelperText style={{color:'red', fontStyle:'italic'}}>{nomeRepetido ? 'Já existe colaborador com este nome' : 'Nome não pode ser vazio'}</HelperText>:''}
                    <TextInput
                        disabled={!statusColaborador}
                        ref={refNome}
                        label='Nome Colaborador'
                        value={nome} 
                        onChangeText={(entrada)=>{
                            entrada !== '' ? setDesabilitaBotao(false) : setDesabilitaBotao(true);
                            entrada !== '' ? setDesabilitaLista(false) : setDesabilitaLista(true);
                            setNome(entrada)
                        }} 
                        theme={{
                            colors: { primary: helperNome ? 'red' : corTema, onSurfaceVariant:  helperNome ? 'red' : corTema   }
                        }}
                        style={styles.inputFormulario}
                    />

                    {/* DESCRICAO COLABORADOR */}
                    {/* Não obrigatório */}
                    <TextInput
                        disabled={!statusColaborador}
                        label='Função'
                        value={funcao} 
                        onChangeText={setFuncao} 
                        theme={{
                            colors: { primary: corTema, onSurfaceVariant: corTema   }
                        }}
                        style={styles.inputFormulario}
                    />                
                    {/*BLOCO DE DEBUG */}
                    {/* {// console.log("Servicos do colaborador - listaServicosSelecionados", listaServicosSelecionados)}  */}
                    {/* Componente utilizado para trazer o serviços, tanto os favoritos quanto os não favoritos */}
                    {/* {// console.log(desabilitaLista)} */}
                    <DropDownPicker
                        disabled={desabilitaLista}
                        placeholder='Serviços Preferidos do Colaborador'
                        items={listaServicosEstabelecimento}
                        open={desabilitaLista ? !isOpen : isOpen}
                        setOpen={() => setIsOpen(!isOpen)}
                        // value={listaServicosPreferidos.map((servico)=>servico.value)}
                        value={listaServicosSelecionados}
                        setValue={(val) => { 
                            if (listaServicosEstabelecimento.length !== 0) {
                                setListaServicosSelecionados(val);
                            }
                        }
                        }
                        maxHeight={maxHeight}
                        autoScroll
                        dropDownDirection='BOTTOM'
                        //define que pode selecionar multiplos serviços.
                        multiple={true}
                        min={0}
                        max={{max}}
                        mode='BADGE'
                        
                    />

                    {/* --------------------------------------------------- */}

                    {/* BOTAO DE EDICAO/CADASTRO */}
                    {/* {// console.log('statusColaborador: ', statusColaborador)}
                    {// console.log('desabilitaBotao: ', desabilitaBotao)}
                    {// console.log('desabilitaLista: ', desabilitaLista)} */}
                    <View style={desabilitaBotao ? styles.buttonContainerDesabilitado : styles.buttonContainer}> 
                        <TouchableOpacity style={desabilitaBotao ? styles.btnDesabilitado :  styles.btn} onPress={edicaoCadastro ? SalvarEdicao : CriarColaborador} disabled={desabilitaBotao}> 
                            <View style={styles.btnContainer}>
                                {/* <FontAwesome5 name="plus" size={28} color="#fff" /> */}
                                <Text style={styles.btnText}>{edicaoCadastro ? 'SALVAR' : 'CRIAR COLABORADOR'}</Text> 
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Portal>
                        <Dialog visible={boxVisivel} style={{backgroundColor:'#fff'}}>
                            <Dialog.Content>
                            <Text style={[styles.txtDialog, {color: boxDialogSucesso ? "#006699" : 'red'}]} variant="bodyMedium">{textoBoxDialog}</Text>
                            <ProgressBar progress={barraProgresso} style={{height:10,  backgroundColor: 'rgba(112, 120, 147, 0.3)' }}  color='#006699' />
                            </Dialog.Content>
                        </Dialog>
                    </Portal>
                </View> 
            </SafeAreaView>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
      },
    inputContainer: {
        flex: 1,
        padding: 10,
        //paddingBottom: 80, // Ajuste o valor conforme necessário
    },
    inputFormulario: {
        marginLeft:15, 
        marginRight:15, 
        marginBottom:20, 
        backgroundColor: 'rgba(112, 120, 147, 0.3)',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#006699',
       // padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    buttonContainerDesabilitado: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#9e9e9e',
    // padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    btnContainer: {
        flexDirection: "row", // Alinha os filhos (ícone e texto) lado a lado
        alignItems: "center", // Alinha verticalmente ao centro
    },
    btnDesabilitado:
    {
        backgroundColor:'#9e9e9e',
        marginLeft:5,
        marginRight:10,
        padding:10,
        borderRadius:5
    },
    btn:
    {
        backgroundColor:'#006699',
        marginTop:5,
        marginLeft:10,
        marginRight:10,
        padding:10,
        borderRadius:5
    },
    btnText:
    {
        color:'#ffff',
        fontSize:20,
        alignSelf:'center',
        fontFamily:'Rubik_700Bold'
    },
    servicosPreferidos:
    {
        marginTop:20,
        marginLeft:20,
        marginRight:20,
        padding:20,
        backgroundColor:'#006699', 
        borderRadius:3
    }
});