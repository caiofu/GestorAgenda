import React, { useEffect, useState } from "react";


import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('gestorAgenda.db');

export default function SQLiteManager()
{
    const [dbCriado, setDbCriado] = useState(false);
    //CRIAR BANCO DE DADOS
     useEffect(() => {
        // Verificar se o banco de dados já foi criado
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
        });
    }, []);
    
}


export function ExcluirBancoDeDados() 
{
    db.transaction(tx => {
      tx.executeSql('DELETE FROM estabelecimento', [], () => {
        console.log('Registros excluídos com sucesso');
      });
      tx.executeSql('DROP TABLE IF EXISTS estabelecimento','DROP TABLE IF EXISTS ramoAtividade', [], () => {
        console.log('Tabela excluída com sucesso');
      });
    });
}

export function InserirEmpresa(nomeEmpresa, teste, sucessoCallback, erroCallback)
{
    db.transaction(tr => {
        tr.executeSql('INSERT INTO usuarios (nomeUsuario, teste) VALUES (?, ?)', [nome, teste],//O VALUES (?) é um placeholder usado para proteger o codigo contra tentativa de sql injection ele prepara a instrução
        () => {
            console.log('Usuário inserido com sucesso');
            if (sucessoCallback) sucessoCallback();
        },
        (_, error) => {
            console.error('Erro ao inserir usuário:', error);
            if (erroCallback) erroCallback();
        }
        ); 
    });
}

export function ConsultaEstabelecimento(retorno)
{
    db.transaction(tr => {
        tr.executeSql('SELECT * FROM estabelecimento ', [], (_, { rows }) => {
            retorno(rows._array);
          });
    });
}

export function ConsultaRamoAtividade(retorno)
{
    console.log('executorou');
    db.transaction(tr => {
        tr.executeSql('SELECT * FROM ramoAtividade', [], (_, { rows }) => {
            retorno(rows._array);
          });
    });
}