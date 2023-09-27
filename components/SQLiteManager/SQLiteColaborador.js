import * as SQLite from 'expo-sqlite';
const dbName = 'gestorAgenda.db';
const db = SQLite.openDatabase(dbName);

// Função para buscar colaboradores no banco de dados
export function listarColaboradores(callback, errorCallback) {
  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM colaborador', [], (tx, results) => 
    {
        console.log("execute -->colab")
      const rows = results.rows;
      const colaboradoresArray = [];
      
      for (let i = 0; i <= rows.length; i++) {
        colaboradoresArray.push(rows.item(i));
      }

      if (colaboradoresArray.length > 0) {
        console.log("aquiiii");
        callback(colaboradoresArray);
      } else {
        errorCallback("Nenhum colaborador encontrado.");
      }
    },
    (error) => {
      errorCallback("Erro na consulta SQL: " + error.message);
    });
  },
  (error) => {
    errorCallback("Erro na transação SQL: " + error.message);
  });
}



  