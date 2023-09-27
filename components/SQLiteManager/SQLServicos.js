import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('gestorAgenda.db');

export function GetServicosPorRamo(idRamoAtividade, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM servicos where idRamoAtividade = ?',
      [idRamoAtividade],
      (tx, results) => {
        const len = results.rows.length;
        const servicos = [];

        for (let i = 0; i < len; i++) {
          const row = results.rows.item(i);
          servicos.push(row);
        }
        console.log('Dentro de servicos: ' + servicos)
        callback(servicos);
      },
      (error) => {
        console.log('Erro ao executar consulta (servicos):' + error);
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






