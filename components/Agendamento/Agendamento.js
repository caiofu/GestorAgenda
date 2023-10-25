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



export default function Agendamento()
{

    //CONTEXT
    const { navegacaoEstabelecimento, setNavegacaoEstabelecimento, atualizaAgendamentos } = useAppState();

    //VERIFICA SE TEM CADASTRO DE ESTABELECIMENTO APRA DEFINIR QUAL PRIMEIRA TELA APARECERA
    ConsultaEstabelecimento((resultado) => {
      if(resultado === null)
      {
        setNavegacaoEstabelecimento(true);
      }
      else
      {
        setNavegacaoEstabelecimento(false);
      }
    })

    //
    const navigation = useNavigation();
    
    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
    const [date, setDate] = useState(new Date());
    const [dataFormatada, setDataFormatada] = useState((date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()).toString());

    const [abriDataPicker, setAbrirDataPicker] = useState(false);


    
    const onChangeDataPicker = (event, dataSelecionada) => {
        setDate(dataSelecionada);
        setDataFormatada((date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()).toString())
        setAbrirDataPicker(false); // Fecha o DatePicker quando a data é selecionada
    }

    const showDatePicker = () => {
   
        setAbrirDataPicker(true);
    }

    const CriarNovoAgendamento = () => {
        // Ação a ser executada quando o botão flutuante for pressionado
      
        navigation.navigate('Novo Agendamento'); 
      };

      //BUSCA AGENDAMENTOS
      const [listaAgendamentos, setListaAgendamentos] = useState([]);
      useEffect(() =>{
        console.log('açaoooooooooooooooooooooo !!!')
            ConsultaAgendamentoPorData(dataFormatada, (agendamentos) =>{
                //console.log('aged ==' ,agendamentos)
                 const retorno = agendamentos.map((listaAgendamentos) => ({
                    idAgendamento: listaAgendamentos.idAgendamento.toString(),
                    nomeCliente: listaAgendamentos.nomeCliente,
                    telefone: listaAgendamentos.telefone,
                    data: listaAgendamentos.data,
                    horario: listaAgendamentos.horario,
                    atendido: listaAgendamentos.atendido,
                    cancelado: listaAgendamentos.cancelado
                        
                 }));
                setListaAgendamentos(retorno); 
            });
      },[atualizaAgendamentos, dataFormatada, date]);
     
  
    //   ConsultaAgendamentoGeral((geral) => {
    //     console.log('GERAL ---> ', geral)
    //   })
      ConsultaAgendamentoPorData(dataFormatada, (agendamentos) =>{
        console.log('Por data ====> ',agendamentos)
      })

      function CarregaDetalhesAgendamento(idAgendamento)
      {
        navigation.navigate('Detalhes Agendamento', { id: idAgendamento }); 
      }
         //VERIFICANDO STATUS  E ATRASOS
        // const [verificaAgendamento, setVerificaAgendamento] = useState(false);
        // setInterval(() =>{
        //   setVerificaAgendamento(!verificaAgendamento);
        // },60000);
    return (
        <PaperProvider>
            <View style={{flex: 1, padding: 10, flexDirection: 'column'}}>
                <TouchableOpacity style={{borderWidth: 1, flexDirection: 'row', padding: 4, backgroundColor:'#fff', borderColor:'#006699', borderRadius:4}} onPress={showDatePicker}>
                    <FontAwesome name="calendar" size={24} color='#006699' />
                    <Text style={{alignSelf:'center', marginLeft:5, color: '#006699', fontFamily:'Rubik_700Bold'}}>{dataFormatada}</Text>
                </TouchableOpacity>
                {abriDataPicker ? (
                    <DateTimePicker value={date} mode='date' onChange={onChangeDataPicker} />
                ) : null}
            <View style={{borderWidth:1, flex:1,marginBottom:70, marginTop:2, borderRadius:4, borderColor:'#006699'}}>
                <ScrollView>

                    {/* LISTA*/}
                    { listaAgendamentos.map((agendamento) => (
                                        <TouchableOpacity 
                                             key={agendamento.idAgendamento}
                                             onPress={() => CarregaDetalhesAgendamento(agendamento.idAgendamento)} 
                                            style={{borderWidth:0.7, margin:4, borderRadius:10}}
                                        >
                                            {/* <Text  key={servico.idServico}>{servico.nomeServico} </Text> */}
                                            <List.Item key={agendamento.idAgendamento}
                                                        title={agendamento.nomeCliente}
                                                        description="Aguardando atendimento"
                                                        titleStyle={{color:'black', fontSize:12}}
                                                        descriptionStyle={{color:'gray', fontSize:10}}
                                                        descriptionNumberOfLines={1}
                                                        right={props =>  <><FontAwesome5 name="clock" size={18} color='#006699' /><Text style={{marginLeft:5, fontFamily:'Rubik_700Bold', color:'#006699'}}>{agendamento.horario}</Text></>} />
                                            </TouchableOpacity>

                                        
                                    ))}
                    {/* <TouchableOpacity style={{borderWidth:0.7, margin:4, borderRadius:10}}>
                        <List.Item
                        title="Barba"
                        description="Caio Furegati"
                       
                        titleStyle={{color:'black', fontSize:12}}
                        descriptionStyle={{color:'gray', fontSize:10}}
                        right={props => <Text>Horário: 8:50</Text>}

                    />
                    </TouchableOpacity> */}

                    
               
                </ScrollView>
            </View>
           
            
           
           <FAB icon="plus" aria-label="Rubik_400Regular"  color="#fff"  label="Novo agendamento"  style={{ position: 'absolute', 
                margin: 16, 
                right: 0, 
                bottom: 0, 
                backgroundColor:'#006699',
                fontFamily: 'Rubik_700Bold',}} onPress={CriarNovoAgendamento} />
        </View>
        </PaperProvider>
    );
}