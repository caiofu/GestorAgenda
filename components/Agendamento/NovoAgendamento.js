import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import { FontAwesome, FontAwesome5 , MaterialIcons} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {  MultipleSelectList } from "react-native-dropdown-select-list";

import styles from "./StyleAgendamento";
import { useEffect, useState } from "react";

//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";

//SQLITE
import { RetornaServicosEstabelecimento } from "../SQLiteManager/SQLServicos";

export default function NovoAgendamento()
{
    //CONTEXT TEMA
    const {tema } = useAppState();
    //COR DO TEMA
     const [corTema, setCorTema] = useState('#006699');
     useEffect(()=>{
      
            tema === 'light' ? setCorTema('#006699') : setCorTema(DarkTheme.colors.text);
              },[tema])
         
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
          
            // Agora resultadosTratados contém os resultados com identificadores únicos crescentes
            // e nomes de serviços correspondentes
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
        setDataFormatada({dia: date.getDate(), mes: date.getMonth()+1, ano: date.getFullYear()})
    },[date])

  

   //LEMBRAR QUE PRIMEIRO VAMOS CRIAR O AGENDAMENTO E RETORNAR O ID CRIADO AI 
   //SALVAR O SERVIÇO COM ID DO AGENDAMENTO, OU SEJA SE AGEDAMENTO FALHAR NAO CRIA NADA.

   function AgendarServico()
   {

   }
    console.log('lsita servico ->', listaServicos)
    console.log('SERVIÇO SELECIONADO -> ', servicoSelecionado)
    console.log('limpa lista reset -> ', limparLista)
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
                        onChange={setNome}
                            value={nome}
                        >

                    </TextInput >

                    <TextInput    
                        style={styles.inputFormulario}
                        label="Telefone"
                        keyboardType="numeric"
                        onChange={setTelefone}
                        value={telefone}
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
                            inputStyles={{ color: corTema }}
                            notFoundText=""
                            key={limparLista}
                            data={listaServicos}
                            
                            save="value"
                            // Para evitar erros quando usuario clica na lista vazia
                           
                            setSelected={(val) => {
                                if (servicoSelecionado !== '') 
                                {
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
                    <TouchableOpacity style={styles.btn} disabled={servicoSelecionado.length === 0 ? true : false}>
                                            <View style={[styles.btnContainer, {alignSelf:'center'}]}>
                                                <Text style={styles.btnText}>AGENDAR</Text>
                                            </View>
                  </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
          </SafeAreaView>
     
    );
}