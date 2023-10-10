import { View, Text, TouchableOpacity } from "react-native";
import { Appbar } from 'react-native-paper';
import { FontAwesome5, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';


export default function Agendamento()
{
    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
    const [date, setDate] = useState(new Date());
    const [dataAtual, setDataAtual] = useState({dia: date.getDate(), mes: date.getMonth()+1, ano: date.getFullYear()});
    return(
        <View style={{flex:1, padding:10, flexDirection:'column'}}>
            <TouchableOpacity style={{borderWidth:1, flexDirection:'row'}}>
                <FontAwesome  name="calendar" size={24}  />
                <Text>{dataAtual.dia+'/'+dataAtual.mes+'/'+dataAtual.ano}</Text>
            </TouchableOpacity>
        </View>
    );
}