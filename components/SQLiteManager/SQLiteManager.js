import React, { useEffect, useState } from "react";


import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('gestorAgenda.db');

export default function SQLiteManager()
{
    const [dbCriado, setDbCriado] = useState(false);
    //CRIANDO BANCO DE DADOS
     useEffect(() => {
        // Verificar se o banco de dados já foi criado
        db.transaction(tr => {
            tr.executeSql(
                'SELECT name FROM sqlite_master WHERE type="table" AND name="estabelecimento";',
                [],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        console.log('Banco de dados já criado');
                        setDbCriado(true);
                    } else {
                        console.log('Criando banco de dados');
                        tr.executeSql(
                            'CREATE TABLE estabelecimento (idEstabelecimento INTEGER PRIMARY KEY AUTOINCREMENT, nomeEstabelecimento TEXT, cnpj TEXT,logo TEXT, ramoAtividade TEXT);',
                            [],
                            () => {
                                console.log('Tabela criada com sucesso');
                                setDbCriado(true);
                            },
                            (_, error) => {
                                console.error('Erro ao criar tabela:', error);
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
      tx.executeSql('DROP TABLE IF EXISTS estabelecimento', [], () => {
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

export function ConsultaEmpresa(retorno)
{
    db.transaction(tr => {
        tr.executeSql('SELECT * FROM usuarios', [], (_, { rows }) => {
            retorno(rows._array);
          });
    });
}