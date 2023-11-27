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

  export function ConsultaRetornaIdRamoAtividade(nomeRamoAtividade, callback) {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT idRamoAtividade FROM ramoAtividade WHERE nomeAtividade = ?',
        [nomeRamoAtividade],
        (tx, results) => {
          console.log(nomeRamoAtividade);
          console.log(results);
          if (results.rows.length > 0) {
            const row = results.rows.item(0); // Pega apenas o primeiro resultado
            const idRamoAtividade = row.idRamoAtividade;
            // Chame a função de retorno (callback) com o ID do ramo de atividade
            callback(idRamoAtividade);
          } else {
            // Se não houver resultados, chame o callback com null ou algum valor indicando que não foi encontrado
            callback(null);
          }
        },
        (error) => {
          console.error('Erro ao executar consulta por rammo de atividade:', error);
          // Chame o callback com erro, se desejar
          callback(error);
        }
      );
    });
  }
  