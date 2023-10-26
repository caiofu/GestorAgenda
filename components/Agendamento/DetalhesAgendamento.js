import { ScrollView, View, TouchableOpacity, Text } from "react-native";
import { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from "./StyleAgendamento";
import DropDownPicker from 'react-native-dropdown-picker'; 
import {  DarkTheme, useNavigation } from "@react-navigation/native";

//SQLITE
import { ConsultaAgendamentoPorId, ConsultaServicoAgendamentoPorId } from "../SQLiteManager/SQLAgendamento";
import { RetornaServicosEstabelecimento } from "../SQLiteManager/SQLServicos";
import { PaperProvider, TextInput, Chip } from "react-native-paper";
import { FontAwesome5, Ionicons, FontAwesome } from '@expo/vector-icons';

//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetalhesAgendamento(props)
{
    // Acesse o valor do idServico por meio de props.route.params
    const idAgendamento = props.route.params.id;

    const [helperTextCampos, setHelperTextCampos] = useState(false);

       //CONTEXT
       const {tema,  setAtualizaAgendamentos } = useAppState();

       //COR DO TEMA
        const [corTema, setCorTema] = useState('#006699');
        useEffect(()=>{
   
               tema === 'light' ? setCorTema('#006699') : setCorTema(DarkTheme.colors.text);
                 },[tema])

    //DATA PICKER 
    const [dataAtual, setDataAtual] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [dataFormatada, setDataFormatada] = useState((date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()).toString());

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
    const showDatePicker = () => {
   
        setAbrirDataPicker(true);
    }
   
    useEffect(() =>{
        ConsultaAgendamentoPorId(idAgendamento, (agendamento) => {
            console.log('agendamento ---> ', agendamento)
        } )
    },[])

      //LISTA DE SERVIÇOS
      const [listaServicos, setListaServicos]             = useState([]);
      const [servicoSelecionado, setServicoSelecionado]   = useState([]);
  
      useEffect(() =>{
            RetornaServicosEstabelecimento(function(resultados) {
                console.log('lista serv est ',resultados)
              const resultadosTratados = resultados.map((item, index) => ({
                label: item, // Identificador único crescente
                value: item,     // Nome do serviço
              }));
  
              setListaServicos(resultadosTratados)
            });
      }, [])

    const [listaServicosSalvo, setListaServicoSalvo] = useState([]);
    useEffect(() => {
        ConsultaServicoAgendamentoPorId(idAgendamento, (servicos) =>{
          
            const retorno = servicos.map((servico) => (servico.nomeServico
   
           ));
            setListaServicoSalvo(retorno);
            console.log('map servico ', retorno)
      
        })
    }, [])

    const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Item 1', value: 'item1' },
    { label: 'Item 2', value: 'item2' },
    { label: 'Item 3', value: 'item3' },
  ]);

    return(
        <PaperProvider>
            <SafeAreaView>
                <ScrollView>
                    <View >
                        <View style={{ borderBottomWidth: 0.7, borderColor: '#006699', marginBottom: 20, flexDirection: 'row', paddingBottom: 22, backgroundColor:'#fff', width: '100%' }}>
                            <TouchableOpacity style={[styles.btnAcaoDetalhes, { flex: 1 }]}>
                                <View style={[styles.btnContainer, { alignContent: 'flex-end' }]}>
                                <Text style={styles.btnAcaoText}>ATENDER</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.btnAcaoDetalhes, { flex: 1, backgroundColor:'red' }]}>
                                <View style={styles.btnContainer}>
                                <Text style={styles.btnAcaoText}>CANCELAR</Text>
                                </View>
                            </TouchableOpacity>
                            </View>

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
                    
                  
                   
                    </View>
                </ScrollView>
                <Text>Serviços do atendimento</Text>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                { listaServicosSalvo.map((servicos) =>(
                     <Chip icon={'check'} style={{margin:4,backgroundColor:'#006699'}} >{servicos}</Chip>
                 
                ))}
                
                </View>
                { <DropDownPicker
                        language="PT"
                        open={open}
                        value={listaServicosSalvo}
                        items={listaServicos}
                        placeholder="Serviços selecionados"
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        autoScroll
                        multiple={true}
                        dropDownDirection='BOTTOM'
              
                        
                      
                     
                    />
                         }
            </SafeAreaView>
        </PaperProvider>
    );
}