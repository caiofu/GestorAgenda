import { useEffect, useState } from 'react'
import { Text, View, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { TextInput, List } from 'react-native-paper'
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { MultipleSelectList } from "react-native-dropdown-select-list"; //a aposentar
import DropDownPicker from 'react-native-dropdown-picker'; //novo componente para renderizar serviços favoritos
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { GetServicosEstabelecimento, GetServicosColaborador, FavoritarServicoColaborador } from '../SQLiteManager/SQLServicoColaborador';
import { CriaNovoColaborador, UpdateColaboradorPorId } from '../SQLiteManager/SQLiteColaborador';


export default function FormColaboradores({route}) {
    //console.log(route); //verificar os parâmetro fornecidos à tela de formulário.
    //estados do colaborador
    const [idColaborador, setIdColaborador] = useState(null);
    const [nome, setNome] = useState('');
    const [funcao, setFuncao] = useState('');
    const [edicaoCadastro, setEdicaoCadastro] = useState(null);

    //estados das listas de serviços
    const [listaServicosEstabelecimento, setListaServicosEstabelecimento] = useState([]);
    const [listaServicosSelecionados, setListaServicosSelecionados] = useState([]);
    const [listaServicosPreferidos, setListaServicosPreferidos] = useState([]);
    const [erro, setErro] = useState(null); //estado para armazenar erros
    const [isOpen, setIsOpen] = useState(false); //para que o MultipleSelectList venha sempre aberto
    const [max, setMax] = useState(1);

    //responsividade
    const maxHeight = heightPercentageToDP('40%'); // Define a altura máxima do DropDownPicker como 70% da altura da tela

    // if(route.params !== undefined){
    const colaborador = route.params.colaborador;
    useEffect(() => {
        //BUSCA SERVIÇOS VINCULADOS AO ESTABELECIMENTO e ALTERA O ESTADO ISOPEN PARA TRAZER O DROPDOWNPICKER ABERTO POR PADRÃO
        GetServicosEstabelecimento(
            //   route.params.colaborador ? route.params.colaborador.idColaborador : null,
              (servicosArray) => {
                setListaServicosEstabelecimento(servicosArray);
                setMax(servicosArray.length);
                setIsOpen(true);
                setErro(null); // Limpar erro, se houver
              },
              (error) => {
                setErro(error);
                console.log('[LOGS] - Erro GetServicosEstabelecimento: ', error)
              }
            );
        // console.log(route.params);
        // console.log(route.params.colaborador)
        //usado para editar o cadastro
        if(colaborador){
            setIdColaborador(colaborador.idColaborador);
            setNome(colaborador.nomeColaborador);
            setFuncao(colaborador.descricao);
            setEdicaoCadastro(true);
            console.log(route.params.colaborador.idColaborador);
            GetServicosColaborador(colaborador.idColaborador, (servicosColaboradorArray)=>{
                // console.log("Serviços sendo inseridos em setListaServicosSelecionados");
                const ValuesServicosColaborador = servicosColaboradorArray.map((servico)=>servico.value);
                setListaServicosSelecionados(ValuesServicosColaborador);
                // console.log("ValuesServicosColaborador: ", ValuesServicosColaborador);
            })  
        }
        else {
            setNome('');
            setFuncao('');
            setEdicaoCadastro(false);
        }
    }, []);
    // }
    
    //BUSCA SERVIÇOS VINCULADOS AO ESTABELECIMENTO e ALTERA O ESTADO ISDROPDOWNOPEN PARA TRAZER O MULTIPLESELECTLIST ABERTO POR PADRÃO
    // useEffect(() => {
    //     GetServicosEstabelecimento(
    //     //   route.params.colaborador ? route.params.colaborador.idColaborador : null,
    //       (servicosArray) => {
    //         setListaServicosEstabelecimento(servicosArray);
    //         setMax(servicosArray.length);
    //         setIsOpen(true);
    //         setErro(null); // Limpar erro, se houver
    //       },
    //       (error) => {
    //         setErro(error);
    //         console.log('[LOGS] - Erro GetServicosEstabelecimento: ', error)
    //       }
    //     );
        
    //   }, []);

    //FINALIZAÇÃO DO PROCESSO DE CADASTRO OU EDIÇÃO DE COLABORADOR
    //Cadastro de novo colaborador
    function CriarColaborador(){
        //Validação
        if(nome === '' || funcao === '')
        {
            // setHelperNome(true);
            // refNome.current.focus(); //Responsavel por levar o focu ate o input nome
            console.log('Campos vazios, tratar para não permitir');
        }
        else
        {
            // setHelperNome(false);
            CriaNovoColaborador(nome, funcao, (novoID) => {
                if (novoID !== null) {
                    // A inserção foi bem-sucedida
                    console.log('[LOGS] - Inserção bem-sucedida em CriaNovoColaborador. Novo ID: ${novoID}');
                    //Etapa de vínculo do novo colaborador com serviços favoritos(caso selecionado algum)
                    const totalChamadas = listaServicosSelecionados.length;
                    if(totalChamadas != 0){
                        FavoritarServicos(novoID, totalChamadas, (sucesso)=>{
                            if(sucesso){
                                console.log("inserir dialog informando sucesso da função CriarColaborador linha 86");
                            }
                            else{
                                console.log("inserir dialog informando sucesso na criação e falha no vínculo de serviços, linha 89");
                            }
                        });
                    }
                    else{
                        console.log("[LOGS] - Sem serviços a serem favoritados.");
                    }
                    // setDialogTitulo('Sucesso');
                    // setDialogMensagem('Serviço criado!')
                    // setDialogTelaRetorno('Novo Serviço')
                    // setDialogTipoMensagem('S');
                    // setMsgAcaoVisivel(true);
                    // setBtnNovo(false);
                    //setAtualisaListaServico(true); ATUALIZAR LISTA DE SERVIÇO CUSTOMIZADO
                } else {
                // A inserção falhou
                console.log('Falha ao inserir');
                // setDialogTitulo('Atenção');
                // setDialogMensagem('Não foi possivel criar o serviço')
                // setDialogTipoMensagem('E');
                // setMsgAcaoVisivel(true)
            
                }
            });
        }
    }

    //Edição de colaborador
    function SalvarEdicao(){
        console.log('implementar SalvarEdicao');
        if(nome === '' || funcao === '')
        {
            // setHelperNome(true);
            // refNome.current.focus(); //Responsavel por levar o focu ate o input nome
            console.log('Campos vazios, tratar para não permitir');
        }
        else
        {
             // setHelperNome(false);
             
             
             UpdateColaboradorPorId(idColaborador, nome, funcao, (sucesso) => {
                if (sucesso) {
                // A inserção foi bem-sucedida
                console.log('Edição bem sucedida - dados colaborador');
                console.log(listaServicosSelecionados);

                let chamadasBemSucedidas = 0;
                const totalChamadas = listaServicosSelecionados.length;

                listaServicosSelecionados.forEach((servicoSelecionado) => {
                    const servico = listaServicosEstabelecimento.find((item)=>item.value === servicoSelecionado);
                if(servico){
                    // console.log("Informações do serviço: " + {servico});
                    // console.log(servico);
                    FavoritarServicoColaborador(idColaborador, servico.value, servico.label, (sucesso)=>{
                        if(sucesso){
                            console.log(chamadasBemSucedidas);
                            chamadasBemSucedidas++;
                        }
                        else{
                            console.log("else favoritarServicoColaborador line 131");
                        }
                        console.log('contador', chamadasBemSucedidas + 'total ', listaServicosSelecionados.length)
                        if(chamadasBemSucedidas === totalChamadas){
                            console.log('serviço favoritado!');
                        }
                    }
                    )
                }
                   
                });
                // FavoritarServicosColaborador(idColaborador, listaServicosSelecionados, (sucesso) => {
                //     if(sucesso){
                //         console.log("Serviços favoritados");
                //     }
                //     else{
                //         console.log('Falha ao vincular serviços');
                //     }
                // });
                // setDialogTitulo('Sucesso');
                // setDialogMensagem('Serviço criado!')
                // setDialogTelaRetorno('Novo Serviço')
                // setDialogTipoMensagem('S');
                // setMsgAcaoVisivel(true);
                // setBtnNovo(false);
                //setAtualisaListaServico(true); ATUALIZAR LISTA DE SERVIÇO CUSTOMIZADO
                } else {
                // A inserção falhou
                console.log('Falha ao atualizar');
                // setDialogTitulo('Atenção');
                // setDialogMensagem('Não foi possivel criar o serviço')
                // setDialogTipoMensagem('E');
                // setMsgAcaoVisivel(true)
            
                }
            });
        }
    }

    function FavoritarServicos(idColaborador, totalChamadas, callback){
        let chamadasBemSucedidas = 0;
        //antes da chamada desta função, foi validado se o tamanho de listaServicoSelecionado é diferente de 0
        //a partir disso é possível iterar a lista.
        listaServicosSelecionados.forEach((servicoSelecionado) => {
            const servico = listaServicosEstabelecimento.find((item)=>item.value === servicoSelecionado);
            // console.log('servico:', servico);
            // console.log("servico.label", servico.label);
            // console.log("servico.value", servico.value);
            
        if(servico){
            console.log("[LOGS] Informações do serviço: " + {servico});
            // console.log(servico);
            FavoritarServicoColaborador(idColaborador, servico.value, servico.label, (sucesso)=>{
                if(sucesso){
                    console.log(chamadasBemSucedidas);
                    chamadasBemSucedidas++;
                    console.log('[LOGS] - Serviço', chamadasBemSucedidas + ' de ', listaServicosSelecionados.length + "favoritado!")
                }
                else{
                    console.log("[LOGS] - Erro em FavoritarServicoColaborador. Serviço que deu problema: " + {servico});
                    callback(false);
                }
                console.log('Serviço', chamadasBemSucedidas + 'total ', listaServicosSelecionados.length)
                if(chamadasBemSucedidas === totalChamadas){
                    console.log('[LOGS] - Sucesso JOB FavoritarServicos!');
                    callback(true);
                }
            }
            )
        }
           
        });
    }

    function ServicoColaboradorItem(item){
        return (
            <List.Item
              style={{margin:10}} // alterar para colocar mais estilo nisso aqui, agr to sem ideia
              title={item.value}
            />
          )
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                {/* NOME COLABORADOR */}
                <TextInput
                    label='Nome Colaborador'
                    value={nome} 
                    onChangeText={setNome} 
                    theme={{
                        colors:'#006699',
                    }}
                    style={styles.inputFormulario}
                />

                {/* DESCRICAO COLABORADOR */}
                <TextInput
                    label='Função'
                    value={funcao} 
                    onChangeText={setFuncao} 
                    theme={{
                        colors:'#006699',
                    }}
                    style={styles.inputFormulario}
                />

                {/*LISTA DE SERVIÇOS PREFERIDOS DO COLABORADOR*/}
                {/* -----------------------bloco de código aposentado---------------------------- */}
                {/* {edicaoCadastro ?
                (
                    <View>
                        <List.Accordion 
                            title="Serviços Favoritos"
                            id="servicosColaboradorAccordion"
                            titleStyle={{color:'#fff'}}
                            style={styles.servicosPreferidos}
                        >
                        {listaServicosPreferidos.length === 0 
                        ?
                        <View>
                            <Text style={{alignSelf: 'center'}}>
                                Este colaborador não possui serviços preferidos
                            </Text> 
                        </View>
                        : 
                        <FlatList
                            data={listaServicosPreferidos}
                            keyExtractor={(item) => item.key.toString()}
                            renderItem={({ item }) => (
                                ServicoColaboradorItem(item)
                            )}
                        /> }
                        
                        </List.Accordion>
                    </View>
                )
                :
                console.log("Edição de um cadastro")
                }    */}
                {/* --------------------------------------------------- */}

                {/* PERMITIR VINCULAR(FAVORITAR) AO COLABORADOR SERVIÇOS QUE ESTEJAM ASSOCIADOS AO ESTABELECIMENTO */}
                {/* --------------------------------------------------- */}                
                {/*
                COMPONENTE APOSENTADO
                <MultipleSelectList
                    placeholder= {listaServicosEstabelecimento.length === 0 ? "Sem serviços para favoritar": "Favoritar serviços ao colaborador" }
                    //searchPlaceholder="Favoritar Serviços ao Colaborador"
                    
                    //valores já estão sendo trazidos no GetServicosEstabelecimento os valores idServico as key e nomeServico as value
                    data={listaServicosEstabelecimento} 
                    value={listaServicosEstabelecimento} 
                    
                    save="value"//chave para associar item selecionado com o serviço em si
                    maxHeight={280}
                    dropdownShown={isOpen}
                    // onChange={(selectedItems) => setListaServicosSelecionados(selectedItems)}  //tava funcionando essa bagaça aqui não
                    setSelected={(val) => {
                        if (listaServicosEstabelecimento.length !== 0) {
                        setListaServicosSelecionados(val);
                        }
                    }}
                /> */}
                
                {/*
                BLOCO DE DEBUG */}
                {/* {console.log("Servicos do colaborador - listaServicosSelecionados", listaServicosSelecionados)} */}
                {/* {console.log("Servicos do colaborador - listaServicosPreferidos individual", listaServicosPreferidos.map((servico)=>servico.label))} */}
                {/* {console.log("Servicos do colaborador - listaServicosSelecionados", listaServicosSelecionados)}  */}

                {/* Componente utilizado para trazer o serviços, tanto os preferidos quanto os não preferidos */}
                <DropDownPicker
                    // disabled={true}
                    placeholder='Serviços Preferidos do Colaborador'
                    items={listaServicosEstabelecimento}
                    open={isOpen}
                    setOpen={() => setIsOpen(!isOpen)}
                    // value={listaServicosPreferidos.map((servico)=>servico.value)}
                    value={listaServicosSelecionados}
                    setValue={(val) => {
                        if (listaServicosEstabelecimento.length !== 0) {
                            setListaServicosSelecionados(val);
                        }}
                    }
                    maxHeight={maxHeight}
                    autoScroll
                    dropDownDirection='BOTTOM'
                    //define que pode selecionar multiplos serviços.
                    multiple={true}
                    min={0}
                    max={{max}}
                    mode='BADGE'
                    
                />


                
                
                {/* --------------------------------------------------- */}

                {/* BOTAO DE EDICAO/CADASTRO */}
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.btn} onPress={edicaoCadastro ? SalvarEdicao : CriarColaborador}>
                        <View style={styles.btnContainer}>
                            {/* <FontAwesome5 name="plus" size={28} color="#fff" /> */}
                            <Text style={styles.btnText}>{edicaoCadastro ? 'Salvar Edição' : 'Criar Colaborador'}</Text> 
                        </View>
                    </TouchableOpacity>
                </View>
            </View> 
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
      },
    inputContainer: {
        flex: 1,
        padding: 20,
        //paddingBottom: 80, // Ajuste o valor conforme necessário
    },
    inputFormulario: {
        marginTop:20,
        marginLeft:15, 
        marginRight:15, 
        marginBottom:20, 
        backgroundColor: 'rgba(112, 120, 147, 0.3)',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#006699',
       // padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
      },
    btnContainer: {
        flexDirection: "row", // Alinha os filhos (ícone e texto) lado a lado
        alignItems: "center", // Alinha verticalmente ao centro
      },
    
    btn:
    {
        backgroundColor:'#006699',
        marginTop:5,
        marginLeft:10,
        marginRight:10,
        padding:10,
        borderRadius:5
    },
    btnText:
    {
        color:'#ffff',
        fontSize:20,
        alignSelf:'center',
        fontFamily:'Rubik_700Bold'
    },
    servicosPreferidos:
    {
        marginTop:20,
        marginLeft:20,
        marginRight:20,
        padding:20,
        backgroundColor:'#006699', 
        borderRadius:3
    }
});