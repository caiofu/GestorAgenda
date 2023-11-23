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
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
    
      const anos = ['2022', '2023', '2024', '2025', /*...outras opções...*/];
    return(
        <View>
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
            {/* <TouchableOpacity style={{ borderWidth: 1 }}>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}
              >
                <Picker.Item label="Selecione um ano" value="" />
                {anos.map((ano, index) => (
                  <Picker.Item key={index} label={ano} value={ano} />
                ))}
              </Picker>
            </TouchableOpacity> */}
          </View>
        </View>
        <ScrollView>
        <Card.Title
            title="Caio Furegati"
            subtitle="17981016680"
            left={(props) => <Avatar.Icon {...props} icon="folder" />}
            right={(props) => <Text style={{paddingRight:4, fontStyle:'italic'}}>20/09/2023</Text>}
            style={{borderWidth:1, margin:8}}
        />
        </ScrollView>
      </View>
    );
}