import * as SQLite from 'expo-sqlite';
const dbName = 'gestorAgenda.db';
const db = SQLite.openDatabase(dbName);

export function GetServicosEstabelecimento(callback, errorCallback) {
    //retorna todos os serviços vinculados ao estabelecimento
    db.transaction((tx) => {
        tx.executeSql('SELECT idServicoCustomizado as value, nomeServico as label FROM servicos_customizado WHERE ativo = 1 UNION ALL SELECT idServico as value, nomeServico as label FROM servicos WHERE ativo = 1;', 
        [], (tx, results) => 
        {
          const rows = results.rows;
          const servicosArray = [];
          // console.log("linhas de retorno dos serviços: ",results.rows);
          for (let i = 0; i < rows.length; i++) {
            // console.log(rows.item(i));
            servicosArray.push(rows.item(i));
          }
    
          if (servicosArray.length > 0) {
            console.log("[LOGS] - Servicos vinculados ao estabelecimento", servicosArray);
            callback(servicosArray);
          } else {
            console.log('[LOGS] - Não há serviços vinculados ao estabelecimento');
            callback(servicosArray);
          }
        },
        (error) => {
          errorCallback("Erro na consulta SQL: ", error.message);
        });
      },
      (error) => {
        errorCallback("Erro na transação SQL: ", error.message);
      });
}

export function GetServicosColaborador(idColaborador, callback) {
  console.log('[LOGS] GetServicosColaborador - idColaborador: ', idColaborador);
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT idServico as value, nomeServico as label FROM servicoColaborador WHERE idColaborador = ?',
      [idColaborador],
      (tx, results) => {
        const rows = results.rows;
        const servicosArray = [];
        for (let i = 0; i < rows.length; i++) {
          servicosArray.push(rows.item(i));
        }

        if (servicosArray.length > 0) {
          console.log("[LOGS] - Servicos vinculados ao colaborador", servicosArray);
          callback(servicosArray);
        } else {
          console.log('[LOGS] - Colaborador não possui serviços favoritos');
          callback(servicosArray);
        }
      },
      (error) => {
        console.log("Erro na consulta SQL servicoColaborador: ", error.message);
      }
    );
  },
  (error) => {
    console.log("Erro na transação SQL servicoColaborador: " + error.message);
  });
}


export function FavoritarServicoColaborador(idColaborador, idServico, nomeServico, callback){
    db.transaction((tx)=>{
      tx.executeSql(
        'INSERT INTO servicoColaborador (idColaborador, idServico, nomeServico) VALUES (?, ?, ?)',
        [idColaborador, idServico, nomeServico],
        (tx, results) => {
          console.log("[LOGS] - Serviço Favoritado.");
          callback(true);
        },
        (() =>{
          console.log('[LOGS] - Erro ao favoritar Serviço')
          callback(false);
        })
      );
    },
    (error)=>{
      console.log("[LOGS] - Erro na transação SQL: ", error.message);
    }
    );
    
}

export function DesfavoritarServicoColaborador(idColaborador, idServico, callback){
    console.log("LOGS] - DesfavoritarServicoColaborador - idColaborador: ", idColaborador);
    db.transaction((tx)=>{
      tx.executeSql(
        'DELETE FROM servicoColaborador WHERE idColaborador = ? AND idServico = ?',
        [idColaborador, idServico],
        (tx, results) => {
          console.log("[LOGS] - Serviço Desfavoritado.");
          callback(true);
        },
        (() =>{
          console.log('[LOGS] - Erro ao desfavoritar Serviço')
          callback(false);
        })
      );
    },
    (error)=>{
      console.log("[LOGS] - Erro na transação SQL: ", error.message);
    }
    )
}

