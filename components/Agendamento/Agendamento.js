import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {FAB, PaperProvider, List } from 'react-native-paper';
import { FontAwesome5, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';

import {  DarkTheme, useNavigation } from "@react-navigation/native";



export default function Agendamento()
{
    const navigation = useNavigation();
    
    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
    const [date, setDate] = useState(new Date());
    const [dataFormatada, setDataFormatada] = useState({dia: date.getDate(), mes: date.getMonth()+1, ano: date.getFullYear()});

    const [abriDataPicker, setAbrirDataPicker] = useState(false);


    
    const onChangeDataPicker = (event, dataSelecionada) => {
        setDate(dataSelecionada);
        setDataFormatada({dia: date.getDate(), mes: date.getMonth()+1, ano: date.getFullYear()})
        setAbrirDataPicker(false); // Fecha o DatePicker quando a data é selecionada
    }

    const showDatePicker = () => {
   
        setAbrirDataPicker(true);
    }

    const CriarNovoAgendamento = () => {
        // Ação a ser executada quando o botão flutuante for pressionado
      
        navigation.navigate('Novo Agendamento'); 
      };
 console.log(date)
    return (
        <PaperProvider>
            <View style={{flex: 1, padding: 10, flexDirection: 'column'}}>
                <TouchableOpacity style={{borderWidth: 1, flexDirection: 'row', padding: 4, backgroundColor:'#fff', borderColor:'#006699', borderRadius:4}} onPress={showDatePicker}>
                    <FontAwesome name="calendar" size={24} color='#006699' />
                    <Text style={{alignSelf:'center', marginLeft:5, color: '#006699', fontFamily:'Rubik_700Bold'}}>{dataFormatada.dia + '/' + dataFormatada.mes + '/' + dataFormatada.ano}</Text>
                </TouchableOpacity>
                {abriDataPicker ? (
                    <DateTimePicker value={date} mode='date' onChange={onChangeDataPicker} />
                ) : null}
            <View style={{borderWidth:1, flex:1,marginBottom:70, marginTop:2, borderRadius:4, borderColor:'#006699'}}>
                <ScrollView>
                    <TouchableOpacity style={{borderWidth:0.7, margin:4, borderRadius:10}}>
                        <List.Item
                        title="Barba"
                        description="Caio Furegati"
                       
                        titleStyle={{color:'black', fontSize:12}}
                        descriptionStyle={{color:'gray', fontSize:10}}
                        right={props => <Text>Horário: 8:50</Text>}

                    />
                    </TouchableOpacity>

                    <TouchableOpacity style={{borderWidth:0.7, margin:4, borderRadius:10}}>
                        <List.Item
                        title="Barba"
                        description="Caio Furegati"
                       
                        titleStyle={{color:'black', fontSize:12}}
                        descriptionStyle={{color:'gray', fontSize:10}}
                        right={props => <Text>Horário: 8:50</Text>}

                    />
                    </TouchableOpacity>
               
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