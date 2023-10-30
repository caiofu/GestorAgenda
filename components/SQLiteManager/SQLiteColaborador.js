import * as SQLite from 'expo-sqlite';
const dbName = 'gestorAgenda.db';
const db = SQLite.openDatabase(dbName);

// Função para buscar colaboradores no banco de dados
export function listarColaboradores(callback, errorCallback) {
  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM colaborador', [], (tx, results) => 
    {
      const rows = results.rows;
      const colaboradoresArray = [];
      
      for (let i = 0; i < rows.length; i++) {
        colaboradoresArray.push(rows.item(i));
      }
      if (colaboradoresArray.length > 0) {
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

export function CriaNovoColaborador(nomeColaborador, descricao, callback)
{
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO colaborador (nomeColaborador, descricao, ativo) VALUES (?, ?, ?)',
      [nomeColaborador, descricao, 1], 
      (tx, results) => {
        // Verificando se a inserção foi bem-sucedida
        if (results.rowsAffected > 0) {
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

export function UpdateColaboradorPorId(idColaborador, nome, funcao, callback){
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE colaborador SET nomeColaborador = ?, descricao = ? WHERE idColaborador = ?',
      [nome, funcao, idColaborador],
      (tx, results) => {
        console.log('Colaborador atualizado com sucesso (UpdateColaboradorporId)');
        callback(true);
      },
      (error) => {
        console.log('Erro ao atualizar serviço (UpdateColaboradorporId):' + error.message);
        console.log(idColaborador, nome, funcao);
        callback(false);
      }
    );
  });
  
}

export function ValidaNomeColaborador(nome, callback, errorCallback){
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT 1 from colaborador WHERE UPPER(nomeColaborador) = UPPER(?)',
      [nome],
      (tx, results)=>{
        // console.log("RETORNO ", results.rows.item(0))
        if (results.rows.length > 0){
          console.log("Já existe colaborador com este nome!");
          callback(false);
        }
        else{
          console.log("Não existe colaborador com este nome!");
          callback(true);
        } 
      },
      (error) => {
        console.log('Erro ao validar nome colaborador (ValidaNomeColaborador):' + error.message);
        callback(false);
      }
    )},
    (error) => {
      console.log('Erro na transação SQL (ValidaNomeColaborador):' + error.message);
      errorCallback(error);
    }
  )
}

export function AlteraStatusColaboradorPorId(idColaborador, ativo, callback){
  console.log('[LOGS] - AlteraStatusColaboradorPorId - IdColaborador: ', idColaborador);
  const novoAtivo = ativo ? 1 : 0;
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE colaborador SET ativo = ? WHERE idColaborador = ?',
      [novoAtivo, idColaborador],
      (tx, results) => {
        if(results.rowsAffected > 0){
          console.log("[LOGS] - Sucesso ao ativar/inativar colaborador.");
          callback(true);
        }
        else{
          console.log('[LOGS] - Fallha ao inativar colaborador.');
          callback(false);
        }
      },
      (error) => {
        console.log('Erro no UPDATE ativar/inativar colaborador:' + error.message);
        callback(false);
      }
    )},
    (error) => {
      console.log('Erro na transação SQL do UPDATE ativar/inativar colaborador:' + error.message);
      callback(false);
    }
  )
}


  