import * as SQLite from 'expo-sqlite';

const dbName = 'gestorAgenda.db';
const db = SQLite.openDatabase(dbName);

export function ConsultaRamoAtividade(callback) 
{
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM ramoAtividade',
        [],
        (tx, results) => {
          const len = results.rows.length;
          const ramoAtividades = [];
  
          for (let i = 0; i < len; i++) {
            const row = results.rows.item(i);
            // Processar os resultados aqui, por exemplo, adicioná-los a um array
            ramoAtividades.push(row);
          }
  
          // Chame a função de retorno (callback) com os resultados
          callback(ramoAtividades);
        },
        (error) => {
          console.error('Erro ao executar consulta:', error);
        }
      );
    });
  }