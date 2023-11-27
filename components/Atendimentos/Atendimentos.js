import { TouchableOpacity, Text, View,  } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { Avatar, Card, IconButton } from 'react-native-paper';

//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";

//SELECT LIST
import { SelectList } from "react-native-dropdown-select-list";

//ESTILO
import styles from "./StyleAtendimentos";
import { useState, useEffect } from "react";
import { ScrollView } from "react-native";

//SQL
import { ConsultaAtendidosPorMesAno } from "../SQLiteManager/SQLAgendamento";



export default function Atendimentos()
{

    //CONTEXT
    const {tema, atulizaListaServico, setAtualisaListaServico } = useAppState();
    
    //COR DO TEMA
    const [corTema, setCorTema] = useState('#006699');
    useEffect(()=>{
 
       tema === 'light' ? setCorTema('#006699') : setCorTema(DarkTheme.colors.text);
         },[tema])

    const [mesSelecionado, setMesSelecionado] = useState('')
  const [anoSelecionado, setAnoSelecionado] = useState('');
    const meses = [
       'Nenhum', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
    
      const anos = ['Nenhum', '2022', '2023', '2024', '2025', /*...outras opções...*/];

      const [listaAtendimentos, setListaAtendimentos] = useState([]);
      useEffect(() => {
        setListaAtendimentos([]);
        if((anoSelecionado !== 'Nenhum' && anoSelecionado !== '') || (mesSelecionado !== 'Nenhum' && mesSelecionado !== ''))
        { 
           // Defina os valores de ano e mês desejados
          let ano = anoSelecionado;
        let mes = '';//mesSelecionado; // Novembro

         switch (mesSelecionado) {
          case 'Janeiro':
            mes = '01';
            break;
          case 'Fevereiro':
            mes = '02';
            break;
          case 'Março':
            mes = '03';
            break;
          case 'Abril':
            mes = '04';
            break;
          case 'Maio':
            mes = '05';
            break;
          case 'Junho':
            mes = '06';
            break;
          case 'Julho':
            mes = '07';
            break;
          case 'Agosto':
            mes = '08';
            break;
          case 'Setembro':
            mes = '09';
            break;
          case 'Outubro':
            mes = '10';
            break;
          case 'Novembro':
            mes = '11';
            break;
          case 'Dezembro':
            mes = '12';
            break;
          default:
            mes = 'Nenhum';
        }
    

        ConsultaAtendidosPorMesAno(ano, mes, (atendimentos) => {
         
          
          setListaAtendimentos(atendimentos)
        });
        }
       
      }, [anoSelecionado, mesSelecionado]);
      console.log('state atendimento lista ---> ', listaAtendimentos)
    return(
        <View style={{flex:1}}>
        <View style={{ flexDirection: 'row', borderWidth:1, padding:10 }}>
          <View style={{ marginRight: 10, marginLeft: 10, flex:1}}>
          
            <SelectList
               placeholder="Selecione o mes"
               searchPlaceholder=""
                search={true}
                fontFamily="Rubik_400Regular"
                boxStyles={{color:'red',}}
                dropdownStyles={{ alignSelf: 'center'}}
                setSelected={(val) => { setMesSelecionado(val); } }
                data={meses}
                dropdownTextStyles={{ color: corTema }}
                save="value"
                 arrowicon={<FontAwesome5 name="chevron-down" size={17} color={corTema} />}
                 
                 searchicon={<FontAwesome5 name="search" size={17} color={corTema} />}
                 closeicon={<FontAwesome name="close" size={24} color={corTema} />}
                                        // defaultOption={{key:idRamoAtividade,value:ramoAtividade}}
                  inputStyles={{ color: corTema }} />
          </View>
  
          <View style={{ marginRight: 10, marginLeft: 10, flex:1}}>
           
            <SelectList
               placeholder="Selecione o ano"
               searchPlaceholder=""
          
                fontFamily="Rubik_400Regular"
                boxStyles={styles.inputFormularioSelect}
                dropdownStyles={{ alignSelf: 'center'}}
                setSelected={(val) => { setAnoSelecionado(val); } }
                data={anos}
                dropdownTextStyles={{ color: corTema }}
                save="value"
                 arrowicon={<FontAwesome5 name="chevron-down" size={17} color={corTema} />}
                 searchicon={<FontAwesome5 name="search" size={17} color={corTema} />}
                 closeicon={<FontAwesome name="close" size={24} color={corTema} />}
                                        // defaultOption={{key:idRamoAtividade,value:ramoAtividade}}
                  inputStyles={{ color: corTema }} />
          
          </View>
        </View>
       
        <ScrollView>
          {/* LISTA DE ATENDIMENTOS */}
          {
            listaAtendimentos.length > 0 ? 
            (
              listaAtendimentos.map((atendimentos) => {
              let telefone = "Tel: "+atendimentos.telefone;
              
              return (
                <Card.Title
                  key={atendimentos.idAgendamento}
                  title={atendimentos.nomeCliente}
                  subtitle={telefone}
                  left={(props) => <FontAwesome5 name="clipboard-check" size={34} color="#006699" />}
                  right={(props) => <Text style={{paddingRight:4, fontStyle:'italic'}}>{atendimentos.data}</Text>}
                  style={styles.boxCard} />
              )
            })
          ): (
            <Card.Title
            titleStyle={{alignSelf:'center'}}
            title="Nenhum atendimento encontrado!"
            style={styles.boxCard}
          />
          )}
        
        </ScrollView>
        </View>
   
    );
}