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

      //Colaborador
      tx.executeSql('CREATE TABLE IF NOT EXISTS colaborador (idColaborador INTEGER PRIMARY KEY AUTOINCREMENT, nomeColaborador TEXT);',
      );

      //Ramo Atividade
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ramoAtividade (idRamoAtividade INTEGER PRIMARY KEY AUTOINCREMENT, nomeAtividade TEXT);'
      );
      //Inserindo dados iniciais ramo de atividade
      tx.executeSql('SELECT idRamoAtividade FROM ramoAtividade',
        [],
        (_, { rows }) => {
          if (rows.length === 0) {
            tx.executeSql(
              'INSERT INTO ramoAtividade (nomeAtividade) VALUES (?), (?), (?), (?), (?), (?), (?)',
              ['Oficina Mecânica', 'Salão de Beleza', 'Clínica de Massagem', 'Personal Trainer', 'Serviços Gerais', 'Barbearia', 'Outros'],
              // 'INSERT INTO colaborador (nomeColaborador) VALUES (?)',
              // ['Proprietário'],
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
        })

        //Inserindo 1° Colaborador - Proprietário
      tx.executeSql('SELECT idColaborador FROM colaborador',
      [],
      (_, { rows }) => {
        if (rows.length === 0) {
          tx.executeSql(
            'INSERT INTO colaborador (nomeColaborador) VALUES (?)',
            ['Proprietário'],

            (_, result) => {
              console.log('Tabela criada com sucesso e valores inseridos - table Colaborador');

            },
            (_, error) => {
              console.error('Erro ao criar tabela e inserir valores - table Colaborador:', error);
            }
          )
        }
        else {
          console.log('valores ja inseridos - table Colaborador');
        }
      })
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
