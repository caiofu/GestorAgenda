import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HelperText, TextInput, ProgressBar,  Dialog, Portal, PaperProvider, Button } from "react-native-paper";
import { FontAwesome, FontAwesome5 , MaterialIcons} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {  MultipleSelectList } from "react-native-dropdown-select-list";

import {  DarkTheme, useNavigation } from "@react-navigation/native";

import styles from "./StyleAgendamento";
import { useEffect, useState } from "react";

//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";

//SQLITE
import { RetornaServicosEstabelecimento } from "../SQLiteManager/SQLServicos";
import { CriaNovoAgendamento, ConsultaAgendamentoPorHorarioData, SalvarServicoAgendamento } from "../SQLiteManager/SQLAgendamento";

//PARA TRABALHAR COM DATAS
import { isBefore, isAfter, isEqual } from 'date-fns';

export default function NovoAgendamento()
{
     //NAVIGATION
     const navigation = useNavigation();

    //CONTEXT
    const {tema,  setAtualizaAgendamentos } = useAppState();

    //COR DO TEMA
     const [corTema, setCorTema] = useState('#006699');
     useEffect(()=>{

            tema === 'light' ? setCorTema('#006699') : setCorTema(DarkTheme.colors.text);
              },[tema])

    //DATA
    const [dataAtual, setDataAtual] = useState(new Date());
    // const [horaAtual, setHoraAtual] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [dataFormatada, setDataFormatada] = useState((date.getDate()+'/'+date.getMonth()+1+'/'+date.getFullYear()).toString());
    const [abriDataPicker, setAbrirDataPicker] = useState(false);

    const onChangeDataPicker = (event, dataSelecionada) => {
        setDate(dataSelecionada);
        setDataFormatada((date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()).toString())
        setAbrirDataPicker(false); // Fecha o DatePicker quando a data é selecionada
    }


    //HORARIO
    const [abriTimePicker, setAbrirTimePicker] = useState(false);
    const [horario, setHorario] = useState(new Date());
    const [horarioFormatado, setHorarioFormatado] = useState(null);
    
    const onChangeTimePicker = (event, horarioSelecionado) => {
        setHorario(horarioSelecionado);
        setHorarioFormatado((horarioSelecionado.getHours().toString()+':'+horarioSelecionado.getMinutes().toString().padStart(2,'0')).toString())
        setAbrirTimePicker(false);
    }



    //NOME E TELEFONE
    const [nome, setNome]           = useState(null);
    const [telefone, setTelefone]   = useState(null);

    //LISTA DE SERVIÇOS
    const [listaServicos, setListaServicos]             = useState([]);
    const [servicoSelecionado, setServicoSelecionado]   = useState([]);

    useEffect(() =>{
          RetornaServicosEstabelecimento(function(resultados) {
            const resultadosTratados = resultados.map((item, index) => ({
              key: index + 1, // Identificador único crescente
              value: item,     // Nome do serviço
            }));

            setListaServicos(resultadosTratados)
          });
    }, [])

    //LIMPAR CAMPOS
    const [limparLista, setLimparLista] = useState(0);
    function LimparCampos()
    {
        setDate(new Date());
        setHorario(new Date());
        setHorarioFormatado('Horário')
        setNome("");
        setTelefone("");
        setServicoSelecionado('');
        setLimparLista(limparLista+1)//Desmontando e montando novamente a lista.
    }

    //Usando o useEffect para garantir a limpeza do campo ao mudar o date.
    useEffect(() =>{

        setDataFormatada((date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()).toString())
    },[date])




    const [helperTextCampos, setHelperTextCampos] = useState(false);

   function AgendarServico()
   {

    //VALIDAR SE TODOS OS DADOS OBRIGATORIOS FORAM PREENCHIDOS
    if(nome === null || telefone === null ||  horarioFormatado === null || servicoSelecionado.length === 0)
    {
        setHelperTextCampos(true);
    }
    else
    {
        //Verifica se esta na data de hj e se o horario é maior que o horario atual (pelo menos uma hora a mais para nao dar erro)
        let dataHora = new Date();
        let dataAtual =  new Date();
        dataAtual.setHours(0,0,0,0)
    
        const dataSelecionadaFormatada = date;
        dataSelecionadaFormatada.setHours(0,0,0,0)

         const dataIgual = isEqual(dataAtual, date)
        
        console.log('Hora selecionada : ', horario.getHours()+' menor ', dataHora.getHours())
        console.log('horario ? ', horario  +' Formatado '+horarioFormatado);
        if(dataIgual &&  horario.getHours() <=  dataHora.getHours())
        {
          
            setBoxDialogSucesso((att) => false);
              setTExtoBoxDialog("O horario não pode ser menor que o horario atual nesta data!");

               BoxDialog();
        }
        else
        {
            setHelperTextCampos(false);
            //VERIFICANDO SE EXISTE AGENDAMENTO NESSE HORARIO E DATA
        
            ConsultaAgendamentoPorHorarioData(horarioFormatado, dataFormatada,  (agendamento) => {
                if (agendamento) {
                // A consulta foi bem-sucedida, você pode acessar os dados do agendamento aqui
                console.log('Agendamento encontrado:', agendamento);
                setBoxDialogSucesso((att) => false);
                setTExtoBoxDialog("Já existe um agendamento para essa data e horario!");

                BoxDialog();

                } else {
                // Não foi encontrado nenhum agendamento com o horário especificado
                console.log('Nenhum agendamento encontrado para o horário:', );
                //CRIA AGENDAMENTO
                CriaNovoAgendamento(dataFormatada, horarioFormatado, nome, telefone, (idAgendamento) => {
                    console.log('novoid ',idAgendamento)
                    if (idAgendamento !== null) {
                    console.log(`Novo ID do agendamento inserido: ${idAgendamento}`);
                    //INSERE SERVIÇOS COM ID DO AGENDAMENTO

                    //Loop para caso conter mais de um serviço selecionado
                    let insercaoBemSucedida = 0;
                    let totalInsercoes = servicoSelecionado.length;

                    servicoSelecionado.forEach((servicoSelecionado) => {
                        console.log('serviço selecionado para salvar  -->', servicoSelecionado)
                        //Precisa pega o id do serviço ou nome do serviço ? ?
                        SalvarServicoAgendamento(idAgendamento, servicoSelecionado, (idServicoAgendamento) => {
                            console.log('idAgendamentoSer ', idServicoAgendamento)
                            if(idServicoAgendamento !== null )
                            {
                                console.log('caiu aquiiiii')
                                insercaoBemSucedida = insercaoBemSucedida +1;
                                console.log(insercaoBemSucedida)
                                //Verifica se inseriu todas

                                    if(insercaoBemSucedida === totalInsercoes)
                                    {
                                        console.log('sucedidade ', insercaoBemSucedida+' total ', totalInsercoes)
                                        //Chama a caixa de dialogo
                                        setAtualizaAgendamentos(true);
                                        setTExtoBoxDialog("Agendamento criado com sucesso!");
                                        setBoxDialogSucesso(true); //Chama o box de mensagem pela mudança de estado
                                    
                                        console.log('todos as '+totalInsercoes+ 'forma inseridas com sucesso');
                                    }
                            }
                        } );


                    });
                //  SalvarServicoAgendamento(idAgendamento,)

                    } else {
                        console.log('Falha ao inserir o agendamento');
                    }
                });
                }
            });


        }
    }

    //   });
   }


    //BOX DIALOG
    const [boxVisivel, setBoxVisivel] = useState(false);
    const [barraProgresso , setBarraProgresso] = useState(0)
    const [textoBoxDialog, setTExtoBoxDialog] = useState("")
    const [boxDialogSucesso, setBoxDialogSucesso] = useState(null);

    function BoxDialog()
    {

        setBoxVisivel(true);
        let novoProgresso = 0;
       const intervalo =   setInterval(() =>{
            novoProgresso += 0.1;
            if(novoProgresso >=1) //Para finalizar o intervalo
            {
                clearInterval(intervalo);
                boxDialogSucesso ? navigation.navigate('Gestor Agenda') : '';
                setBoxVisivel(false);
                setBarraProgresso(0);
                console.log('box dialogo sucesso, ',boxDialogSucesso)
                // if(boxDialogSucesso === true)
                // {
                //     console.log('tedentro do if')
                //     navigation.navigate('Gestor Agenda');
                // }


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
          <SafeAreaView >
            <ScrollView>
                <View style={styles.container}>
                   {helperTextCampos ? <HelperText style={styles.txtHelper}>Todos os campos são obrigatórios!</HelperText> : ''}
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={[styles.btnDataTime, {borderColor:corTema}]} onPress={() => setAbrirDataPicker(true)} >
                        <FontAwesome name="calendar" size={24} color={corTema} />
                            <Text style={[styles.txtInput, {color:corTema}]}>{dataFormatada}</Text>
                        </TouchableOpacity>
                        {abriDataPicker ? (
                                <DateTimePicker value={date} mode='date' minimumDate={dataAtual} onChange={onChangeDataPicker} />
                            ) : null}

                        <TouchableOpacity style={[styles.btnDataTime, {borderColor: helperTextCampos === true && horarioFormatado === null ? 'red' :corTema}]} onPress={() => setAbrirTimePicker(true)}>
                        <FontAwesome5 name="clock" size={24} color={helperTextCampos === true && horarioFormatado === null ? 'red' :corTema} />
                            <Text style={[styles.txtInput, {color: helperTextCampos === true && horarioFormatado === null ? 'red' :corTema}]}>{horarioFormatado === null ? 'Horário' : horarioFormatado}</Text>
                        </TouchableOpacity>
                        {abriTimePicker ? (
                                <DateTimePicker value={horario} mode='time' onChange={onChangeTimePicker} />
                            ) : null}

                    </View>

                    <TextInput
                        style={styles.inputFormulario}
                        label="Nome"
                        onChangeText={(text) => setNome(text)}
                        value={nome}
                        theme={{
                            colors: { primary: nome === null && helperTextCampos === true ? 'red' : corTema, onSurfaceVariant: nome === null && helperTextCampos === true ? 'red' : corTema  },
                          }}
                        >

                    </TextInput >

                    <TextInput
                        style={styles.inputFormulario}
                        label="Telefone"
                        keyboardType="numeric"
                        onChangeText={(text) => setTelefone(text)}
                        value={telefone}
                        theme={{
                            colors: { primary: telefone === null && helperTextCampos === true ? 'red' : corTema, onSurfaceVariant: telefone === null && helperTextCampos === true ? 'red' : corTema  },
                          }}
                        >


                    </TextInput>

                    <View>
                        <MultipleSelectList
                            placeholder= "Escolha o serviço"
                            searchPlaceholder=""
                            fontFamily="Rubik_400Regular"
                            boxStyles={styles.inputFormularioSelect}
                            dropdownStyles={{ alignSelf: 'center', width: '89%', marginBottom:20 }}
                            dropdownTextStyles={{ color: corTema }}
                            arrowicon={<FontAwesome5 name="chevron-down" size={17} color={corTema} />}
                            searchicon={<FontAwesome5 name="search" size={17} color={corTema} />}
                            closeicon={<FontAwesome name="close" size={24} color={corTema} />}
                            inputStyles={{ color: helperTextCampos === true && servicoSelecionado.length === 0 ? 'red' : corTema }}
                            notFoundText=""
                            key={limparLista}
                            data={listaServicos}

                            save="value"
                            // Para evitar erros quando usuario clica na lista vazia

                            setSelected={(val) => {
                                if (servicoSelecionado !== '')
                                {
                                    console.log('valllll ????',val)
                                     setServicoSelecionado(val);
                                }
                            }}
                        />
                    </View>
                    <View>
                        <TouchableOpacity style={{alignSelf:'flex-end', flexDirection:'row', marginTop:5, marginBottom:5, marginRight:25, backgroundColor:'#006699', padding:4, borderRadius:5}} onPress={LimparCampos}>
                        <MaterialIcons name="cleaning-services" size={24} color="#fff" />
                            <Text style={{marginEnd:20, fontFamily:'Rubik_700Bold',alignSelf:'center', color:'#fff'}}> Limpar campos</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{borderBottomWidth:0.7, width:'90%', borderColor:'#006699', alignSelf:'center', margin:10}} />
                    <View>
                    <TouchableOpacity style={styles.btn}  onPress={AgendarServico}>
                                            <View style={[styles.btnContainer, {alignSelf:'center'}]}>
                                                <Text style={styles.btnText}>AGENDAR</Text>
                                            </View>
                  </TouchableOpacity>


                  <Portal>
                    <Dialog visible={boxVisivel} style={{backgroundColor:'#fff'}}>
                        <Dialog.Content>
                        <Text style={[styles.txtDialog, {color: boxDialogSucesso ? "#006699" : 'red'}]} variant="bodyMedium">{textoBoxDialog}</Text>
                        <ProgressBar progress={barraProgresso} style={{height:10,  backgroundColor: 'rgba(112, 120, 147, 0.3)' }}  color='#006699' />
                        </Dialog.Content>
                    </Dialog>
                    </Portal>
                    </View>
                </View>
            </ScrollView>
          </SafeAreaView>
          </PaperProvider>

    );
}