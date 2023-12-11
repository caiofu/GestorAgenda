import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { BackupTabela, ListaTodasTabelas } from '../SQLiteManager/SQLiteManager';
import { ConsultaEstabelecimento } from '../SQLiteManager/SQLEstabelecimento';
import { shareAsync } from 'expo-sharing';

const db = SQLite.openDatabase('gestorAgenda.db');

export default async function CreateBackup(callback) {

  // Criação do objeto de Backup
  let backupObj = {
    asyncStorage: null,
    sqlite: null,
    logo: null,
  }
  try {
    // Inserção do asyncStorage no objeto de backup
    await encodeAsyncStorage(backupObj);

    // // Inserção do Sqlite no objeto de backup
    await encodeSQlite(backupObj);

    // // Inserção do Sqlte no objeto de backup
    await encodeLogo(backupObj);

    await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'GestorAgendaBackup.json', JSON.stringify(backupObj));
    const sucesso = await salvar(FileSystem.documentDirectory + 'GestorAgendaBackup.json');

    if(sucesso){
      console.log('[LOGS] - Backup criado e compartilhado com sucesso!');
      console.log("Lista de Arquivos no Diretórios de Arquivos da Aplicação: ", await FileSystem.readDirectoryAsync(FileSystem.documentDirectory));
      callback(true);
    }
    else callback(false)
    
  } catch (error) {
    console.error('Erro ao criar o backup:', error);
    callback(false);
  }
};

const salvar = async (uri) => {
  if(uri === null){
    console.log("[LOGS] Caminho fornecido é NULL!");
    return false;
  }
  else{
    try{
      await shareAsync(uri);
      console.log("[LOGS] Backup foi salvo!");
      return true
    }
    catch(error){
      console.log("[LOGS] Backup não foi salvo!");
      return false
    }
    
  } 
}

async function encodeAsyncStorage(backupObj){
  backupObj.asyncStorage = await AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiGet(keys));

  console.log("[LOGS] encodeAsyncStorage - Encode do AsyncStorage feito com sucesso!");
}

async function encodeSQlite(backupObj){
    backupObj.sqlite = {
      colaborador: await BackupTabela('colaborador'),
      ramoAtividade: await BackupTabela('ramoAtividade'),
      estabelecimento: await BackupTabela('estabelecimento'),
      servicos: await BackupTabela('servicos'),
      servicos_customizado: await BackupTabela('servicos_customizado'),
      servicoColaborador: await BackupTabela('servicoColaborador'),
      agendamento: await BackupTabela('agendamento'),
      agendamento_servicos: await BackupTabela('agendamento_servicos'),
      agendamento_colaborador: await BackupTabela('agendamento_colaborador')
    }
    console.log("[LOGS] encodeSQlite - Encode do SQlite feito com sucesso!");
  }

async function encodeLogo(backupObj){
  await new Promise((resolve, reject) => {
    let logo;
    ConsultaEstabelecimento((estabelecimento)=> {
      //console.log("Estabelecimento: ", estabelecimento);
      if(estabelecimento !== null){
        logo = estabelecimento.logo;
        resolve(logo);
      }
      else reject(estabelecimento);
    })
  })
  .then(async (imagem)=>{
    const bytesDaImagem = await FileSystem.readAsStringAsync(imagem, {
    encoding: FileSystem.EncodingType.Base64,
    });
    backupObj.logo = bytesDaImagem;
    console.log("[LOGS] encodeLogo - Encode da imagem feita com sucesso!");
    //callback(true);
  })
  .catch(()=>{
    console.log("[LOGS] encodeLogo - Estabelecimento sem logotipo ou ocorreu um erro ao obtê-lo!");
    //callback(false);
  })
}

