import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { BackupTabela, CreateTables, ExcluirTodasAsTabelas, RestaurarBanco, ListaTodasTabelas } from '../SQLiteManager/SQLiteManager';
import { ConsultaEstabelecimento } from '../SQLiteManager/SQLEstabelecimento';
import * as DocumentPicker from 'expo-document-picker';
import { guardaWizardAtivo, houvePrimeiroAcesso, removerAsyncStorage } from '../AsyncStorage/AsyncStorage';
import { ConsultaRamoAtividade } from '../SQLiteManager/SQLRamoAtividade';

const db = SQLite.openDatabase('gestorAgenda.db');

export default async function RestoreBackup() {
    try {
        let arquivo = await DocumentPicker.getDocumentAsync({
          type: 'application/json', //só permite que seja selecionado arquivos .json
          copyToCacheDirectory: true //joga direto pro cacheDirectory para que o FileSystem consiga usar ele
        });

        if(arquivo.canceled === false){
            //console.log(arquivo);
            //Nesta etapa deve ser inserido uma validação do arquivo JSON
            //validar se no arquivo json há uma propridade chamada KEY que possui um valor criptografado criado pela aplicação
            //deve ser calculado esta key novamente e comparada com a KEY do arquivo JSON

            //Como o restore pode estar sendo feito numa situação em que o usuário já efetuou o primeiro acesso, podendo haver alguns dados salvos,
            //será necessário zerar async, sqlite e foto, para depois carregar os dados a partir do arquivo de backup.
            //Podemos verificar a chave "Primeiro Acesso" do AsyncStorage, pois daí o RestoreBackup também pode ser usado no primeiro Acesso do app,
            //caso o usuário possua um arquivo de Backup.
                
            if(houvePrimeiroAcesso){
                //excluir registros e efetuar restore
                await ClearData((resultado)=>{
                    if(resultado){
                        //Restauração dos Dados
                        // console.log("Arquivo: ", arquivo);
                        // console.log("Assets: ", arquivo.assets);
                        // console.log("URI: ", arquivo.assets[0].uri);
                        console.log("Aqui");
                        RestoreData(arquivo.assets[0].uri);
                    }
                    else{
                        console.log("[LOGS] RestoreBackup - Falha na etapa de limpeza dos dados!");
                    }
                    console.log("aqui2");
                });

                
            }
            else {
                RestoreData(arquivo.assets[0].uri);
            }
        }
        else{
            console.log("[LOGS] RestoreBackup - Seleção de arquivo de Backup Cancelado!");
        }
        
    }
    catch{
        console.log("[LOGS] RestoreBackup - Erro ao selecionar arquivo de Backup!");
    }
    //const backupObj = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'GestorAgendaBackup.json');
}
async function ClearData(callback){
    try{
        removerAsyncStorage();
        ExcluirTodasAsTabelas();
        callback(true);   
    }
    catch(error){
        console.log("LOGS] ClearData - Erro ao limpar os dados: ", error);
        callback(false);
    }
    
}
async function RestoreData(uri){
    try{
        console.log(uri)
        const data = await FileSystem.readAsStringAsync(uri);
        const dataJson = JSON.parse(data);
        //console.log("Dados JSON: ", dataJson);

        //console.log("AsyncStorage: ", dataJson.asyncStorage),
        await FillAsyncStorage(dataJson.asyncStorage);

        // console.log("SQLite: ", dataJson.sqlite);
        await RestaurarBanco(dataJson.sqlite);

        // console.log("Logo: ", dataJson.logo)
    }
    catch(error){
        console.log("Erro ao Restaurar Dados: ", error);
    }
   
}

async function FillAsyncStorage(asyncStorage){
    try {
        for (const [chave, valor] of asyncStorage) {
            console.log(chave, valor);
          await AsyncStorage.setItem(chave, valor);
        }
        console.log('[LOGS] FillAsyncStorage - Valores inseridos com sucesso no AsyncStorage!');
    } catch (error) {
    console.error('[LOGS] FillAsyncStorage - Erro ao inserir valores no AsyncStorage:', error);
    }
}

    
