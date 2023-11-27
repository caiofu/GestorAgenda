import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('gestorAgenda.db');

//ESSA LISTA TRAZ TODOS OS SERVIÇOS DIFERENTES DE 1 ( SOMENTE OS INATIVOS)
export function GetServicosPorRamo(idRamoAtividade, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM servicos where idRamoAtividade = ? and ativo != 1',
      [idRamoAtividade],
      (tx, results) => {
        
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
        
        const len = results.rows.length;
        const servico = results.rows.item(0);
        callback(servico);
      },
      (error) => {
        console.log('Erro ao extrair serviço por ID (servicos):' + error);
      }
    );
  });
}

export function GetServicosAtivo(callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM servicos WHERE ativo = ?',
      [1],
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

export function UpdateAtivoServicoPorId (idServico, campoAtivo, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE servicos SET ativo = ? WHERE idServico = ?',
      [campoAtivo, idServico],
      (tx, results) => {
        callback(true);
       // console.log('Serviço atualizado com sucesso (UpdateAtivoServicoPorId)');
      },
      (error) => {
        callback(false);
        //console.log('Erro ao atualizar serviço (UpdateAtivoServicoPorId):' + error);
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

export function CriaNovoServico(nomeServico, descricao, favorito, callback)
{
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO servicos_customizado (nomeServico, descricao, favorito, ativo) VALUES (?, ?, ?, 1)',
      [nomeServico, descricao,favorito], 
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

export function GetServicosCustomizadosAtivos(callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM servicos_customizado WHERE ativo = ?',
      [1],
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
        console.log('Erro ao extrair serviços customizados ativos: ');
        callback(null); // Trate o erro e chame a função de callback com null
      }
    );
   
  });
}


export function GetServicosCustomizadosPorId(idServico, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM servicos_customizado where idServicoCustomizado = ?',
      [idServico],
      (tx, results) => {
        
        const len = results.rows.length;
        const servico = results.rows.item(0);
        callback(servico);
      },
      (error) => {
        console.log('Erro ao extrair serviço customizado por ID (servicos):id: '+idServico);
      }
    );
  });
}

export function UpdateAtivoServicoCustomizadoPorId (idServico, campoAtivo, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE servicos_customizado SET ativo = ? WHERE idServicoCustomizado = ?',
      [campoAtivo, idServico],
      (tx, results) => {
        callback(true);
       // console.log('Serviço atualizado com sucesso (UpdateAtivoServicoPorId)');
      },
      (error) => {
        callback(false);
        //console.log('Erro ao atualizar serviço (UpdateAtivoServicoPorId):' + error);
      }
    );
  });
}

export function UpdateFavoritoServicoCustomizadoPorId (idServico, favorito) {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE servicos_customizado SET favorito = ? WHERE idServicoCustomizado = ?',
      [favorito, idServico],
      (tx, results) => {
        console.log('Serviço atualizado com sucesso (UpdateFavoritoServicoPorId)');
      },
      (error) => {
        console.log('Erro ao atualizar serviço (UpdateFavoritoServicoPorId):');
      }
    );
  });
}

export function UpdateServicoCustomizadoPorId (idServico, nome, descricao) {
  db.transaction((tx) => {
    tx.executeSql(
      `
      UPDATE servicos_customizado
      SET nomeServico = ?, descricao = ?
      WHERE idServicoCustomizado = ?
      `,
      [nome, descricao, idServico],
      (tx, results) => {
        console.log('Serviço atualizado com sucesso (Update nome e descrição)');
      },
      (error) => {
        console.log('Erro ao atualizar serviço (Update nome e descrição):' + error);
      }
    );
  });
  
}

export function AtualizarServiçoAtivoPorIdRamoAtividade(idRamoAtividade, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE servicos SET ativo = 1 WHERE idRamoAtividade = ?',
      [idRamoAtividade],
      (tx, results) => {
        console.log('Registros atualizados com sucesso.');
        if (callback) {
          callback(null); // Chama o callback sem erros
        }
      },
      (error) => {
        console.error('Erro ao executar a atualização:', error);
        if (callback) {
          callback(error); // Chama o callback com o erro
        }
      }
    );
  });
}

//RETORNA TODOS OS SERVIÇOS DO ESTABELECIMENTO ORDENADO POR FAVORITOS E PORSTERIORMENTE POR NOME.
export function RetornaServicosEstabelecimento(callback) {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT nomeServico AS nome, favorito AS fav FROM servicos WHERE ativo = 1 ' +
      'UNION ' +
      'SELECT nomeServico, favorito FROM servicos_customizado WHERE ativo = 1 ' +
      'ORDER BY fav DESC, nome',
      [],
      (tx, results) => {
        const len = results.rows.length;
        const resultados = [];
        for (let i = 0; i < len; i++) {
          const row = results.rows.item(i);
          resultados.push(row.nome);
        }
        callback(resultados); //callback com os resultados
      },
      (tx, error) => {
        console.log('Erro ao executar a consulta: ' + error.message);
      }
    );
  });
}

