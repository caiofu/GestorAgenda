import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { BackupTabela, CreateTables, ExcluirTodasAsTabelas, RestaurarBanco, ListaTodasTabelas } from '../SQLiteManager/SQLiteManager';
import { ConsultaEstabelecimento } from '../SQLiteManager/SQLEstabelecimento';
import * as DocumentPicker from 'expo-document-picker';
import { guardaWizardAtivo, houvePrimeiroAcesso, removerAsyncStorage } from '../AsyncStorage/AsyncStorage';
import { ConsultaRamoAtividade } from '../SQLiteManager/SQLRamoAtividade';
//RESTART
import * as Updates from 'expo-updates';
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
                await ClearData( async (resultado)=>{
                    if(resultado){
                        //Restauração dos Dados
                        // console.log("Arquivo: ", arquivo);
                        // console.log("Assets: ", arquivo.assets);
                        // console.log("URI: ", arquivo.assets[0].uri);
                        console.log("Aqui");
                        await RestoreData(arquivo.assets[0].uri);

                        console.log("RealodAsync!!!");
                        // Retornar à tela inicial 
                        await Updates.reloadAsync();
                    }
                    else{
                        console.log("[LOGS] RestoreBackup - Falha na etapa de limpeza dos dados!");
                    }
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
        console.log("[LOGS] ClearData - Erro ao limpar os dados: ", error);
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
        await RestaurarBanco(dataJson.sqlite)
        .then (async ()=>{
            // console.log("SQLite: ", dataJson.sqlite);
            await FillAsyncStorage(dataJson.asyncStorage);
        })
        .then(async()=>{
            // console.log("Logo: ", dataJson.logo)
            await RestaurarLogo(dataJson.logo);
        })
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

async function RestaurarLogo(logo){
    try {
    await new Promise((resolve, reject) => {
        let nomeLogo = null;
        ConsultaEstabelecimento((estabelecimento)=>{
            console.log("Estabelecimento: ", estabelecimento);
            if(estabelecimento){
                console.log(estabelecimento);
                console.log(estabelecimento.logo);
                nomeLogo = estabelecimento.logo.split('/').pop();
            }
            resolve(nomeLogo);
        })
    })
    .then (async (nomeLogo) =>{
        let destino;
        if (logo !== null && logo !== "null" && nomeLogo !== null && nomeLogo !== "null") 
        {
            ConvertBase64ToJPEG(logo, async (caminhoTemp)=>{
                console.log(caminhoTemp);
                console.log(nomeLogo);
                // const nomeImagem = caminhoTemp.split('/').pop();
                const origem = caminhoTemp;
                const pastaLogoUsuario = `${FileSystem.documentDirectory}logoUsuario/`;
                destino = `${pastaLogoUsuario}${nomeLogo}`;
            
                // Cria a pasta "logoUsuario" se não existir
                const pastaInfo = FileSystem.getInfoAsync(pastaLogoUsuario);
                if (!pastaInfo.exists) {
                    await FileSystem.makeDirectoryAsync(pastaLogoUsuario);
                }
            
                await FileSystem.moveAsync({
                from: origem,
                to: destino,
                });
                console.log('[LOGS] RestaurarLogo - Imagem salva em: ', destino);
            });
        } else {
        console.log('[LOGS] RestaurarLogo - Não há imagem a ser salva!');
        }
    }) 
    } catch (error) {
        console.error('[LOGS] RestaurarLogo  - Erro ao restaurar logo:', error);
    }
}

async function ConvertBase64ToJPEG(image64String, callback){
    const caminhoTemp = `${FileSystem.cacheDirectory}tempLogo.jpeg`;
    try {
      await FileSystem.writeAsStringAsync(caminhoTemp, image64String, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('Imagem convertida para PNG com sucesso!');
      callback(caminhoTemp);
    } catch (error) {
      console.log('Erro ao converter a imagem para PNG: ', error);
      callback(error);
    }
}