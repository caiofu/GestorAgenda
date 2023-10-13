import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import styles from "./StyleAgendamento";
import { useEffect, useState } from "react";

//SQLITE
import { RetornaServicosEstabelecimento } from "../SQLiteManager/SQLServicos";

export default function NovoAgendamento()
{

    //DATA
    const [date, setDate] = useState(new Date());
    const [dataFormatada, setDataFormatada] = useState({dia: date.getDate(), mes: date.getMonth()+1, ano: date.getFullYear()});
    const [abriDataPicker, setAbrirDataPicker] = useState(false);

    const onChangeDataPicker = (event, dataSelecionada) => {
        setDate(dataSelecionada);
        setDataFormatada({dia: date.getDate(), mes: date.getMonth()+1, ano: date.getFullYear()})
        setAbrirDataPicker(false); // Fecha o DatePicker quando a data é selecionada
    }


    //HORARIO
    const [abriTimePicker, setAbrirTimePicker] = useState(false);
    const [horario, setHorario] = useState(new Date());
    const [horarioFormatado, setHorarioFormatado] = useState(null);
    const onChangeTimePicker = (event, horarioSelecionado) => {
        setHorario(horarioSelecionado);
        setHorarioFormatado(horario.getHours().toString()+':'+horario.getMinutes().toString())
        setAbrirTimePicker(false);
    }

    console.log('horario -> ', horario)
    console.log('horario form ', horarioFormatado)

    useEffect(() =>{
        RetornaServicosEstabelecimento((resultados) => {
            // Faça algo com os resultados aqui, como exibir em seu aplicativo
            console.log('Resultados da consulta: ', resultados);
          });
          
    }, [])
    return(
        
          <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={{borderWidth:1,   marginLeft:15, marginRight:25, marginBottom:20, flexDirection: 'row' }} onPress={() => setAbrirDataPicker(true)} >
                        <FontAwesome name="calendar" size={24} color='#006699' />
                            <Text style={styles.txtInput}>{dataFormatada.dia + '/' + dataFormatada.mes + '/' + dataFormatada.ano}</Text>
                        </TouchableOpacity>
                        {abriDataPicker ? (
                                <DateTimePicker value={date} mode='date' onChange={onChangeDataPicker} />
                            ) : null}

                        <TouchableOpacity style={{borderWidth:1,  marginBottom:20 ,flexDirection: 'row'}} onPress={() => setAbrirTimePicker(true)}>
                        <FontAwesome5 name="clock" size={24} color='#006699' />
                            <Text style={styles.txtInput}>{horarioFormatado === null ? 'Horário' : horarioFormatado}</Text>
                        </TouchableOpacity>
                        {abriTimePicker ? (
                                <DateTimePicker value={date} mode='time' onChange={onChangeTimePicker} />
                            ) : null}

                    </View>
                   
                    <TextInput 
                        style={styles.inputFormulario}
                        label="Nome"
                        >

                    </TextInput>
                </View>
            </ScrollView>
          </SafeAreaView>
     
    );
}