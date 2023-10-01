import { useEffect, useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { TextInput } from 'react-native-paper'

export default function FormColaboradores({route}) {
    const colaborador = route.params.colaborador;
    const [nome, setNome] = useState('');

    useEffect(() => {
        // console.log(route.params);
        // console.log(route.params.colaborador)
        if(colaborador){
            setNome(colaborador.nomeColaborador);
        }
        else {
            setNome('');
        }
    }, []);

    return(
        <View>
            <TextInput
                label='Nome Colaborador'
                value={nome} 
                onChangeText={setNome} 
                theme={{
                    colors:'#006699',
                }}
                style={styles.inputFormulario}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
    },
    inputFormulario: {
        marginLeft:15, 
        marginRight:15, 
        marginBottom:20, 
        backgroundColor: 'rgba(112, 120, 147, 0.3)',
    },
})