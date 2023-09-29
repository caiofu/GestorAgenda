import { View } from "react-native";
import { Text, Button, TextInput } from 'react-native-paper';
import StyleDetalhesServicos from './StyleDetalhesServicos';
import { StatusBar } from "expo-status-bar";
import { GetServicosPorRamo, GetServicosPorId, UpdateAtivoServicoPorId, UpdateServicoPorId } from "../SQLiteManager/SQLServicos";
import { useState, useEffect } from 'react';

export default function DetalhesServicos(props) {
    // Acesse o valor do idServico por meio de props.route.params
    const idServico = props.route.params.id;
    const [servico, setServico] = useState({});

    useEffect(() => {
        console.log('ID ao entrar aqui: ' + idServico);
        GetServicosPorId(idServico, (servico) => {            
            const retorno = servico;
            setServico(retorno);
            console.log('Valor do retorno em DetalheServicos:' + retorno.nomeServico);
            console.log('Valor do retorno em DetalheServicos ativo:' + retorno.ativo);
            console.log('Valor do retorno em DetalheServicos ID:' + retorno.idServico);
        });
    }, [])

    function atualizarServicoState(dado) {
        console.log('Dado: ' + dado.descricao);
        setServico(dado);
    }

    function inativarServico(){
        UpdateAtivoServicoPorId(idServico, 0);
    }

    function atualizarServicoBanco(){
        UpdateServicoPorId(idServico, servico.nomeServico, servico.descricao);
    }

    return (
        <View style={StyleDetalhesServicos.container}>
            <View style={StyleDetalhesServicos.dadosDiv}>
                <Text variant="titleLarge" style={{ color: 'gray' }}>Nome:</Text>
                <TextInput
                    value={servico.nomeServico}
                    onChangeText={(text) => atualizarServicoState({ ...servico, nomeServico: text})}
                />
                <Text variant="titleLarge" style={{ color: 'gray' }}>Descrição:</Text>
                <TextInput
                    value={servico.descricao}
                    onChangeText={(text) => atualizarServicoState({ ...servico, descricao: text})}
                    multiline={true}
                />
            </View>

            <View style={StyleDetalhesServicos.buttonDiv}>
                <Button buttonColor="red" mode="contained" onPress={inativarServico} style={StyleDetalhesServicos.button}>
                    Deletar
                </Button>
                <Button buttonColor='#006699' mode="contained" onPress={atualizarServicoBanco} style={StyleDetalhesServicos.button}>
                    Salvar
                </Button>
            </View>
        </View>
    )
}