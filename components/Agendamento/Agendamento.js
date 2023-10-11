import { View, Text, TouchableOpacity } from "react-native";
import { Appbar } from 'react-native-paper';
import { FontAwesome5, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';



export default function Agendamento()
{
    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
    const [date, setDate] = useState(new Date());
    const [dataFormatada, setDataFormatada] = useState({dia: date.getDate(), mes: date.getMonth()+1, ano: date.getFullYear()});

    const [abriDataPicker, setAbrirDataPicker] = useState(false);
    const [mode, setMode]    = useState('date');

    
    const onChangeDataPicker = (event, dataSelecionada) => {
        setDate(dataSelecionada);
        setDataFormatada({dia: date.getDate(), mes: date.getMonth()+1, ano: date.getFullYear()})
        setAbrirDataPicker(false); // Fecha o DatePicker quando a data é selecionada
    }

    const showDatePicker = () => {
        setMode('date'); // Define o modo como data
        setAbrirDataPicker(true);
    }

 console.log(date)
    return (
        <View style={{flex: 1, padding: 10, flexDirection: 'column'}}>
            <TouchableOpacity style={{borderWidth: 1, flexDirection: 'row', padding: 4}} onPress={showDatePicker}>
                <FontAwesome name="calendar" size={24} />
                <Text>{dataFormatada.dia + '/' + dataFormatada.mes + '/' + dataFormatada.ano}</Text>
            </TouchableOpacity>
            {abriDataPicker ? (
                <DateTimePicker value={date} mode={mode} onChange={onChangeDataPicker} />
            ) : null}
          
        </View>
    );
}