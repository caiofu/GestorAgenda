import * as SQLite from 'expo-sqlite';
const dbName = 'gestorAgenda.db';
const db = SQLite.openDatabase(dbName);

export function GetServicosEstabelecimento(callback, errorCallback) {
    db.transaction((tx) => {
        tx.executeSql('SELECT idServicoCustomizado as key, nomeServico as value FROM servicos_customizado WHERE ativo = 1 UNION ALL SELECT idServico as key, nomeServico as value FROM servicos WHERE ativo = 1;', 
        [], (tx, results) => 
        {
          const rows = results.rows;
          const servicosArray = [];
          console.log("linhas de retorno dos serviços: " + results.rows);
          for (let i = 0; i < rows.length; i++) {
            console.log(rows.item(i));
            servicosArray.push(rows.item(i));
          }
    
          if (servicosArray.length > 0) {
            console.log("Servicos vinculados ao estabelecimento" + servicosArray);
            callback(servicosArray);
          } else {
            console.log('caindo no else da validação do tamanho de servicosArray - sqliteServicos');
            callback(servicosArray);
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


export function SalvarServicoColaborador(){
    console.log("Implementar SalvarServicoColaborador");
}

