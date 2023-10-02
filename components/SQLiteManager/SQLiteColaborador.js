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
      
      for (let i = 0; i < rows.length; i++) {
        colaboradoresArray.push(rows.item(i));
      }

      if (colaboradoresArray.length > 0) {
        console.log("aquiiii");
        console.log(colaboradoresArray);
        callback(colaboradoresArray);
      } else {
        console.log('caindo aqui por isso o erro');
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

export function CriaNovoColaborador(nomeColaborador, descricao, callback)
{
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO colaborador (nomeColaborador, descricao, ativo) VALUES (?, ?, 1)',
      [nomeColaborador, descricao], 
      (tx, results) => {
        // Verificando se a inserção foi bem-sucedida
        if (results.rowsAffected > 0) {
          console.log('Inserção bem-sucedida');
          // Recuperando o ID do novo registro
          const novoID = results.insertId;
          //Função de retorno (callback) com o resultado (novoID)
          callback(novoID);
        } else {
          console.log('Falha ao inserir');
          callback(null);
        }
      },
      (error) => {
        console.log('Erro ao executar consulta:', error);
      }
    );
  });
  
}

export function UpdateColaboradorPorId(){
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE servicos SET favorito = ? WHERE idServico = ?',
      [favorito, idServico],
      (tx, results) => {
        console.log('Serviço atualizado com sucesso (UpdateFavoritoServicoPorId)');
      },
      (error) => {
        console.log('Erro ao atualizar serviço (UpdateFavoritoServicoPorId):' + error);
      }
    );
  });
  
}



  