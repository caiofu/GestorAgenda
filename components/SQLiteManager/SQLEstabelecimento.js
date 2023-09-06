import { SafeAreaView } from "react-native-safe-area-context";
import SQLiteManager from "./SQLiteManager";
import * as SQLite from 'expo-sqlite';

const dbName = 'gestorAgenda.db';
const db = SQLite.openDatabase(dbName);

export function InserirEstabelecimento(nome, cnpj, logo, ramoAtividade, sucessoCallback, erroCallback)
{
    db.transaction(tr => {
        tr.executeSql('INSERT INTO estabelecimento (nomeEstabelecimento , cnpj , logo , ramoAtividade ) VALUES (?, ?, ?, ?)', [nome, cnpj, logo, ramoAtividade],//O VALUES (?) é um placeholder usado para proteger o codigo contra tentativa de sql injection ele prepara a instrução
        () => {
            console.log('Empresa inserida com sucesso');
            if (sucessoCallback) sucessoCallback();
        },
        (_, error) => {
            console.error('Erro ao inserir empresa:', error);
            if (erroCallback) erroCallback();
        }
        ); 
    });
}

export function ConsultaEstabelecimento()
{
   
    db.transaction(tx =>{
        tx.executeSql('SELECT  * FROM estabelecimento', null, 
        (txtObj, resultSet)=>{
          const results = resultSet.rows._array;
          // resolve(results);
          console.log(results);
        }, 
        (txtObj, error) => {
          console.log(error);
            //reject(error)
        }
        );
        
    });
}