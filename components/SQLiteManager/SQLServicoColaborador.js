import * as SQLite from 'expo-sqlite';
const dbName = 'gestorAgenda.db';
const db = SQLite.openDatabase(dbName);

export function GetServicosEstabelecimento(idColaborador, callback, errorCallback) {
    console.log('ID DO COLABORADOOOOOR');
    console.log(idColaborador);
    if(!idColaborador){ //retorna todos os serviços vinculados ao estabelecimento
      console.log('não cai aqui');
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
    else{ //RETORNA SOMENTE OS SERVIÇOS VINCULADOS AO ESTABELECIMENTO MAS QUE NÃO ESTEJAM NA TABELA servicoColaborador
      console.log('ta caindo aqui');
      db.transaction((tx) => {
        tx.executeSql('SELECT idServicoCustomizado as key, nomeServico as value FROM servicos_customizado WHERE ativo = 1 AND idServicoCustomizado NOT IN (SELECT idServico FROM servicoColaborador WHERE idColaborador = ? ) UNION SELECT idServico as key, nomeServico as value FROM servicos WHERE ativo = 1 AND idServico NOT IN (SELECT idServico FROM servicoColaborador WHERE idColaborador = ?);', 
        //tx.executeSql('SELECT idServico as key, nomeServico as value FROM servicos WHERE ativo = 1 AND idServico NOT IN (SELECT idServico FROM servicoColaborador WHERE idColaborador = ?);', 
        [idColaborador, idColaborador], (tx, results) => 
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
}

export function GetServicosColaborador(idColaborador, callback) {
  console.log('idColaborador dentro do GetServicosColaborador');
  console.log(idColaborador);
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT id as key, nomeServico as value FROM servicoColaborador WHERE idColaborador = ?',
      [idColaborador],
      (tx, results) => {
        const rows = results.rows;
        const servicosArray = [];
        console.log("linhas de retorno dos serviços vinculados ao colaborador: " + results.rows);
        for (let i = 0; i < rows.length; i++) {
          console.log(rows.item(i));
          servicosArray.push(rows.item(i));
        }

        if (servicosArray.length > 0) {
          console.log("Servicos vinculados ao colaborador" + servicosArray);
          callback(servicosArray);
        } else {
          console.log('caindo no else da validação do tamanho de servicosArray - SqliteServicoColaborador');
          callback(servicosArray);
        }
      },
      (error) => {
        console.log("Erro na consulta SQL servicoColaborador: " + error.message);
      }
    );
  },
  (error) => {
    console.log("Erro na transação SQL servicoColaborador: " + error.message);
  });
}


export function FavoritarServicoColaborador(idColaborador, idServico, nomeServico, callback){
  console.log("Ta entrando nessa misera de favoritar servico colaborador");
    db.transaction((tx)=>{
      tx.executeSql(
        'INSERT INTO servicoColaborador (idColaborador, idServico, nomeServico) VALUES (?, ?, ?)',
        [idColaborador, idServico, nomeServico],
        (tx, results) => {
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaah deu certooooooooooo");
          callback(true);
        },
        (() =>{
          callback(false);
        })
      );
    },
    ()=>{
      console.log("deu ruim demais");
    }
    );
    
}

