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
        'CREATE TABLE IF NOT EXISTS servicos (idServico INTEGER PRIMARY KEY AUTOINCREMENT, idRamoAtividade INTEGER, nomeServico TEXT, ativo INTEGER, criado INTEGER);'
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
      tx.executeSql('SELECT idServico FROM servicos',
        [],
        (_, { rows }) => {
          if (rows.length === 0) {
            tx.executeSql(
              'INSERT INTO servicos (idRamoAtividade, nomeServico, ativo, criado) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)',

              [
                1, 'Conteúdo escolar', 0, 0,
                1, 'Idioma', 0, 0,
                1, 'Reforço', 0, 0,
                2, 'Barba', 0, 0,
                2, 'Corte de cabelo', 0, 0,
                2, 'Depilação facial', 0, 0,
                3, 'Limpeza de pele', 0, 0,
                3, 'Drenagem linfática', 0, 0,
                3, 'Peeling', 0, 0,
                4, 'Relaxante', 0, 0,
                4, 'Quick massage', 0, 0,
                4, 'Pés', 0, 0,
                5, 'Anamnese', 0, 0,
                5, 'Elaboração de cardápio', 0, 0,
                5, 'Bioimpedância', 0, 0,
                6, 'Motor', 0, 0,
                6, 'Rodas', 0, 0,
                6, 'Funilaria', 0, 0,
                7, 'Anamnese', 0, 0,
                7, 'Elaboração de treinos', 0, 0,
                7, 'Acompanhamento de treinos', 0, 0,
                8, 'Anamnese', 0, 0,
                8, 'Atendimento individual', 0, 0,
                8, 'Atendimento coletivo', 0, 0,
                9, 'Corte de cabelo', 0, 0,
                9, 'Pintura de cabelo', 0, 0,
                9, 'Manicure', 0, 0,
                9, 'Escova', 0, 0,
                9, 'Pedicure', 0, 0,
                10, 'Limpeza', 0, 0,
                10, 'Passar roupa', 0, 0,
                10, 'Cozinhar', 0, 0
              ],

              (_, result) => {
                console.log('Tabela criada com sucesso e valores inseridos (servicos)');
              },

              (_, error) => {
                console.error('Erro ao criar tabela e inserir valores (servicos):', error);
              }
            )
          }
          else {
            console.log('valores ja inseridos (servicos)');
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
  });
}
