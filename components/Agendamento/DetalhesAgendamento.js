import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {FAB, PaperProvider, List } from 'react-native-paper';
import { FontAwesome5, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import {  DarkTheme, useNavigation } from "@react-navigation/native";
import { useAppState } from "../Contexts/AppStateContext";
//SQL
import { ConsultaEstabelecimento } from "../SQLiteManager/SQLEstabelecimento";
import { ConsultaAgendamentoPorData, ConsultaAgendamentoGeral } from "../SQLiteManager/SQLAgendamento";
//PARA TRABALHAR COM DATAS
import { isBefore, isAfter, isEqual } from 'date-fns';
export default function Agendamento()
{

    //CONTEXT
    const { navegacaoEstabelecimento, setNavegacaoEstabelecimento, atualizaAgendamentos } = useAppState();

    //VERIFICA SE TEM CADASTRO DE ESTABELECIMENTO APRA DEFINIR QUAL PRIMEIRA TELA APARECERA
    ConsultaEstabelecimento((resultado) => {

    
        
          
    

        
        Expand All
    
    @@ -34,6 +34,34 @@ export default function Agendamento()
  
      if(resultado === null)
      {
        setNavegacaoEstabelecimento(true);
      }
      else
      {
        // console.log('logo ----> ', resultado.logo)
        setNavegacaoEstabelecimento(false);
      }
    })

    //
    const navigation = useNavigation();

    const [helperTextCampos, setHelperTextCampos] = useState(false);

    //EDIÇÃO E ATUALIZAÇÃO
    const [habilitaEdicao, setHabilitaEdicao] = useState(false);
    const [atualizaDados, setAtualizadados] = useState(false);
    //CONTEXT
    const {tema,  setAtualizaAgendamentos , atualizaAgendamentos, nomeEstabelecimento} = useAppState();

    //COR DO TEMA
    const [corTema, setCorTema] = useState('#006699');
    useEffect(() => {

        tema === 'light' ? setCorTema('#006699') : setCorTema(DarkTheme.colors.text);
    }, [tema])

    //DATA PICKER 
    const [dataAtual, setDataAtual] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [dataFormatada, setDataFormatada] = useState((date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()).toString());

    const [abriDataPicker, setAbrirDataPicker] = useState(false);
    
    const onChangeDataPicker = (event, dataSelecionada) => {
        setDate(dataSelecionada);
        setDataFormatada((date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()).toString())
        setAbrirDataPicker(false); // Fecha o DatePicker quando a data é selecionada
    }

    //HORARIO
    const [abriTimePicker, setAbrirTimePicker] = useState(false);
    const [horario, setHorario] = useState(new Date());
    const [horarioFormatado, setHorarioFormatado] = useState(null);

    const onChangeTimePicker = (event, horarioSelecionado) => {
        setHorario(horarioSelecionado);
        setHorarioFormatado((horarioSelecionado.getHours().toString() + ':' + horarioSelecionado.getMinutes().toString().padStart(2, '0')).toString())
        setAbrirTimePicker(false);
    }

    //NOME E TELEFONE
    const [nome, setNome] = useState(null);
    const [telefone, setTelefone] = useState(null);
    const [atendido, setAtendido] = useState(null);
    const [cancelado, setCancelado] = useState(null);
    const showDatePicker = () => {

        setAbrirDataPicker(true);
    }

    //DADOS DO AGENDAMENTO
    useEffect(() => {
        ConsultaAgendamentoPorId(idAgendamento, (agendamento) => {
            // console.log('agendamento ---> ', agendamento)
            //HORA
            const partesHorario = agendamento.horario.split(':');
            const hora = parseInt(partesHorario[0], 10);
            const minuto = parseInt(partesHorario[1], 10);
            //Setando o horario no objeto
            setHorarioFormatado(agendamento.horario);
            horario.setHours(hora);
            horario.setMinutes(minuto);

            //DATA
            const partesData = agendamento.data.split('/');
            const dia = parseInt(partesData[0], 10);
            const mes = parseInt(partesData[1] - 1, 10);
            const ano = parseInt(partesData[2], 10);
            //Setando a data no objeto
            setDataFormatada(agendamento.data);
            date.setDate(dia);
            date.setMonth(mes);
            date.setFullYear(ano);
            date.setHours(0, 0, 0, 0);
            //INFORMAÇOES DO CLIENTE        
            setNome(agendamento.nomeCliente);
            setTelefone(agendamento.telefone);
            setAtendido(agendamento.atendido);
            setCancelado(agendamento.cancelado);


        })
    }, [habilitaEdicao])

    //LISTA DE SERVIÇOS
    const [listaServicos, setListaServicos] = useState([]);
    const [servicoSelecionado, setServicoSelecionado] = useState([]);

    //LISTA COLABORADORES
    const [listaColaboradores, setListaColaboradores] = useState([]);
    const [colaboradorSelecionado, setColaboradorSelecionado] = useState([]);
    const [abrirListaColaborador, setAbrirListaColaborador] = useState(false);

    useEffect(() => {
        // RetornaServicosEstabelecimento(function(resultados) {
        //     // console.log('lista serv est ',resultados)
        //   const resultadosTratados = resultados.map((item, index) => ({
        //     label: item, // Identificador único crescente
        //     value: item,     // Nome do serviço
        //   }));

        //   setListaServicos(resultadosTratados)
        // });

        RetornaServicosEstabelecimento(function (resultados) {

            const resultadosTratados = resultados.map((item, index) => ({
                name: item,
                id: index,
            }));
            // console.log('servico estabe --> ', resultadosTratados)
            setListaServicos(resultadosTratados)
        });

        //Listar colaboradores
        listarColaboradores(function (retorno) {

            const resultadoColaboradores = retorno.map((item, index) => ({
                name: item.nomeColaborador,
                id: item.idColaborador,
            }));
            setListaColaboradores(resultadoColaboradores);
            // console.log('colaboradores', resultadoColaboradores);
        })

        //LISTA COLABORADORES JA SALVOS PARA ESSE ATENDIMENTO (FAZER CONSULTA AINDA)
    }, [habilitaEdicao])



    const [listaServicosSalvo, setListaServicoSalvo] = useState([]);
    useEffect(() => {
        ConsultaServicoAgendamentoPorId(idAgendamento, (servicos) => {

            const retorno = servicos.map((servico, index) => (servico.nomeServico));
            setListaServicoSalvo(retorno);
            // console.log('map servico salvo ', retorno)

        })
    }, [habilitaEdicao])

    const [colaboradorSalvo, setColaboradorSalvo] = useState([]);

    useEffect(() => {
        ConsultaColaboradoresPorAgendamento(idAgendamento, (colaboradores) => {
            const retorno = colaboradores.map((colaborador, index) => (colaborador.nomeColaborador));
            // console.log('RESULTADOS AC -->', retorno)
            setColaboradorSalvo(retorno);
        });
    }, [])

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);

    // const [atualizaDados, setAtualizaDados] = useState(false);
    function BotaoVoltarEdicao() {
        setHabilitaEdicao(false);

    }

    function AtivaAtendimento() {


        //Verifica se tem pelo menos um serviço selecionado

        if (listaServicosSalvo.length > 0) {

            //Altera de agendamento para atendimento
            AlteraAgendamentoParaAtendimento(idAgendamento, (sucesso) => {
                if (sucesso) {
                    // console.log('Agendamento atualizado com sucesso.');
                    setAtualizadados(!atualizaDados);

                    //Drop nos registro para nao subscrever (alterar essa forma posteriormente)
                    ExcluiColaboradorAtendimento(idAgendamento, (resultado) => {
                        if (resultado === true) {
                            // Faça algo em caso de sucesso.
                            // console.log('Excluido com sucesso!');
                            if (colaboradorSalvo.length > 0) {
                                colaboradorSalvo.forEach((colaboradorSelecionado) => {
                                    const nomeColaborador = listaColaboradores.find(colaborador => colaborador.name === colaboradorSelecionado);
                                    // console.log('---------------------->')
                                    //// console.log('foi ', colaboradorSelecionado, ' t = ',nomeColaborador.id +' t2 ', nomeColaborador.name);
                                    //LOGICA PARA SALVAR OS COLABORADORES
                                    SalvaColaboradorAtendimento(nomeColaborador.name, nomeColaborador.id, idAgendamento, (resultado) => {
                                        // console.log('inserido ----------------------->  ', resultado)
                                        if (resultado !== 0) {


                                            // navigation.navigate('Gestor Agenda'); 

                                        }
                                    });
                                })
                            }
<<<<<<< HEAD
                        });
                    })
                }
                
                 //Volta para lista de agendamentos
                 setAtualizaAgendamentos(!atualizaAgendamentos);
                 setBoxDialogSucesso((att) => true);
                 setTExtoBoxDialog("Cliente Atendido");
         
                  BoxDialog();
                } else if (resultado === false) {
               
                console.log('algo deu errado...')
=======

                            //Volta para lista de agendamentos
                            setAtualizaAgendamentos(!atualizaAgendamentos);
                            setBoxDialogSucesso((att) => true);
                            setTExtoBoxDialog("Cliente Atendido");

                            BoxDialog();
                        } else if (resultado === false) {
                            // Faça algo em caso de nenhum registro excluído.
                            // console.log('algo deu errado...')
                        } else {
                            // console.log('else ao tentar atender')
                        }
                    });
                    //SalvaColaboradorAtendimento();
>>>>>>> master
                } else {
                    // console.log('Erro ao atualizar o agendamento.');
                    // Lide com o erro de atualização, se necessário.
                }
            });
        }
        else {
            setBoxDialogSucesso((att) => false);
            setTExtoBoxDialog("Você tem que selecionar pelo menos um serviço");

            BoxDialog();
        }
    }

    const [msgConfirmacaoVisivel, setMsgConfirmacaoVisivel] = useState(false);
    const [dialogTitulo, setDialogTitulo] = useState('');
    const [dialogMensagem, setDialogMensagem] = useState('');
    const [dialogTipoMensagem, setDialogTipoMensagem] = useState('');
    const [dialogTelaRetorno, setDialogTelaRetorno] = useState('')

    const EscondeMsgConfirmacao = () => {
        setMsgConfirmacaoVisivel(false);
    };

    //CONFIRMAR CANCELAR ATENDIMENTO
    function ConfirmarCancelarAtendimento() {
        setMsgConfirmacaoVisivel(true);
        setDialogTitulo('Deseja cancelar?');
        setDialogTipoMensagem('E');
        setDialogTelaRetorno('Serviços');
    }

    //CANCELAR ATENDIMENTO
    function CancelarAtendimento() {
        CancelaAtendimento(idAgendamento, (sucesso) => {
            if (sucesso) {
                // console.log('atendimento cancelado com sucesso!');
                setAtualizaAgendamentos(!atualizaAgendamentos);
                setBoxDialogSucesso((att) => true);
                setTExtoBoxDialog("Atendimento cancelado!");

                BoxDialog();
            }
            else {
                // console.log('não foi possivel cancelar o atendimento!')
                setAtualizaAgendamentos(!atualizaAgendamentos);
                setBoxDialogSucesso((att) => false);
                setTExtoBoxDialog("Não foi possivel cancelar o atendimento!");

                BoxDialog();
            }
        })
    }
<<<<<<< HEAD
}

const [boxCompartilhar, setBoxCompartilhar] = useState(false);
//Responsavel pela mensagem após ação
const [boxMsgCopiar, setBoxMsgCopiar] = useState(false);
const [txtBoxMsgCopiar, setTxtBoxMsgCopiar] = useState(false);

//const textoParaCompartilhar = 'Olá, '+nome+' você tem um agendamento para o dia '+dataFormatada+' ás '+horarioFormatado+' para o seguinte serviço: '+listaServicosSalvo;
const textoParaCompartilhar = 'Olá, '+nome+', aqui é do(a) '+nomeEstabelecimento+'.Você tem agendamento: '+listaServicosSalvo+' para o dia '+dataFormatada+' às '+horarioFormatado+'.'
async function CopiarClipboard()
{
    await Clipboard.setStringAsync(textoParaCompartilhar);
         setBoxCompartilhar(false);
          setTxtBoxMsgCopiar("Copiado com sucesso!");
          setBoxMsgCopiar(true);
}



const compartilharNoWhatsApp = () => {
    const mensagem = encodeURIComponent(textoParaCompartilhar);
    const url = `whatsapp://send?text=${mensagem}`;
  
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          //Enviado para o whatsapp  
          return Linking.openURL(url);
        } else {
          console.log('WhatsApp não está instalado');
          setBoxCompartilhar(false);
          setTxtBoxMsgCopiar("Whatsapp não instalado!");
          setBoxMsgCopiar(true);
        }
      })
      .catch((error) => {
        console.error('Erro ao tentar abrir WhatsApp:', error);
      });
  };
  
    return(
=======

    //BOX DIALOG
    const [boxVisivel, setBoxVisivel] = useState(false);
    const [barraProgresso, setBarraProgresso] = useState(0)
    const [textoBoxDialog, setTExtoBoxDialog] = useState("")
    const [boxDialogSucesso, setBoxDialogSucesso] = useState(null);

    function BoxDialog() {

        setBoxVisivel(true);
        let novoProgresso = 0;
        const intervalo = setInterval(() => {
            novoProgresso += 0.1;
            if (novoProgresso >= 1) //Para finalizar o intervalo
            {
                clearInterval(intervalo);
                boxDialogSucesso ? navigation.navigate('Gestor Agenda') : '';
                setBoxVisivel(false);
                setBarraProgresso(0);
                // console.log('box dialogo sucesso, ', boxDialogSucesso)
                // if(boxDialogSucesso === true)
                // {
                //     // console.log('tedentro do if')
                //     navigation.navigate('Gestor Agenda');
                // }


            }
            else {
                setBarraProgresso(novoProgresso);
            }

        }, 200);



    }
    useEffect(() => {
        if (boxDialogSucesso !== null) {
            BoxDialog();

        }
    }, [boxDialogSucesso])



    //ATUALIZAR DADOS
    function AtualizarDados() {
        // console.log(listaServicosSalvo.length)
        //VALIDAR SE TODOS OS DADOS OBRIGATORIOS FORAM PREENCHIDOS
        if (nome === null || telefone === null || horarioFormatado === null || listaServicosSalvo.length === 0) {
            // console.log('nao pode salvar')
        }
        else {
            // console.log('pode salvar')
        }
    }
    return (
>>>>>>> master
        <PaperProvider >
            <SafeAreaView>
                <ScrollView style={{ backgroundColor: cancelado === 1 ? '#efb4b48f' : '' }}>
                    <View >


                        {helperTextCampos ? <HelperText style={styles.txtHelper}>Todos os campos são obrigatórios!</HelperText> : ''}


                        {habilitaEdicao === false && cancelado === 0 ? (
<<<<<<< HEAD
                            <View style={{ flexDirection: 'row',  }}>
                                <TouchableOpacity style={{alignSelf:'flex-start', flexDirection:'row', marginBottom:15, marginLeft:15, backgroundColor:'#006699', padding:4, borderRadius:5}} onPress={() => setHabilitaEdicao(true)}>
                                <FontAwesome name="edit" size={24} color="#fff" />
                                    <Text style={{marginEnd:20, fontFamily:'Rubik_700Bold',alignSelf:'center', color:'#fff'}}> Editar</Text>
=======
                            <View>
                                <TouchableOpacity style={{ alignSelf: 'flex-start', flexDirection: 'row', marginBottom: 15, marginLeft: 15, backgroundColor: '#006699', padding: 4, borderRadius: 5 }} onPress={() => setHabilitaEdicao(true)}>
                                    <FontAwesome name="edit" size={24} color="#fff" />
                                    <Text style={{ marginEnd: 20, fontFamily: 'Rubik_700Bold', alignSelf: 'center', color: '#fff' }}> Editar</Text>
>>>>>>> master
                                </TouchableOpacity>

                                <TouchableOpacity style={{alignSelf:'flex-start', flexDirection:'row', marginBottom:15, marginLeft:15, backgroundColor:'#006699', padding:4, borderRadius:5}} onPress={() =>  setBoxCompartilhar(true)}>
                                <FontAwesome name="edit" size={24} color="#fff" />
                                    <Text style={{marginEnd:20, fontFamily:'Rubik_700Bold',alignSelf:'center', color:'#fff'}}>Compartilhar</Text>
                                </TouchableOpacity>
                            </View>
                        ) : ''}


                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={[styles.btnDataTime, { borderColor: corTema }]} onPress={() => setAbrirDataPicker(true)} disabled={!habilitaEdicao}>
                                <FontAwesome name="calendar" size={24} color={corTema} />
                                <Text style={[styles.txtInput, { color: corTema }]}>{dataFormatada}</Text>
                            </TouchableOpacity>
                            {abriDataPicker ? (
                                <DateTimePicker value={date} mode='date' minimumDate={dataAtual} onChange={onChangeDataPicker} />
                            ) : null}

                            <TouchableOpacity style={[styles.btnDataTime, { borderColor: helperTextCampos === true && horarioFormatado === null ? 'red' : corTema }]} onPress={() => setAbrirTimePicker(true)} disabled={!habilitaEdicao}>
                                <FontAwesome5 name="clock" size={24} color={helperTextCampos === true && horarioFormatado === null ? 'red' : corTema} />
                                <Text style={[styles.txtInput, { color: helperTextCampos === true && horarioFormatado === null ? 'red' : corTema }]}>{horarioFormatado === null ? 'Horário' : horarioFormatado}</Text>
                            </TouchableOpacity>
                            {abriTimePicker ? (
                                <DateTimePicker value={horario} mode='time' onChange={onChangeTimePicker} />
                            ) : null}

                        </View>

                        <TextInput
                            editable={habilitaEdicao}
                            style={[styles.inputFormulario,]}
                            label="Nome"
                            onChangeText={(text) => setNome(text)}
                            value={nome}
                            theme={{
                                colors: { primary: nome === null && helperTextCampos === true ? 'red' : corTema, onSurfaceVariant: nome === null && helperTextCampos === true ? 'red' : corTema },
                            }}
                        >

                        </TextInput >

                        <TextInput
                            editable={habilitaEdicao}
                            style={styles.inputFormulario}
                            label="Telefone"
                            keyboardType="numeric"
                            onChangeText={(text) => setTelefone(text)}
                            value={telefone}
                            theme={{
                                colors: { primary: telefone === null && helperTextCampos === true ? 'red' : corTema, onSurfaceVariant: telefone === null && helperTextCampos === true ? 'red' : corTema },
                            }}
                        >
                        </TextInput>


                    </View>
                    {/* <View style={{marginLeft:20, marginRight:20}}>
                        <Text>Serviços do atendimento</Text>
                        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                            {  listaServicosSalvo.map((servicos, index) =>(

                                <Chip key={index} icon={'check'} style={{margin:4,backgroundColor:'#006699' }}  >{servicos}</Chip>
                            
                            ))}   
                        </View>   
                                          
                    </View> */}


                    <View style={{ marginRight: 20, marginLeft: 20, marginTop: 10 }}>
                        <SectionedMultiSelect
                            disabled={!habilitaEdicao}
                            items={listaServicos}
                            IconRenderer={MaterialIcons}
                            selectedText='selecionados'
                            confirmText="Confirmar"
                            colors={{ text: 'red' }}
                            styles={{
                                selectToggle: { borderWidth: 1, borderRadius: 5, padding: 5 },
                            }}
                            uniqueKey="name"
                            selectText="Serviços selecionados"
                            showDropDowns={true}
                            onSelectedItemsChange={setListaServicoSalvo}
                            selectedItems={listaServicosSalvo}
                            hideChipRemove={!habilitaEdicao}



                        />
                    </View>

                    <View style={{ marginRight: 20, marginLeft: 20 }}>
                        <SectionedMultiSelect

                            items={listaColaboradores}
                            IconRenderer={MaterialIcons}
                            selectedText='selecionados'
                            confirmText="Confirmar"
                            colors={{ text: 'red' }}
                            styles={{
                                selectToggle: { borderWidth: 1, borderRadius: 5, padding: 5 },
                            }}
                            uniqueKey="name"

                            selectText="Escolha o colaborador"
                            showDropDowns={true}
                            onSelectedItemsChange={setColaboradorSalvo}
                            selectedItems={colaboradorSalvo}
                            hideChipRemove={!habilitaEdicao}
                        />
                    </View>

                    {cancelado === 0 ? (
                        <View style={{ borderTopWidth: 0.7, borderColor: '#006699', marginBottom: 10, paddingTop: 10, marginTop: 10, paddingBottom: 8, width: '100%' }}>
                            {habilitaEdicao ? (
                                <><TouchableOpacity style={[styles.btnAcaoDetalhes, { marginBottom: 20 }]} onPress={AtualizarDados}>
                                    <View style={[styles.btnContainer,]}>
                                        <Text style={styles.btnAcaoText}>ATUALIZAR</Text>
                                    </View>
                                </TouchableOpacity>
                                    <TouchableOpacity style={[styles.btnAcaoDetalhes, { backgroundColor: 'red' }]} onPress={BotaoVoltarEdicao}>
                                        <View style={styles.btnContainer}>
                                            <Text style={styles.btnAcaoText}>VOLTAR</Text>
                                        </View>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    {atendido !== 1 ? (
                                        <>
                                            <TouchableOpacity style={[styles.btnAcaoDetalhes, { padding: 10 }]} onPress={AtivaAtendimento}>
                                                <View style={[styles.btnContainer,]}>
                                                    <Text style={styles.btnAcaoText}>ATENDER</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={[styles.btnAcaoDetalhes, { backgroundColor: 'red', marginTop: 20, padding: 10 }]} onPress={ConfirmarCancelarAtendimento}>
                                                <View style={styles.btnContainer}>
                                                    <Text style={styles.btnAcaoText}>CANCELAR ATENDIMENTO</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <TouchableOpacity style={[styles.btnAcaoDetalhes, { backgroundColor: 'red', marginTop: 20, padding: 10 }]} onPress={ConfirmarCancelarAtendimento}>
                                            <View style={styles.btnContainer}>
                                                <Text style={styles.btnAcaoText}>CANCELAR ATENDIMENTO</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </>
                            )
                            }
<<<<<<< HEAD
                    </View>
                    ) : ''}   
                      <Portal>
                        <Dialog visible={boxVisivel} style={{backgroundColor:'#fff'}}>
                            <Dialog.Content>
                            <Text style={[styles.txtDialog, {color: boxDialogSucesso ? "#006699" : 'red'}]} variant="bodyMedium">{textoBoxDialog}</Text>
                            <ProgressBar progress={barraProgresso} style={{height:10,  backgroundColor: 'rgba(112, 120, 147, 0.3)' }}  color='#006699' />
                            </Dialog.Content>
                        </Dialog>

                        <Dialog visible={boxCompartilhar} style={{backgroundColor:'#fff'}}>
                            <Dialog.Title style={{color:'#006699'}}>Compartilhar <FontAwesome5 name="share-alt" size={24} color="#006699" /></Dialog.Title>
                            <View style={{borderBottomWidth:0.31, width:'90%', alignSelf:'center', marginBottom:20}}></View>
                            <Dialog.Content>
                                <View style={{alignItems:'center'}}>
                                <TouchableOpacity onPress={compartilharNoWhatsApp} style={styles.btnCompartilhar}>
                                    <FontAwesome5 name="whatsapp-square" size={50} color="green" />
                                    <Text style={styles.txtBtnCompartilhar}>WhatsApp</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={CopiarClipboard} style={styles.btnCompartilhar}>
                                <FontAwesome5 name="copy" size={50} color="gray" />
                                        <Text style={styles.txtBtnCompartilhar}>Copiar</Text>
                                     
                                </TouchableOpacity>
                            </View>
                            
                            </Dialog.Content>
                            <View style={{borderBottomWidth:0.51, width:'90%', alignSelf:'center'}}></View>
                            <Dialog.Actions >
                                <Button  textColor="#006699"  onPress={() => setBoxCompartilhar(false)}>Fechar</Button>
                            </Dialog.Actions>
                        </Dialog>

                        <Dialog visible={boxMsgCopiar} style={{backgroundColor:'#fff'}}>
                            <Dialog.Content>
                            <Text style={[styles.txtDialog, {color: "#006699", fontSize:22 }]} variant="bodyMedium">{txtBoxMsgCopiar}</Text>
                            
                            </Dialog.Content>
                            <Dialog.Actions >
                                <Button  textColor="#006699"  onPress={() => setBoxMsgCopiar(false)}>Fechar</Button>
                            </Dialog.Actions>
                        </Dialog>
=======
                        </View>
                    ) : ''}

                    <Portal>
                        <Dialog visible={boxVisivel} style={{ backgroundColor: '#fff' }}>
                            <Dialog.Content>
                                <Text style={[styles.txtDialog, { color: boxDialogSucesso ? "#006699" : 'red' }]} variant="bodyMedium">{textoBoxDialog}</Text>
                                <ProgressBar progress={barraProgresso} style={{ height: 10, backgroundColor: 'rgba(112, 120, 147, 0.3)' }} color='#006699' />
                            </Dialog.Content>
                        </Dialog>
>>>>>>> master
                    </Portal>

                    {/* Confirmar exclusão: */}
                    <Portal>
                        <Dialog visible={msgConfirmacaoVisivel} dismissable={false} style={tema === 'light' ? styles.dialogLight : styles.dialogDark}>
                            <Dialog.Title style={[styles.dialogTitulo, { color: corTema }]}>{dialogTitulo}</Dialog.Title>
                            <Dialog.Content>
                                <Text variant="bodyMedium" style={[styles.dialogContent, { color: tema === 'light' ? 'black' : "#fff" }]}>{dialogMensagem}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button labelStyle={{ fontFamily: 'Rubik_700Bold', color: tema === 'light' ? '#006699' : '#fff' }} onPress={() => CancelarAtendimento()}>Confirmar</Button>
                                <Button labelStyle={{ fontFamily: 'Rubik_700Bold', color: tema === 'light' ? '#006699' : '#fff' }} onPress={() => EscondeMsgConfirmacao()}>Cancelar</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>

                </ScrollView>
            </SafeAreaView>
        </PaperProvider>
    );
}
