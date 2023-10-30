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

      // //BUSCA AGENDAMENTOS
      // const [listaAgendamentos, setListaAgendamentos] = useState([]);
      // useEffect(() =>{
      //   console.log('açaoooooooooooooooooooooo !!!')
      //       ConsultaAgendamentoPorData(dataFormatada, (agendamentos) =>{
      //           //console.log('aged ==' ,agendamentos)
      //            const retorno = agendamentos.map((listaAgendamentos) => ({
      //               idAgendamento: listaAgendamentos.idAgendamento.toString(),
      //               nomeCliente: listaAgendamentos.nomeCliente,
      //               telefone: listaAgendamentos.telefone,
      //               data: listaAgendamentos.data,
      //               horario: listaAgendamentos.horario,
      //               atendido: listaAgendamentos.atendido,
      //               cancelado: listaAgendamentos.cancelado
                        
      //            }));
      //           setListaAgendamentos(retorno);
                
                
      //       });
      // },[atualizaAgendamentos, dataFormatada, date]);
      const [listaAgendamentos, setListaAgendamentos] = useState([]);
      
      useEffect(() => {
          //DATA
          const dataAtual = new Date();
          dataAtual.setHours(0,0,0,0);
          const dataAgendamento = new Date();
          const horaAtual = new Date();
          const horarioAgendamento = new Date();

          ConsultaAgendamentoPorData(dataFormatada, (agendamentos) => {
              const retorno = agendamentos.map((agendamento) => {
                // Dividir a string em partes (dia, mês e ano)
                const partesData = agendamento.data.split('/'); // Isso resultará em um array ["25", "10", "2023"]

                // Converter as partes da data em números inteiros
                const dia = parseInt(partesData[0], 10);
                const mes = parseInt(partesData[1] -1, 10); // Lembre-se que os meses em JavaScript são baseados em zero (janeiro é 0).
                const ano = parseInt(partesData[2], 10);
                //Setando a data no objeto
                dataAgendamento.setDate(dia);
                dataAgendamento.setMonth(mes);
                dataAgendamento.setFullYear(ano);
                dataAgendamento.setHours(0,0,0,0);

                const partesHorario = agendamento.horario.split(':');
                const hora = parseInt(partesHorario[0], 10);
                const minuto = parseInt(partesHorario[1], 10);
                //Setando o horario no objeto
                horarioAgendamento.setHours(hora);
                horarioAgendamento.setMinutes(minuto);

                let atraso = 0;
                
                console.log('hora agendamento: ', horarioAgendamento+'  horarioAtual: ', horaAtual);

               

                //Verificando se esta na data atual ou antes para verificar os atrasos
                if(isEqual(dataAgendamento, dataAtual) )
                {
                    //Verificando se foi atendido ou se foi cancelado
                    if(agendamento.atendido === 0 && agendamento.cancelado === 0)
                    {
                        console.log('NAO FOI NEM ATENDIDO NEM CANCELADO PODE VERIFICAR SE ESTA EM ATRASO');
                        if(isBefore(horarioAgendamento, horaAtual))
                        {
                          console.log('ESTA ATRASADO -<-----')
                          atraso =1;
                        }
                    }
                }
                else
                {
                    console.log("A DATA É POSTERIOR NAO PRECISA VERIFICAR ATRASO")
                }
                console.log('dataa ----> ', dataAgendamento + 'data atual: ', dataAtual);
                  
                  
                  return {
                      idAgendamento: agendamento.idAgendamento.toString(),
                      nomeCliente: agendamento.nomeCliente,
                      telefone: agendamento.telefone,
                      data: agendamento.data,
                      horario: agendamento.horario,
                      atendido: agendamento.atendido,
                      cancelado: agendamento.cancelado,
                      atrasado: atraso
                    
                  };
              });
      
              setListaAgendamentos(retorno);
          });
      }, [atualizaAgendamentos, dataFormatada, date]);
      console.log('lista ?' ,listaAgendamentos)
  
    //   ConsultaAgendamentoGeral((geral) => {
    //     console.log('GERAL ---> ', geral)
    //   })
      // ConsultaAgendamentoPorData(dataFormatada, (agendamentos) =>{
      //   console.log('Por data ====> ',agendamentos)
      // })

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
                    { listaAgendamentos.map((agendamento) => {
                        let corStatus = '';
                        let textoStatus = 'Aguardando atendimento';    
                        if(agendamento.atendido === 1 && agendamento.cancelado === 0)
                        {
                            corStatus = '#49b6754d'
                            textoStatus = 'Atendido';
                        }
                        else if(agendamento.cancelado === 1)
                        {
                            corStatus = '#d12c3847'
                            textoStatus = 'Cancelado'
                        }
                        else if (agendamento.atendido === 0 && agendamento.atrasado === 1)
                        {
                            corStatus = '#f7730947'
                            textoStatus = 'Aguardando atendimento (atrasado)'
                        }

                        return (
                                        <TouchableOpacity 
                                             key={agendamento.idAgendamento}
                                             onPress={() => CarregaDetalhesAgendamento(agendamento.idAgendamento)} 
                                            style={{borderWidth:0.7, margin:4, borderRadius:10}}
                                            
                                        >
                                          {console.log('atendido ? ', agendamento.atendido+ ' cancelado ? ', agendamento.cancelado)}
                                            {/* <Text  key={servico.idServico}>{servico.nomeServico} </Text> */}
                                            <List.Item key={agendamento.idAgendamento}
                                                        title={agendamento.nomeCliente}
                                                        description={textoStatus}
                                                        titleStyle={{color:'black', fontSize:12}}
                                                        descriptionStyle={{color:'gray', fontSize:10}}
                                                        descriptionNumberOfLines={1}
                                                        style={{backgroundColor: corStatus, borderRadius:10}}
                                                        right={props =>  <><FontAwesome5 name="clock" size={18} color='#006699' /><Text style={{marginLeft:5, fontFamily:'Rubik_700Bold', color:'#006699'}}>{agendamento.horario}</Text></>} />
                                            </TouchableOpacity>

                        )               
                    }) }
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