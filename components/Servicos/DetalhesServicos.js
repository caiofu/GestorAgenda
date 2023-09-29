import { View, Text } from "react-native";

export default function DetalhesServicos(props)
{
        // Acesse o valor do idServico por meio de props.route.params
        const idServico = props.route.params.id;
    return(
        <View>
            <Text>ACERTO MISERAVI id do serviço {idServico}</Text>
        </View>
    )
}