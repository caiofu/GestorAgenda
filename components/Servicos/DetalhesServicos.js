import { View } from "react-native";
import { Text, Button, TextInput, IconButton, MD3Colors } from 'react-native-paper';
import StyleDetalhesServicos from './StyleDetalhesServicos';
import { StatusBar } from "expo-status-bar";
import { GetServicosPorRamo, GetServicosPorId, UpdateAtivoServicoPorId, UpdateServicoPorId, UpdateFavoritoServicoPorId } from "../SQLiteManager/SQLServicos";
import { useState, useEffect } from 'react';

export default function DetalhesServicos(props) {
    // Acesse o valor do idServico por meio de props.route.params
    const idServico = props.route.params.id;
    const [servico, setServico] = useState({});
    const [iconeEstrela, setIconeEstrela] = useState('star-outline');

    useEffect(() => {
        console.log('ID ao entrar aqui: ' + idServico);
        GetServicosPorId(idServico, (servico) => {
            const retorno = servico;
            setIconeEstrela(servico.favorito === 1 ? 'star' : 'star-outline');
            setServico(retorno);
            console.log('Valor do retorno em DetalheServicos:' + retorno.nomeServico);
            console.log('Valor do retorno em DetalheServicos ativo:' + retorno.ativo);
            console.log('Valor do retorno em DetalheServicos ID:' + retorno.idServico);
            console.log('Valor do retorno em DetalheServicos favorito:' + retorno.favorito);
        });
    }, [iconeEstrela])

    function atualizarServicoState(dado) {
        console.log('Dado: ' + dado.descricao);
        setServico(dado);
    }

    function inativarServico() {
        UpdateAtivoServicoPorId(idServico, 0);
    }

    function atualizarServicoBanco() {
        UpdateServicoPorId(idServico, servico.nomeServico, servico.descricao);
    }

    function atualizarFavoritoBanco() {
        console.log('Valor em favorito DetalhesServicos: ' + servico.favorito)
        valor = servico.favorito === 1 ? 0 : 1
        UpdateFavoritoServicoPorId(idServico, valor);
        setIconeEstrela(valor === 1 ? 'star' : 'star-outline');
    }

    return (
        <View style={StyleDetalhesServicos.container}>
            <View style={StyleDetalhesServicos.dadosDiv}>
                <Text variant="titleLarge" style={{ color: 'gray' }}>Nome:</Text>
                <TextInput
                    value={servico.nomeServico}
                    onChangeText={(text) => atualizarServicoState({ ...servico, nomeServico: text })}
                />
                <Text variant="titleLarge" style={{ color: 'gray' }}>Descrição:</Text>
                <TextInput
                    value={servico.descricao}
                    onChangeText={(text) => atualizarServicoState({ ...servico, descricao: text })}
                    multiline={true}
                />
            </View>

            <View style={StyleDetalhesServicos.buttonDiv}>
                <Button buttonColor="red" mode="contained" onPress={inativarServico} style={StyleDetalhesServicos.button}>
                    Deletar
                </Button>

                <IconButton
                    icon={iconeEstrela}
                    iconColor='#ffff00'
                    size={50}
                    onPress={atualizarFavoritoBanco}
                    style={{ alignSelf: 'center' }}
                />

                <Button buttonColor='#006699' mode="contained" onPress={atualizarServicoBanco} style={StyleDetalhesServicos.button}>
                    Salvar
                </Button>
            </View>
        </View>
    )
}