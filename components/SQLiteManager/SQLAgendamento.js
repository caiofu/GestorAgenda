import * as SQLite from 'expo-sqlite';

const dbName = 'gestorAgenda.db';
const db = SQLite.openDatabase(dbName);

//CREATE TABLE IF NOT EXISTS agendamento (idAgendamento INTEGER PRIMARY KEY AUTOINCREMENT, nomeCliente TEXT, telefone TEXT, data TEXT, horario TEXT);'
export function CriaNovoAgendamento(data, horario, nomeCliente, telefone, callback)
{
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO agendamento (nomeCliente, telefone, data, horario, atendido, cancelado) VALUES (?, ?, ?, ?, ?, ?)',
      [nomeCliente, telefone,data, horario,0,0], 
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
        console.log('Erro ao executar consulta Criar novo agendamento:', error);
      }
    );
  });
  
}

export function ConsultaAgendamentoPorId(id, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM agendamento WHERE idAgendamento = ?',
      [id],
      (tx, results) => {
        const len = results.rows.length;
        if (len > 0) {
          const horario = results.rows.item(0);
          callback(horario);
        } else {
          // Nenhum resultado encontrado
          callback(null);
        }
      },
      (error) => {
        console.log('Erro ao extrair serviço por ID (servicos): ' + error);
      }
    );
  });
}


export function ConsultaAgendamentoPorHorarioData(horario, data, callback)
{
    db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM agendamento where horario = ? AND data = ?',
          [horario, data],
          (tx, results) => {
           
            const len = results.rows.length;
            const horario = results.rows.item(0);
          
            callback(horario);
          },
          (error) => {
            console.log('Erro ao extrair serviço por ID (servicos):' + error);
          }
        );
      });
}



export function ConsultaAgendamentoPorData(data, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM agendamento WHERE data = ?',
      [data],
      (tx, results) => {
        const len = results.rows.length;
        const agendamentos = [];

        for (let i = 0; i < len; i++) {
          agendamentos.push(results.rows.item(i));
        }

        // Converter as strings de horário em objetos de data JavaScript
        agendamentos.forEach((agendamento) => {
          const [hours, minutes] = agendamento.horario.split(':');
          agendamento.horarioDate = new Date();
          agendamento.horarioDate.setHours(hours);
          agendamento.horarioDate.setMinutes(minutes);
        });

        // Ordenar os objetos de data por horário
        agendamentos.sort((a, b) => a.horarioDate - b.horarioDate);

        // Remover a propriedade temporária "horarioDate"
        agendamentos.forEach((agendamento) => {
          delete agendamento.horarioDate;
        });

        callback(agendamentos);
      },
      (error) => {
        console.log('Erro ao extrair agendamentos por data:', error);
      }
    );
  });
}


export function ConsultaAgendamentoGeral( callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM agendamento ',
      [],
      (tx, results) => {
        const len = results.rows.length;
        const agendamentos = [];

        for (let i = 0; i < len; i++) {
          agendamentos.push(results.rows.item(i));
        }

        callback(agendamentos);
      },
      (error) => {
        console.log('Erro ao extrair agendamentos por data:', error);
      }
    );
  });
}
export function SalvarServicoAgendamento (idAgendamento, nomeServico , callback)
{
  console.log('idAg ',idAgendamento +' nomeSer ',nomeServico)
    //CREATE TABLE IF NOT EXISTS agendamento_serviços (idAgendamentoServico INTEGER PRIMARY KEY AUTOINCREMENT, idAgendamento INTEGER, idServiço INTEGER
    db.transaction((tx) => {
        tx.executeSql(
            'INSERT INTO agendamento_servicos  (idAgendamento, nomeServico ) VALUES (?, ? )',
            [idAgendamento, nomeServico], 
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
              console.log('Erro ao executar consulta salva servico agendamento ===>:', error);
            }
          );
    })
}

export function ConsultaServicoAgendamentoPorId(id, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM agendamento_servicos WHERE idAgendamento = ?',
      [id],
      (tx, results) => {
        console.log('Número de registros encontrados:', results.rows.length);

        const servicos = [];

        // Iterar sobre os resultados e adicionar cada registro ao array de serviços
        for (let i = 0; i < results.rows.length; i++) {
          const servico = results.rows.item(i);
          servicos.push(servico);
        }

        callback(servicos); // Chamar a função de callback com o array de serviços
      },
      (error) => {
        console.log('Erro ao extrair serviços ativos: ' + error);
        callback(null); // Trate o erro e chame a função de callback com null
      }
    );
  });
}