
import * as SQLite from 'expo-sqlite';

const dbName = 'gestorAgenda.db';
const db = SQLite.openDatabase(dbName);

export function InserirEstabelecimento(nome, cnpj, logo, ramoAtividade, tipoAcao, id) 
{
   
    if(tipoAcao === 'insercao')
    {
      query ='INSERT INTO estabelecimento (nomeEstabelecimento , cnpj , logo , ramoAtividade ) VALUES (?, ?, ?, ?)' ;
      
    }
    else if (tipoAcao === 'atualizacao')
    {
      query = 'UPDATE estabelecimento SET nomeEstabelecimento = ?, cnpj = ?, logo = ?, ramoAtividade = ? WHERE idEstabelecimento = ?';
    }
    return new Promise((resolve, reject) => {
      db.transaction(
        (tr) => {
        
          tr.executeSql(
            query,
            tipoAcao === 'insercao' ?[nome, cnpj, logo, ramoAtividade] :[nome, cnpj, logo, ramoAtividade, id],
            () => {
              // console.log('Empresa inserida com sucesso');
              resolve(true); // Resolve a Promise com sucesso
            },
            (_, error) => {
              console.error('Erro ao inserir empresa:', error);
              reject(error); // Rejeita a Promise com o erro
            }
          );
        },
        (transactionError) => {
          console.error('Erro na transação:', transactionError);
          reject(transactionError); // Rejeita a Promise com o erro de transação
        }
      );
    });
  }
  


export function ConsultaEstabelecimento(callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM estabelecimento  LIMIT 1', // Adicione "LIMIT 1" para retornar apenas um resultado
      [],
      (tx, results) => {
        if (results.rows.length > 0) {
          // Se houver pelo menos um resultado, pegue o primeiro
          const row = results.rows.item(0);
          // Chame a função de retorno (callback) com o resultado
          // console.log(row)
          callback(row);
        } else {
          // Se não houver resultados, chame a função de retorno com null (ou outra marcação apropriada)
          callback(null);
        }
      },
      (error) => {
        // console.log('Erro ao executar consulta:');
        
      }
    );
  });
}






