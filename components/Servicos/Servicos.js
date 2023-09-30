import { SafeAreaView, ScrollView, View, Text, Button, TouchableOpacity } from "react-native";
import { FAB, PaperProvider, List } from "react-native-paper";
import {  useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

//SQL
import { GetServicosAtivo, GetServicosPorRamo } from "../SQLiteManager/SQLServicos";

//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";
import styles from "./StyleServicos";

export default function Servicos()
{
    const {atulizaListaServico, setAtualisaListaServico} = useAppState();

    const navigation = useNavigation();
    const [listaServicosVinculados, setListaServicosVinculados] = useState([]);

    const CriarNovoServico = () => {
        // Ação a ser executada quando o botão flutuante for pressionado
      
        navigation.navigate('Novo Serviço'); 
      };

      function FuncaoG(idServico)
      {
       
        navigation.navigate('Detalhes serviço', { id: idServico }); 
      }
    //Busca lista
    useEffect(() => {
        // GetServicosPorRamo(1,(servicos) => {
        //      console.log('teste ---------->', servicos)
        //     const retorno = servicos.map((listaServico) => ({
        //         idServico: listaServico.idServico.toString(),
        //         idRamoAtividade: listaServico.idRamoAtividade,
        //         nomeServico: listaServico.nomeServico,
        //         descricao: listaServico.descricao
        //     }));
        //       setListaServicosVinculados(retorno);
        //     }); 
        if(atulizaListaServico) //Se carrega quando for verdadeiro
        {
            GetServicosAtivo((servicos) => {
                console.log('teste ---------->', servicos)
               const retorno = servicos.map((listaServico) => ({
                   idServico: listaServico.idServico.toString(),
                   idRamoAtividade: listaServico.idRamoAtividade,
                   nomeServico: listaServico.nomeServico,
                   descricao: listaServico.descricao,
                   favorito: listaServico.favorito
               }));
                 setListaServicosVinculados(retorno);
               }); 
               setAtualisaListaServico(false);
        }
         
    }, [atulizaListaServico])

    
  console.log('Retorno da lista -> ', listaServicosVinculados)
    return(
        <PaperProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                     {/* Lista de serviços importados */}
                    <View style={{borderWidth:1, margin:10, borderRadius:6 }}>
                        
                       
                        <List.Accordion 
                            title="Serviços importados"
                            id="servicosAccordion"
                            titleStyle={{color:'#fff'}}
                            
                           style={{backgroundColor:'#006699', borderRadius:3}}
                        >
                        {listaServicosVinculados.map((servico) => (
                            
                            <TouchableOpacity key={servico.idServico} onPress={() => FuncaoG(servico.idServico)} style={styles.itemServico}>
                                {/* <Text  key={servico.idServico}>{servico.nomeServico} </Text> */}
                                <List.Item key={servico.idServico}
                                            title={servico.nomeServico}
                                            description={servico.descricao}
                                            titleStyle={styles.itemTitulo}
                                            descriptionStyle={styles.itemDescricao}
                                            descriptionNumberOfLines={1}
                                            right={servico.favorito === 1 ? props => <List.Icon {...props} color="#ffca00" icon="star" /> : ''} />
                                </TouchableOpacity>

                            
                        ))}
                        </List.Accordion>

                         
                    </View>
                    
                    {/* Lista de serviços criados */}
                    <View style={{borderWidth:1, margin:10, borderRadius:6 }}>
                        
                     
                        <List.Accordion 
                            title="Serviços criados"
                            id="servicosAccordion"
                            titleStyle={{color:'#fff'}}
                            
                           style={{backgroundColor:'#006699', borderRadius:3}}
                        >
                        {listaServicosVinculados.map((servico) => (
                            
                            <TouchableOpacity key={servico.idServico} onPress={() => FuncaoG(servico.idServico)} style={styles.itemServico}>
                                {/* <Text  key={servico.idServico}>{servico.nomeServico} </Text> */}
                                <List.Item key={servico.idServico}
                                            title={servico.nomeServico}
                                            description={servico.descricao}
                                            titleStyle={styles.itemTitulo}
                                            descriptionStyle={styles.itemDescricao}
                                            descriptionNumberOfLines={1}
                                            right={servico.favorito === 1 ? props => <List.Icon {...props} color="#ffca00" icon="star" /> : ''} />
                                </TouchableOpacity>

                            
                        ))}
                        </List.Accordion>

                         
                    </View>
                </ScrollView>
         
                {/*Botão novo serviço*/}
                 <FAB style={{ position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor:'#006699' }}icon="plus"  label="Novo serviço"   onPress={CriarNovoServico}/>
            </SafeAreaView>
        </PaperProvider>
        
    )
}