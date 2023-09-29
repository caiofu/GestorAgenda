import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('gestorAgenda.db');

export function GetServicosPorRamo(idRamoAtividade, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM servicos where idRamoAtividade = ?',
      [idRamoAtividade],
      (tx, results) => {
        console.log('lengs ->',results.rows.length)
        const len = results.rows.length;
        const servicos = [];

        for (let i = 0; i < len; i++) {
          const row = results.rows.item(i);
          servicos.push(row);
          console.log('row --->', row)
        }
        console.log('Dentro de servicos: ' + servicos[0])
        callback(servicos);
      },
      (error) => {
        console.log('Erro ao executar consulta (servicos):' + error);
      }
    );
  });
}

export function GetServicosPorId(idServico, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM servicos where idServico = ?',
      [idServico],
      (tx, results) => {
        console.log('lengs ->',results.rows.length)
        const len = results.rows.length;
        servico = results.rows.item(0);
        callback(servico);
      },
      (error) => {
        console.log('Erro ao extrair serviço por ID (servicos):' + error);
      }
    );
  });
}

export function UpdateAtivoServico (nomeServico, ativo, idRamoAtividade) {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE servicos SET ativo = ? WHERE nomeServico = ? and idRamoAtividade = ?',
      [ativo, nomeServico, idRamoAtividade],
      (tx, results) => {
        console.log('Serviço atualizado com sucesso.');
      },
      (error) => {
        console.log('Erro ao atualizar serviço:' + error);
      }
    );
  });
}

export function UpdateAtivoServicoPorId (idServico, campoAtivo) {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE servicos SET ativo = ? WHERE idServico = ?',
      [campoAtivo, idServico],
      (tx, results) => {
        console.log('Serviço atualizado com sucesso (UpdateAtivoServicoPorId)');
      },
      (error) => {
        console.log('Erro ao atualizar serviço (UpdateAtivoServicoPorId):' + error);
      }
    );
  });
}

export function UpdateServicoPorId (idServico, nome, descricao) {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE servicos SET nomeServico = ? WHERE idServico = ?',
      [nome, idServico],
      (tx, results) => {
        console.log('Serviço atualizado com sucesso (Update nome)');
      },
      (error) => {
        console.log('Erro ao atualizar serviço (Update nome):' + error);
      }
    );

    tx.executeSql(
      'UPDATE servicos SET descricao = ? WHERE idServico = ?',
      [descricao, idServico],
      (tx, results) => {
        console.log('Serviço atualizado com sucesso (Update descricao)');
      },
      (error) => {
        console.log('Erro ao atualizar serviço (Update descricao):' + error);
      }
    );
  });
}

export function UpdateFavoritoServicoPorId (idServico, favorito) {
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