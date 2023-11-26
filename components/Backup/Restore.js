import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { backupTabela, ListaTodasTabelas } from '../SQLiteManager/SQLiteManager';
import { ConsultaEstabelecimento } from '../SQLiteManager/SQLEstabelecimento';
import * as DocumentPicker from 'expo-document-picker';

const db = SQLite.openDatabase('gestorAgenda.db');

export default async function RestoreBackup() {
    try {
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/json', //só permite que seja selecionado arquivos .json
          copyToCacheDirectory: true //joga direto pro cacheDirectory para que o FileSystem consiga usar ele
        });
        if(result.canceled === false){
            console.log(result);
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