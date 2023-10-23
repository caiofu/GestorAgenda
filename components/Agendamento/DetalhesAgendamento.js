import { View } from "react-native";

export default function DetalhesAgendamento(props)
{
    // Acesse o valor do idServico por meio de props.route.params
    const idAgendamento = props.route.params.id;

    console.log('detalhes id agendamento ', idAgendamento);
    return(
        <View>

        </View>
    );
}