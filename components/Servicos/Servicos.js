import { SafeAreaView, ScrollView, View, Text, Button, TouchableOpacity } from "react-native";
import { FAB, PaperProvider, List, DefaultTheme } from "react-native-paper";
import {  DarkTheme, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

//SQL
import { GetServicosAtivo, GetServicosPorRamo, GetServicosCustomizadosAtivos } from "../SQLiteManager/SQLServicos";

//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";
import styles from "./StyleServicos";



export default function Servicos()
{

   

    const {atulizaListaServico, setAtualisaListaServico, tema} = useAppState();

      //COR DO TEMA
     
      const [corTema, setCorTema] = useState('black');
      const [corTituloTema, setCorTituloTema] = useState('#006699');
 
      useEffect(()=>{
   
       tema === 'light' ? setCorTema('black') : setCorTema(DarkTheme.colors.text);
         },[tema])

    const navigation = useNavigation();
    const [listaServicosVinculados, setListaServicosVinculados] = useState([]);
    const [listaServicosCriados, setListaServicosCriados] = useState([]);

    const CriarNovoServico = () => {
        // Ação a ser executada quando o botão flutuante for pressionado
      
        navigation.navigate('Novo Serviço'); 
      };

      function CarregaDetalhes(idServico, tipoServico)
      {
       
        navigation.navigate('Detalhes serviço', { id: idServico, tipoServico: tipoServico }); 
      }
    //BUSCA LISTA DE SERVIÇOS ATIVOS
    useEffect(() => {
     
            GetServicosAtivo((servicos) => {
                
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
        //}
         
    }, [atulizaListaServico])

    //BUSTA LISTA DE SERVIÇOS CUSTOMIZADOS ATIVOS
    useEffect(() =>{
        GetServicosCustomizadosAtivos((servicos) => {
            
            const retorno = servicos.map((listaServico) => ({
                idServicoCustomizado: listaServico.idServicoCustomizado.toString(),
                nomeServico: listaServico.nomeServico,
                descricao: listaServico.descricao,
                favorito: listaServico.favorito
            }));
            setListaServicosCriados(retorno);
           }); 
    }, [atulizaListaServico])

    
//   console.log('Retorno da lista -> ', listaServicosVinculados)
    return(
        <PaperProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                     {/* Lista de serviços importados */}
                    <View style={{ borderWidth: 1, borderRadius:6, margin:10,    borderColor:corTema}}>
                        <List.Accordion 
                            title="Serviços importados"
                            id="servicosAccordion"
                           
                            titleStyle={styles.tituloCabecalhoLista}
                            
                            style={{backgroundColor:'#006699', borderRadius:3, zIndex:1024}}
                            
                        >
                            { listaServicosVinculados.length === 0 ? <Text style={styles.txtListaVazia}> Nenhum serviço importado </Text> :
                                listaServicosVinculados.map((servico) => (
                                        <TouchableOpacity 
                                             key={servico.idServico}
                                             onPress={() => CarregaDetalhes(servico.idServico, 'importado')} 
                                             style={[styles.itemServico, {borderColor: corTema}]}
                                        >
                                            {/* <Text  key={servico.idServico}>{servico.nomeServico} </Text> */}
                                            <List.Item key={servico.idServico}
                                                        title={servico.nomeServico}
                                                        description={servico.descricao}
                                                        titleStyle={[styles.itemTitulo, {color: corTituloTema}]}
                                                        descriptionStyle={[styles.itemDescricao, {color:corTema}]}
                                                        descriptionNumberOfLines={1}
                                                        right={servico.favorito === 1 ? props => <List.Icon {...props} color="#ffca00" icon="star" /> : ''} />
                                            </TouchableOpacity>

                                        
                                    ))
                            }
                        </List.Accordion>

                         
                    </View>
                    
                    {/* Lista de serviços criados */}
                    <View style={{borderWidth:1, margin:10, borderRadius:6, borderColor:corTema }}>
                        
                     
                        <List.Accordion 
                            title="Serviços criados"
                            id="servicosAccordion"
                            
                            titleStyle={styles.tituloCabecalhoLista}
                            
                           style={{backgroundColor:'#006699', borderRadius:3}}
                        >
                        { listaServicosCriados.length === 0 ? <Text style={styles.txtListaVazia}> Nenhum serviço criado </Text> :    
                            listaServicosCriados.map((servico) => (
                                
                                <TouchableOpacity 
                                    key={servico.idServicoCustomizado} 
                                    onPress={() => CarregaDetalhes(servico.idServicoCustomizado, 'criado')} 
                                    style={[styles.itemServico, {borderColor: corTema}]}>
                                    {/* <Text  key={servico.idServico}>{servico.nomeServico} </Text> */}
                                    <List.Item key={servico.idServicoCustomizado}
                                                title={servico.nomeServico}
                                                description={servico.descricao}
                                                titleStyle={[styles.itemTitulo, {color: corTituloTema}]}
                                                descriptionStyle={[styles.itemDescricao, {color:corTema}]}
                                                descriptionNumberOfLines={1}
                                                right={servico.favorito === 1 ? props => <List.Icon {...props} color="#ffca00" icon="star" /> : ''} />
                                    </TouchableOpacity>

                                
                            ))
                        }
                        </List.Accordion>

                         
                    </View>
                </ScrollView>
         
                {/*Botão novo serviço*/}
                 <FAB style={[styles.btnNovoServico]} icon="plus" aria-label="Rubik_400Regular"  color="#fff"  label="Novo serviço"   onPress={CriarNovoServico}/>
            </SafeAreaView>
        </PaperProvider>
        
    )
}