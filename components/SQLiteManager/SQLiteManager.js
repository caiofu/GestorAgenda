import React, { useEffect, useState } from "react";


import * as SQLite from 'expo-sqlite';


const dbName = 'gestorAgenda.db';
const db = SQLite.openDatabase(dbName);

export default function SQLiteManager() {

  const [dbCriado, setDbCriado] = useState(false);
  //CRIAR BANCO DE DADOS
  useEffect(() => {

    db.transaction(tx => {

      //Estabelecimento
      tx.executeSql('CREATE TABLE IF NOT EXISTS estabelecimento (idEstabelecimento INTEGER PRIMARY KEY AUTOINCREMENT, nomeEstabelecimento TEXT, cnpj TEXT, logo TEXT, ramoAtividade TEXT);',
      );
      //Ramo Atividade
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ramoAtividade (idRamoAtividade INTEGER PRIMARY KEY AUTOINCREMENT, nomeAtividade TEXT);'
      );
      //Serviços - 'criado' = criado pelo usuário.
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS servicos (idServico INTEGER PRIMARY KEY AUTOINCREMENT, idRamoAtividade INTEGER, nomeServico TEXT, descricao TEXT, favorito INTEGER, ativo INTEGER, criado INTEGER);'
      );

     //SERVIÇOS CRIADOS PELO USUARIO
     tx.executeSql(
      'CREATE TABLE IF NOT EXISTS servicos_customizado (idServicoCustomizado INTEGER PRIMARY KEY AUTOINCREMENT,  nomeServico TEXT, descricao TEXT, favorito INTEGER, ativo INTEGER);'
     );   

      //Inserindo dados iniciais ramo de atividade
      tx.executeSql('SELECT idRamoAtividade FROM ramoAtividade',
        [],
        (_, { rows }) => {
          if (rows.length === 0) {
            tx.executeSql(
              'INSERT INTO ramoAtividade (nomeAtividade) VALUES (?), (?), (?), (?), (?), (?), (?), (?), (?), (?), (?)',
              ['Aula Particular', 'Barbearia', 'Estética', 'Massoterapia', 'Nutrição', 'Oficina Mecânica', 'Personal Trainer', 'Psicologia', 'Salão de Beleza', 'Serviços Gerais', 'Outro'],
              (_, result) => {
                console.log('Tabela criada com sucesso e valores inseridos');

              },
              (_, error) => {
                console.error('Erro ao criar tabela e inserir valores:', error);
              }
            )
          }
          else {
            console.log('valores ja inseridos');
          }
        });
     
      

      //Inserindo dados iniciais: serviços por ramo de atividade
      // tx.executeSql('SELECT idServico FROM servicos',
      //   [],
      //   (_, { rows }) => {
      //     if (rows.length === 0) {
      //       tx.executeSql(
      //         'INSERT INTO servicos (idRamoAtividade, nomeServico, ativo, criado, descricao) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)',

      //         [
      //           1, 'Conteúdo escolar', 0, 0,
      //           1, 'Idioma', 0, 0,
      //           1, 'Reforço', 0, 0,
      //           2, 'Barba', 0, 0,
      //           2, 'Corte de cabelo', 0, 0,
      //           2, 'Depilação facial', 0, 0,
      //           3, 'Limpeza de pele', 0, 0,
      //           3, 'Drenagem linfática', 0, 0,
      //           3, 'Peeling', 0, 0,
      //           4, 'Relaxante', 0, 0,
      //           4, 'Quick massage', 0, 0,
      //           4, 'Pés', 0, 0,
      //           5, 'Anamnese', 0, 0,
      //           5, 'Elaboração de cardápio', 0, 0,
      //           5, 'Bioimpedância', 0, 0,
      //           6, 'Motor', 0, 0,
      //           6, 'Rodas', 0, 0,
      //           6, 'Funilaria', 0, 0,
      //           7, 'Anamnese', 0, 0,
      //           7, 'Elaboração de treinos', 0, 0,
      //           7, 'Acompanhamento de treinos', 0, 0,
      //           8, 'Anamnese', 0, 0,
      //           8, 'Atendimento individual', 0, 0,
      //           8, 'Atendimento coletivo', 0, 0,
      //           9, 'Corte de cabelo', 0, 0,
      //           9, 'Pintura de cabelo', 0, 0,
      //           9, 'Manicure', 0, 0,
      //           9, 'Escova', 0, 0,
      //           9, 'Pedicure', 0, 0,
      //           10, 'Limpeza', 0, 0,
      //           10, 'Passar roupa', 0, 0,
      //           10, 'Cozinhar', 0, 0
      //         ],

      //         (_, result) => {
      //           console.log('Tabela criada com sucesso e valores inseridos (servicos)');
      //         },

      //         (_, error) => {
      //           console.error('Erro ao criar tabela e inserir valores (servicos):', error);
      //         }
      //       )
      //     }
      //     else {
      //       console.log('valores ja inseridos (servicos)');
      //     }
      //   });
      tx.executeSql('SELECT idServico FROM servicos',
      [],
      (_, { rows }) => {
        if (rows.length === 0) {
          const values = [
            [1, 'Conteúdo escolar', 0, 0, 'Fornecemos materiais de estudo de alta qualidade para estudantes de todas as idades. Nossos tutores qualificados ajudam os alunos a obterem sucesso acadêmico.', 0],
            [1, 'Idioma', 0, 0, 'Oferecemos aulas de idiomas personalizadas para atender às necessidades individuais de nossos alunos. Aprenda um novo idioma de forma eficaz e divertida.', 0],
            [1, 'Reforço', 0, 0, 'Auxiliamos os estudantes em suas áreas de estudo que precisam de reforço. Nossa abordagem personalizada ajuda os alunos a superar desafios acadêmicos.', 0],
            [2, 'Barba', 0, 0, 'Oferecemos serviços de barbearia de alta qualidade para homens. Nossos barbeiros experientes garantem que você saia com um visual impecável.', 0],
            [2, 'Corte de cabelo', 0, 0, 'Corte e estilo de cabelo personalizado para atender às suas necessidades. Nossos cabeleireiros talentosos farão você se sentir renovado.', 0],
            [2, 'Depilação facial', 0, 0, 'Remova os pelos faciais de forma suave e eficaz com nossos serviços de depilação facial. Pele suave e refrescante.', 0],
            [3, 'Limpeza de pele', 0, 0, 'Nossa limpeza de pele profunda remove impurezas e rejuvenesce sua pele. Desfrute de uma pele radiante e saudável conosco.', 0],
            [3, 'Drenagem linfática', 0, 0, 'Melhore a circulação e reduza o inchaço com nossa massagem de drenagem linfática. Um tratamento relaxante para o seu bem-estar.', 0],
            [3, 'Peeling', 0, 0, 'Revitalize sua pele com nosso tratamento de peeling. Elimine as células mortas e descubra uma pele mais jovem e radiante.', 0],
            [4, 'Relaxante', 0, 0, 'Experimente uma massagem relaxante que alivia o estresse e a tensão muscular. Deixe suas preocupações para trás e desfrute do relaxamento.', 0],
            [4, 'Quick massage', 0, 0, 'Uma massagem rápida para aliviar a tensão do dia a dia. Uma pausa revigorante para recarregar suas energias.', 0],
            [4, 'Pés', 0, 0, 'Mime seus pés cansados com nossa massagem especializada. A sensação de alívio é instantânea.', 0],
            [5, 'Anamnese', 0, 0, 'Realizamos uma análise detalhada de sua história médica para garantir o melhor tratamento personalizado para você.', 0],
            [5, 'Elaboração de cardápio', 0, 0, 'Criamos cardápios personalizados com base em suas preferências e necessidades nutricionais. Uma dieta saudável começa aqui.', 0],
            [5, 'Bioimpedância', 0, 0, 'Avaliamos sua composição corporal com tecnologia de bioimpedância. Informações vitais para sua saúde e condicionamento físico.', 0],
            [6, 'Motor', 0, 0, 'Reparos e manutenção de motores de alta qualidade. Mantenha seu veículo funcionando perfeitamente conosco.', 0],
            [6, 'Rodas', 0, 0, 'Serviços de reparo e substituição de rodas para veículos de todos os tipos. Volte à estrada com segurança.', 0],
            [6, 'Funilaria', 0, 0, 'Recuperação de danos na carroceria do seu veículo. Restauramos seu carro ao seu antigo esplendor.', 0],
            [7, 'Anamnese', 0, 0, 'Entendemos suas metas de condicionamento físico e histórico de treinamento para criar um programa de exercícios personalizado.', 0],
            [7, 'Elaboração de treinos', 0, 0, 'Desenvolvemos rotinas de treinamento específicas para você alcançar seus objetivos de condicionamento físico.', 0],
            [7, 'Acompanhamento de treinos', 0, 0, 'Mantemos um registro cuidadoso de seu progresso e ajustamos seus treinos para garantir que você obtenha os melhores resultados.', 0],
            [8, 'Anamnese', 0, 0, 'Conversamos sobre suas metas de saúde e condicionamento físico antes de criar um plano de treinamento personalizado.', 0],
            [8, 'Atendimento individual', 0, 0, 'Treinamento individualizado com a atenção total do instrutor. Maximize seu potencial de fitness conosco.', 0],
            [8, 'Atendimento coletivo', 0, 0, 'Treinamento em grupo para se divertir e se motivar. Alcance seus objetivos de condicionamento físico em um ambiente de equipe.', 0],
            [9, 'Corte de cabelo', 0, 0, 'Corte de cabelo moderno e elegante para homens e mulheres. Atualize seu visual conosco.', 0],
            [9, 'Pintura de cabelo', 0, 0, 'Transforme sua aparência com nossa pintura de cabelo profissional. Cores deslumbrantes para um novo visual.', 0],
            [9, 'Manicure', 0, 0, 'Unhas impecáveis com nossa manicure de alta qualidade. Escolha entre uma variedade de estilos e cores.', 0],
            [9, 'Escova', 0, 0, 'Obtenha um penteado perfeito com nossa escova profissional. Cabelos elegantes para todas as ocasiões.', 0],
            [9, 'Pedicure', 0, 0, 'Mime seus pés com nossa pedicure relaxante. Unhas bonitas e pés rejuvenescidos.', 0],
            [10, 'Limpeza', 0, 0, 'Oferecemos serviços de limpeza profissional para sua casa ou escritório. Um ambiente limpo e saudável é a nossa prioridade.', 0],
            [10, 'Passar roupa', 0, 0, 'Cuide das suas roupas com nossos serviços de passar roupa de qualidade. Roupas bem cuidadas e prontas para vestir.', 0],
            [10, 'Cozinhar', 0, 0, 'Deleite-se com pratos deliciosos preparados pelos nossos chefs talentosos. Uma experiência culinária incrível para todos.', 0],
          ];
    
          const sql = 'INSERT INTO servicos (idRamoAtividade, nomeServico, ativo, criado, descricao, favorito) VALUES (?, ?, ?, ?, ?, ?)';
    
          values.forEach(valueSet => {
            tx.executeSql(
              sql,
              valueSet,
              (_, result) => {
                console.log('Valores inseridos com sucesso (servicos)');
              },
              (_, error) => {
                console.error('Erro ao inserir valores (servicos):', error);
              }
            );
          });
        } else {
          console.log('Valores já inseridos (servicos)');
        }
      });
    

    });
  }, []);
}

export function ListaTodasTabelas() {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT name FROM sqlite_master WHERE type="table";',
      [],
      (_, { rows }) => {
        const tableNames = rows._array.map(row => row.name);
        console.log('Tabelas no banco de dados:', tableNames);
      }
    );
  });
}
export function ExcluirBancoDeDados() {
  db.transaction(tx => {
    tx.executeSql(
      'DROP TABLE IF EXISTS estabelecimento;',
      [],
      (_, result) => {
        console.log('A tabela "usuarios" foi excluída com sucesso.');
      },
      (_, error) => {
        console.error('Erro ao excluir a tabela "usuarios":', error);
      }
    );

    tx.executeSql(
      'DROP TABLE IF EXISTS ramoAtividade;',
      [],
      (_, result) => {
        console.log('A tabela "usuarios" foi excluída com sucesso.');
      },
      (_, error) => {
        console.error('Erro ao excluir a tabela "usuarios":', error);
      }
    );

    tx.executeSql(
      'DROP TABLE IF EXISTS servicos;',
      [],
      (_, result) => {
        console.log('A tabela "usuarios" foi excluída com sucesso.');
      },
      (_, error) => {
        console.error('Erro ao excluir a tabela "usuarios":', error);
      }
    );
  });
}
