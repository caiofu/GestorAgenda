import { ScrollView, View, TouchableOpacity, Text, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Switch, Checkbox, Dialog, Portal, Button, PaperProvider, TextInput, HelperText } from 'react-native-paper';
import { useState, useEffect } from "react";
import styles from "./StyleConfiguracoes";
import darkTheme from '../../Tema/darkTheme';
import lightTheme from '../../Tema/lightTheme';
import { FontAwesome } from '@expo/vector-icons';
import { DarkTheme, useNavigation } from "@react-navigation/native";

//Trabalhar com arquivos e diretórios da aplicação
import * as FileSystem from 'expo-file-system';

//RESTART
import * as Updates from 'expo-updates';

//SQLITE
import { ExcluirTodasAsTabelas } from "../SQLiteManager/SQLiteManager";

//ASYNC
import { RemoveTemaAsync, removerAsyncStorage, guardaWizardAtivo, SalvaTema, setUsaTemaSistema, getUsaTemaSistema } from "../AsyncStorage/AsyncStorage";
//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";
import { color } from "react-native-elements/dist/helpers";

//BACKUP & RESTORE
import CreateBackup from "../Backup/Backup";
import RestoreBackup from "../Backup/Restore";

export default function Configuracoes() {

//Tema
const { tema, MudarTema, temaPadraoSistema, setTemaPadraoSistema, usaTemaSistemaAsyncStorage, setUsaTemaSistemaAsyncStorage } = useAppState();
    
console.log("usaTemaSistemaAsyncStorage: ", usaTemaSistemaAsyncStorage);
 //COR DO TEMA
 const [corTema, setCorTema] = useState('#006699');
 useEffect(()=>{

    tema === 'light' ? setCorTema('#006699') : setCorTema(DarkTheme.colors.text);
      },[tema])
    const [darkModeOn, setDarkModeOn] = useState(tema === 'dark' ? true : false);

    function AtivarDarkMode() {
        setDarkModeOn(!darkModeOn);
        MudarTema();
    }

    //Tema do sistema
    const [temaSistema, setTemaSistema] = useState(usaTemaSistemaAsyncStorage === 'true' ? 'checked' : 'unchecked');
    const [desativaSwitch, setDesativaSwitch] = useState(usaTemaSistemaAsyncStorage === 'true' ? false : true);

    useEffect(() => {
        if (temaSistema === 'checked') {
            setTemaPadraoSistema(true);
            setDesativaSwitch(true);
        }
        else {
            setTemaPadraoSistema(false);
            setDesativaSwitch(false);
        }
    }, [usaTemaSistemaAsyncStorage]);

    useEffect(() => {
        getUsaTemaSistema().then(ret => {
            setUsaTemaSistemaAsyncStorage(ret);
        });
    }, [temaSistema, usaTemaSistemaAsyncStorage]);

    function MudaTemaSitema() {
        if (temaSistema === 'checked') {
            setTemaSistema('unchecked');
            setUsaTemaSistema('false');
            setDesativaSwitch(false);
            // console.log("Entrou no if - 111");
        }
        else //Padrao do sistema operacional
        {
            setTemaSistema('checked');
            setUsaTemaSistema('true');

            setTemaPadraoSistema(true);
            setDesativaSwitch(true);

        //Excluir async
        RemoveTemaAsync();
       }
    }

    /*----------------------------------------------------------*/
    // Restauração de Dados Padrão de Fábrica
    /*----------------------------------------------------------*/
    // States de Restauração de Dados
    const [msgDialog, setMsgDialog ] = useState(false);
    const [textoConfirmacao, setTextoConfirmacao] = useState('');
    const [msgHelper, setMsgHelper] = useState(false);
    const handleChangeTextoConfirmacao = (novoTexto) => {
        setTextoConfirmacao(novoTexto);
    };

    async function RestaurarPadroes() {
        if (textoConfirmacao === 'CONFIRMAR') {
            removerAsyncStorage();
            guardaWizardAtivo('true');
            ExcluirTodasAsTabelas();
        
            // Força uma atualização
            await Updates.reloadAsync();
        } else {
            setMsgHelper(true);
        }
    }
    /*----------------------------------------------------------*/
    // Restauração de Dados Padrão de Fábrica
    /*----------------------------------------------------------*/

    /*----------------------------------------------------------*/
    // Backup de Dados
    /*----------------------------------------------------------*/
    // Confirmação de Backup
    // States de Confirmação de Backup
    const [msgConfirmacaoVisivel, setMsgConfirmacaoVisivel] = useState(false);
    const [dialogTitulo, setDialogTitulo] = useState("");
    const [dialogMensagem,setDialogMensagem] = useState(""); 
    
    function ConfirmarBackup() {
        setMsgConfirmacaoVisivel(true);
        setDialogTitulo("Deseja efetuar Backup da aplicação?");
        setDialogMensagem("Este processo irá salvar todos os dados da aplicação em um arquivo de Backup!");
    }

    // Processo de Backup
    async function EfetuarBackup(){
        setMsgConfirmacaoVisivel(false);
        CreateBackup((retorno) =>{
            // console.log("Retorno: ", retorno);
            retorno 
            ? 
                MsgRetorno("Finalizando processo de Backup!") 
            : 
                async ()=>{
                    const caminhoBackup = FileSystem.documentDirectory + 'GestorAgendaBackup.json';
                    if(caminhoBackup.exists){
                        console.log("Excluindo arquivo de Backup");
                        await FileSystem.deleteAsync(caminhoBackup);
                    }
                    MsgRetorno("Backup cancelado!");
                }
        });
    }
    
    // Pós ação de Backup
    /*----------------------------------------------------------*/
    // States de retorno 
    const [boxVisivel, setBoxVisivel] = useState(false);
    const [boxDialogSucesso, setBoxDialogSucesso] = useState(false);
    const [TextoBoxDialog, setTextoBoxDialog] = useState("");

    // Controla mensagem de retorno após clicar em Backup
    const MsgRetorno = (msg)=>{
        setBoxVisivel(true);
            setTextoBoxDialog(msg);
            setBoxDialogSucesso(true);
            let progresso = 0;
            const intervalo =  setInterval(() =>{
                if(progresso >= 1){
                    clearInterval(intervalo);
                    setBoxVisivel(false);
                }
                else progresso += 0.1;
            }, 200);
    }
    /*----------------------------------------------------------*/
    // Backup de Dados
    /*----------------------------------------------------------*/

    return(
        <PaperProvider>
          <Portal>
            <SafeAreaView>
                <ScrollView>
                        <View style={styles.Container}>
                            <Checkbox
                                status={temaSistema}
                                onPress={() => {MudaTemaSitema()}}
                                color={tema === 'light' ? '#006699' : ''}
                                uncheckedColor={tema === 'light' ? '' : '#fff'}
                            />
                            <Text style={[styles.txtSwitchTema, {color: tema === 'light' ? lightTheme.textColor : darkTheme.textColor}  ]}>Usar tema do Sistema</Text>
                        </View>
                        
                        <View style={styles.linha}></View>
                        
                        <View style={[styles.Container, {backgroundColor: desativaSwitch ? '#adadadb3': null}]}>
                            <Text style={[styles.txtSwitchTema, {color: tema === 'light' ? lightTheme.textColor : darkTheme.textColor}  ]}>Tema Escuro</Text>
                            <Switch  style={styles.switch}  color= '#006699'  value={darkModeOn} onValueChange={AtivarDarkMode} disabled={desativaSwitch}></Switch>
                            <View style={{marginLeft:5}}>
                            { tema === 'light' ? <FontAwesome name="sun-o" size={24} color="#006699" /> : <FontAwesome name="moon-o" size={24} color="#fff" />}
                            </View>
                        </View>

                        <View style={styles.linha}></View>

                        <View style={styles.Container}>
                            <TouchableOpacity style={styles.btnRestaurar} onPress={() => setMsgDialog(true)}>
                                <Text style={styles.txtBtnRestaurar}>RESTAURAR PADRÕES DE FÁBRICA</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.linha, {marginBottom:20}]}></View>

                        {/* Botão de Restore */}
                        <View style={styles.Container}>
                            <TouchableOpacity onPress={RestoreBackup} style={ tema === 'light' ? styles.btn : styles.btnDark}>
                                <Text style={tema === 'light' ? styles.btnTxt : styles.btnTxtDark}>RESTORE</Text>
                            </TouchableOpacity>                      
                        </View> 

                        {/* Botão de Backup */}
                        <View style={styles.Container}>
                            <TouchableOpacity onPress={ConfirmarBackup} style={ tema === 'light' ?styles.btn : styles.btnDark}>
                                <Text style={tema === 'light' ? styles.btnTxt : styles.btnTxtDark}>BACKUP</Text>
                            </TouchableOpacity> 
                        </View>

                        {/* Confirmação ou cancelamento de Backup: */}
                        <Portal>
                            <Dialog visible={msgConfirmacaoVisivel} dismissable={false} style={tema === 'light' ? styles.dialogLight : styles.dialogDark}>
                                <Dialog.Title style={[styles.dialogTitulo, { color: corTema }]}>{dialogTitulo}</Dialog.Title>
                                <Dialog.Content>
                                    <Text variant="bodyMedium" style={[styles.dialogContent, { color: tema === 'light' ? 'black' : "#fff" }]}>{dialogMensagem}</Text>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button labelStyle={{ fontFamily: 'Rubik_700Bold', color: tema === 'light' ? '#006699' : '#fff' }} onPress={EfetuarBackup}>Confirmar</Button>
                                    <Button labelStyle={{ fontFamily: 'Rubik_700Bold', color: tema === 'light' ? '#006699' : '#fff' }} onPress={() => setMsgConfirmacaoVisivel(false)}>Cancelar</Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>

                        {/* Caixa de Dialogo do retorno do Backup */}
                        <Portal>
                            <Dialog visible={boxVisivel} style={{backgroundColor:'#fff'}}>
                                <Dialog.Content>
                                <Text style={[styles.txtBkpDialog, {color: boxDialogSucesso ? "#006699" : 'red'}]} variant="bodyMedium">{TextoBoxDialog}</Text>
                                </Dialog.Content>
                            </Dialog>
                        </Portal>
                    
                {/* <View>
                             
                </View> */}

            </ScrollView>
            </SafeAreaView>
        <Dialog visible={msgDialog} style={{backgroundColor: tema === 'light' ? '#fff' : 'black'}}>
            <Dialog.Title>
                <Text style={{color: corTema}}>Restaurar Padrão de Fábrica</Text>
            </Dialog.Title>
            <View style={[styles.linha, {marginBottom:10, borderColor: tema === 'light' ? '#006699' :'#fff'}]}></View>
            <Dialog.Content style={{alignSelf:'center'}}>
            <Text style={[styles.txtDialog, {color: corTema}]}>Esta ação apagará todos os seus dados do aplicativo</Text>
            <Text style={[styles.txtDialog, {color: corTema}]}>Se voce tem certeza digite "CONFIRMAR"</Text>
            
            {msgHelper ? <HelperText style={{color:'red', fontStyle:'italic'}}><Text>* O texto não é valido!</Text></HelperText> : ''}   
            <TextInput value={textoConfirmacao}
            onChangeText={handleChangeTextoConfirmacao} textColor={tema === 'light' ? '#fff' : 'black'}style={{backgroundColor: corTema, fontWeight:'bold', color:'#fff'}}></TextInput>

            <TouchableOpacity style={styles.btnRestaurarDialog} onPress={RestaurarPadroes}>
                <Text style={styles.txtBtnRestaurarDialog}>RESTAURAR</Text>
            </TouchableOpacity>
            </Dialog.Content>
            <View style={[styles.linha, {marginBottom:10, borderColor: tema === 'light' ? '#006699' :'#fff'}]}></View>
                <Dialog.Actions>
                {/* <Button onPress={() => console.log('Cancel')}>Sim</Button> */}
            <Button onPress={() => setMsgDialog(false)} textColor={corTema} >Cancelar</Button>
                </Dialog.Actions>
        </Dialog>
        </Portal>
        </PaperProvider>
    )
}
