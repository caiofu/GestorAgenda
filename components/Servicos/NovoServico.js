import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import styles from "./StyleServicos";
import { useEffect, useState } from "react";
import { SelectList, MultipleSelectList } from "react-native-dropdown-select-list";

//SQLITE
import { ConsultaRamoAtividade } from "../SQLiteManager/SQLRamoAtividade";
import { GetServicosPorRamo, UpdateAtivoServico } from "../SQLiteManager/SQLServicos";

//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";

export default function NovoServico()
{
     //COR DO TEMA
     const {tema} = useAppState();
     const [corTema, setCorTema] = useState('#006699');

     //RAMO DE ATIVIDADE
     const [ramoAtividadeSelecionado, setRamoAtividadeSelecionado]          = useState(""); //Usado para seleção da lista
     const [idRamoAtividade, setIdRamoAtividade]                            = useState(null);
     const [ramoAtividade, setRamoAtividade]                                = useState(null);
     const [listaRamoAtividade, setListaRamoAtividade]                      = useState([]);

     //SERVICOS
     const [servicoSelecionado, setServicoSelecionado]                      = useState([]);
     const [listaServicos, setListaServicos]                                = useState([]);

     //BOTOES
     const [btnImportar, setBtnImportar] = useState(false);
     const [btnNovo, setBtnNovo]            = useState(false);

     //CONTROLA O TEMA
      useEffect(()=>{
   
       tema === 'light' ? setCorTema('#006699') : setCorTema(DarkTheme.colors.text);
         },[tema])

     //BOTAO IMPORTAR E LISTA DE RAMO DE ATIVIDADE    
     useEffect(() =>{
        if(btnImportar)
        {

            ConsultaRamoAtividade((ramoAtividades) => {
                const retorno = ramoAtividades.map((atividade) => ({
                    key: atividade.idRamoAtividade.toString(),
                    value: atividade.nomeAtividade,
                }));
                    //console.log(retorno);
                    setListaRamoAtividade(retorno);
                  
                });
        }

    }, [btnImportar])

    //RESPONSAVEL PELA SELEÇÃO NO LIST RAMO ATIVIDADE
    useEffect(() => {
        // Obtendo chave correspondente ao valor do ramo de atividade
        
        const chaveSelecionada = listaRamoAtividade.find(item => item.value === ramoAtividadeSelecionado)?.key;
        setIdRamoAtividade(chaveSelecionada);
        console.log(chaveSelecionada)
      }, [ramoAtividadeSelecionado, listaRamoAtividade]);
    
     //BUSCA A LISTA DE SERVIÇOS DE ACORDO COM RAMO ESCOLHIDO
     console.log('idRamoAtividade --->', idRamoAtividade);
     useEffect(() => {
        if(idRamoAtividade != null)
        {
            GetServicosPorRamo(idRamoAtividade,(servicos) => {
             
                const retorno = servicos.map((listaServico) => ({
                    key: listaServico.idServico.toString(),
                    // idRamoAtividade: listaServico.idRamoAtividade,
                    value: listaServico.nomeServico,
                    // descricao: listaServico.descricao
                }));
                  setListaServicos(retorno);
                });
        }
        
    }, [idRamoAtividade])  
   // console.log('Servicos buscados ---------->', listaServicos)
    function ImportarServico()
    {
        setBtnImportar(true);
    }
    
    return(
        <SafeAreaView>

            <View style={{display: 'flex', flexDirection: 'column', flexGrow:1, gap:20, margin:10}} >
             {btnImportar ? 
             (  
                <>
                    <SelectList
                        placeholder="Selecione o ramo de atividade"
                        searchPlaceholder=""

                        fontFamily="Rubik_400Regular"
                        boxStyles={styles.inputFormularioSelect}
                        dropdownStyles={{ alignSelf: 'center', width: '89%' }}
                        setSelected={(val) => { setRamoAtividadeSelecionado(val); } }
                        data={listaRamoAtividade}
                        dropdownTextStyles={{ color: corTema }}
                        save="value"
                        arrowicon={<FontAwesome5 name="chevron-down" size={17} color={corTema} />}
                        searchicon={<FontAwesome5 name="search" size={17} color={corTema} />}
                        closeicon={<FontAwesome name="close" size={24} color={corTema} />}
                        // defaultOption={{key:idRamoAtividade,value:ramoAtividade}}
                        inputStyles={{ color: corTema }} />

                        <MultipleSelectList
                            placeholder= {ramoAtividadeSelecionado === ''? 'Nenhum ramo de atividade selecionado' : "Escolha o serviço"}
                            searchPlaceholder=""
                            data={listaServicos}
                            save="value"
                            setSelected={(val) => setServicoSelecionado(val)}
                            onSelect={() =>alert(servicoSelecionado)}
                        />

                       
                        
                        <TouchableOpacity style={servicoSelecionado.length === 0 ? styles.btnDesabilitado : styles.btn} disabled={true}>
                            <View style={[styles.btnContainer, {alignSelf:'center'}]}>
                                <Text style={styles.btnText}>IMPORTAR</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnCancelar} disabled={true}>
                            <View style={[styles.btnContainer, {alignSelf:'center'}]}>
                                <Text style={styles.btnText}>CANCELAR</Text>
                            </View>
                        </TouchableOpacity>
                </>
             ) : (
           
                <>
                    <TouchableOpacity style={styles.btn} onPress={ImportarServico}>
                            <View style={styles.btnContainer}>
                                <FontAwesome5 name="file-import" size={28} color="#fff" />
                                <Text style={styles.btnText}>importar serviço</Text>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.btn}>
                                <View style={styles.btnContainer}>
                                    <FontAwesome name="plus" size={28} color="#fff" />
                                    <Text style={styles.btnText}>Criar novo</Text>
                                </View>
                        </TouchableOpacity>

                       
                </>
                
           )}
           {console.log('servico selecionado ----->',servicoSelecionado)}
            </View>
                        
        </SafeAreaView>
    )
}