import { SafeAreaView, ScrollView, View, Text, Button, TouchableOpacity } from "react-native";
import { FAB, PaperProvider, Portal, Modal } from "react-native-paper";
import {  useNavigation } from "@react-navigation/native";

//SQL
import { GetServicosPorRamo } from "../SQLiteManager/SQLServicos";
import { useEffect, useState } from "react";

export default function Servicos()
{
    const navigation = useNavigation();
    const [listaServicosVinculados, setListaServicosVinculados] = useState([]);

    const onPressFab = () => {
        // Ação a ser executada quando o botão flutuante for pressionado
      
        navigation.navigate('Novo Serviço'); 
      };

      function FuncaoG(idServico)
      {
       
        navigation.navigate('Detalhes serviço', { id: idServico }); 
      }
    //Busca lista
    useEffect(() => {
        GetServicosPorRamo(1,(servicos) => {
             console.log('teste ---------->', servicos)
            const retorno = servicos.map((listaServico) => ({
                idServico: listaServico.idServico.toString(),
                idRamoAtividade: listaServico.idRamoAtividade,
                nomeServico: listaServico.nomeServico,
                descricao: listaServico.descricao
            }));
              setListaServicosVinculados(retorno);
            }); 
    }, [])
  console.log('Retorno da lista -> ', listaServicosVinculados)
    return(
        <PaperProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                    <View style={{borderWidth:1, margin:10, }}>
                        <Text>Serviços vinculados</Text>
                        {listaServicosVinculados.map((servico) => (
                            
                            <TouchableOpacity key={servico.idServico} onPress={() => FuncaoG(servico.idServico)} style={{borderWidth:1, backgroundColor: 'grey'}}>
                                <Text  key={servico.idServico}>{servico.nomeServico} </Text>
                                </TouchableOpacity>
                            
                        ))}
                    </View>
                    <View>
                        <Text>Select seria aqui</Text>
                    </View>
                </ScrollView>
         
                {/*Botão novo serviço*/}
                 <FAB style={{ position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor:'#006699' }}icon="plus"  label="Novo serviço"   onPress={onPressFab}/>
            </SafeAreaView>
        </PaperProvider>
        
    )
}