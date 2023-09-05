import React, { useEffect, useState } from "react";


import * as SQLite from 'expo-sqlite';

const dbName = 'gestorAgenda.db';
const db = SQLite.openDatabase(dbName);

export default function SQLiteManager()
{
   
    const [dbCriado, setDbCriado] = useState(false);
    //CRIAR BANCO DE DADOS
     useEffect(() => {
        
        // Verificar se o banco de dados já foi criado
        /*
        db.transaction(tr => {
            tr.executeSql(
                'SELECT name FROM sqlite_master WHERE type="table";',
                [],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        
                        console.log('Banco de dados já criado');
                        setDbCriado(true);
                    } else {
                        console.log('Criando banco de dados e tabelas');
                        tr.executeSql(
                            'CREATE TABLE IF NOT EXISTS estabelecimento (idEstabelecimento INTEGER PRIMARY KEY AUTOINCREMENT, nomeEstabelecimento TEXT, cnpj TEXT, logo TEXT, ramoAtividade TEXT);'
                        );
                        tr.executeSql(
                            'CREATE TABLE IF NOT EXISTS ramoAtividade (idRamoAtividade INTEGER PRIMARY KEY AUTOINCREMENT, nomeAtividade TEXT);'
                        );
                        tr.executeSql(
                            'INSERT INTO ramoAtividade (nomeAtividade) VALUES (?), (?), (?), (?), (?), (?), (?)',
                            ['Oficina Mecânica', 'Salão de Beleza', 'Clínica de Massagem', 'Personal Trainer', 'Serviços Gerais', 'Barbearia', 'Outros'],
                            (_, result) => {
                                console.log('Tabela criada com sucesso e valores inseridos');
                                setDbCriado(true);
                            },
                            (_, error) => {
                                console.error('Erro ao criar tabela e inserir valores:', error);
                            }
                        );
                    }
                }
            );
        }); */


        db.transaction(tx =>{

          //Estabelecimento
            tx.executeSql( 'CREATE TABLE IF NOT EXISTS estabelecimento (idEstabelecimento INTEGER PRIMARY KEY AUTOINCREMENT, nomeEstabelecimento TEXT, cnpj TEXT, logo TEXT, ramoAtividade TEXT);',
            );
          //Ramo Atividade
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS ramoAtividade (idRamoAtividade INTEGER PRIMARY KEY AUTOINCREMENT, nomeAtividade TEXT);'
            );
          //Inserindo dados iniciais ramo de atividade
          tx.executeSql('SELECT idRamoAtividade FROM ramoAtividade', 
          [],
          (_,{rows}) =>{
            if(rows.length === 0)
            {
              tx.executeSql(
                'INSERT INTO ramoAtividade (nomeAtividade) VALUES (?), (?), (?), (?), (?), (?), (?)',
                ['Oficina Mecânica', 'Salão de Beleza', 'Clínica de Massagem', 'Personal Trainer', 'Serviços Gerais', 'Barbearia', 'Outros'],
                (_, result) => {
                    console.log('Tabela criada com sucesso e valores inseridos');
                 
                },
                (_, error) => {
                    console.error('Erro ao criar tabela e inserir valores:', error);
                }
              )
            }
            else
            {
              console.log('valores ja inseridos');
            }
          })
        });
    }, []);
   
}

export function ListaTodasTabelas()
{
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
export function ExcluirBancoDeDados() 
{
    

      db.transaction(tx => {
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
      });
}

export function InserirEmpresa(nomeEmpresa, teste, sucessoCallback, erroCallback)
{
    db.transaction(tr => {
        tr.executeSql('INSERT INTO empresa (nomeEmpresa, teste) VALUES (?, ?)', [nome, teste],//O VALUES (?) é um placeholder usado para proteger o codigo contra tentativa de sql injection ele prepara a instrução
        () => {
            console.log('Empresa inserida com sucesso');
            if (sucessoCallback) sucessoCallback();
        },
        (_, error) => {
            console.error('Erro ao inserir empresa:', error);
            if (erroCallback) erroCallback();
        }
        ); 
    });
}

export function ConsultaEstabelecimento()
{
    // db.transaction(tr => {
    //     tr.executeSql('SELECT * FROM estabelecimento ', [], (_, { rows }) => {
    //         retorno(rows._array);
    //       });
    // });
    db.transaction(tx =>{
        tx.executeSql('SELECT  * FROM estabelecimento', null, 
        (txtObj, resultSet)=> resultSet.rows._array,
        (txtObj, error) => console.log(error)
        );
    });
}

export function ConsultaRamoAtividade(callback) 
{
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM ramoAtividade',
        [],
        (tx, results) => {
          const len = results.rows.length;
          const ramoAtividades = [];
  
          for (let i = 0; i < len; i++) {
            const row = results.rows.item(i);
            // Processar os resultados aqui, por exemplo, adicioná-los a um array
            ramoAtividades.push(row);
          }
  
          // Chame a função de retorno (callback) com os resultados
          callback(ramoAtividades);
        },
        (error) => {
          console.error('Erro ao executar consulta:', error);
        }
      );
    });
  }