import { useEffect, useState } from 'react'
import { Text, View, SafeAreaView, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { TextInput, List } from 'react-native-paper'
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { GetServicosEstabelecimento, GetServicosColaborador, FavoritarServicoColaborador } from '../SQLiteManager/SQLServicoColaborador';
import { CriaNovoColaborador, UpdateColaboradorPorId } from '../SQLiteManager/SQLiteColaborador';


export default function FormColaboradores(props) {
    const [idColaborador, setIdColaborador] = useState(null);
    const [nome, setNome] = useState('');
    const [funcao, setFuncao] = useState('');
    const [edicaoCadastro, setEdicaoCadastro] = useState(null);
    const [listaServicosEstabelecimento, setListaServicosEstabelecimento] = useState([]);
    const [listaServicosSelecionados, setListaServicosSelecionados] = useState([]);
    const [listaServicosPreferidos, setListaServicosPreferidos] = useState([]);
    const [erro, setErro] = useState(null); //estado para armazenar erros

    if(props.route.params !== undefined){
        const colaborador = props.route.params.colaborador;
        useEffect(() => {
            // console.log(route.params);
            // console.log(route.params.colaborador)
            //usado para editar o cadastro
            if(colaborador){
                setIdColaborador(colaborador.idColaborador);
                setNome(colaborador.nomeColaborador);
                setFuncao(colaborador.descricao);
                setEdicaoCadastro(true);
                GetServicosColaborador(idColaborador, (servicosColaboradorArray)=>{
                    setListaServicosPreferidos(servicosColaboradorArray);
                })  
            }
            else {
                setNome('');
                setFuncao('');
                setEdicaoCadastro(false);
            }
        }, [edicaoCadastro]);
    }

    //BUSCA SERVIÇOS VINCULADOS AO ESTABELECIMENTO
    useEffect(() => {
        GetServicosEstabelecimento(
          props.route.params.colaborador ? props.route.params.colaborador.idColaborador : null,
          (servicosArray) => {
            setListaServicosEstabelecimento(servicosArray);
            setErro(null); // Limpar erro, se houver
          },
          (error) => {
            setErro(error);
          }
        );
      }, []);

    //FINALIZAÇÃO DO PROCESSO DE CADASTRO OU EDIÇÃO DE COLABORADOR
    //Cadastro de novo colaborador
    function CriarColaborador(){
        console.log('implementar SalvarColaborador');
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
                console.log(`Inserção bem-sucedida. Novo ID: ${novoID}`);
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
                console.log('Atualização bem sucedida - dados mestre');
                console.log(listaServicosSelecionados);

                let chamadasBemSucedidas = 0;
                const totalChamadas = listaServicosSelecionados.length;

                listaServicosSelecionados.forEach((servicoSelecionado) => {
                    const servico = listaServicosEstabelecimento.find((item)=>item.value === servicoSelecionado);
                if(servico){
                    console.log("Informações do servico:");
                    console.log(servico);
                    FavoritarServicoColaborador(idColaborador, servico.key, servico.value, (sucesso)=>{
                        console.log('entrou nessa misera');
                        if(sucesso){
                            console.log(chamadasBemSucedidas);
                            chamadasBemSucedidas++;
                        }
                        else{
                            console.log("arrombado");
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

    function ServicoColaboradorItem(item){
        return (
            <List.Item
              style={{margin:10}} // alterar para colocar mais estilo nisso aqui, agr to sem ideia
              title={item.value}
            />
          )
    }

    return(
        <SafeAreaView>
            <View>
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
                {/* --------------------------------------------------- */}
                {edicaoCadastro ?
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
                }   
                {/* --------------------------------------------------- */}

                {/* PERMITIR VINCULAR MAIS SERVIÇOS QUE ESTEJAM ASSOCIADOS AO ESTABELECIMENTO */}
                {/* --------------------------------------------------- */}
                
                <MultipleSelectList
                    placeholder= {listaServicosEstabelecimento.length === 0 ? "Sem serviços para favoritar": "Favoritar serviços ao colaborador" }
                    searchPlaceholder=""
                    
                    //valores já estão sendo trazidos no GetServicosEstabelecimento os valores idServico as key e nomeServico as value
                    data={listaServicosEstabelecimento} 
                    
                    save="value"//chave para associar item selecionado com o serviço em si
                    
                    // onChange={(selectedItems) => setListaServicosSelecionados(selectedItems)}  //tava funcionando essa bagaça aqui não
                    setSelected={(val) => {
                        if (listaServicosEstabelecimento.length !== 0) {
                          setListaServicosSelecionados(val);
                        }
                      }}
                />
                
                {/* --------------------------------------------------- */}

                {/* BOTAO DE EDICAO/CADASTRO */}
                   
                {edicaoCadastro 
                ? 
                    <TouchableOpacity style={styles.btn} onPress={SalvarEdicao}>
                        <View style={styles.btnContainer}>
                        <FontAwesome5 name="save" size={28} color="#fff" />
                        <Text style={styles.btnText}>Salvar Edição</Text> 
                        </View>
                    </TouchableOpacity>
                 : 
                    <TouchableOpacity style={styles.btn} onPress={CriarColaborador}>
                        <View style={styles.btnContainer}>
                        <FontAwesome5 name="plus" size={28} color="#fff" />
                        <Text style={styles.btnText}>Criar Colaborador</Text> 
                        </View> 
                    </TouchableOpacity>
                
                }
                
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
    },
    inputFormulario: {
        marginTop:20,
        marginLeft:15, 
        marginRight:15, 
        marginBottom:20, 
        backgroundColor: 'rgba(112, 120, 147, 0.3)',
    },
    btnContainer: {
        flexDirection: "row", // Alinha os filhos (ícone e texto) lado a lado
        alignItems: "center", // Alinha verticalmente ao centro
      },
    btn:
    {
        backgroundColor:'#006699',
        marginTop:20,
        marginLeft:20,
        marginRight:20,
        padding:20,
        borderRadius:5
    },
    btnText:
    {
        color:'#ffff',
        marginLeft:10,
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