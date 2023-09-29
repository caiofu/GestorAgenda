import { StyleSheet } from "react-native";

const StyleDetalhesServicos = StyleSheet.create({
    container:
    {
        display:'flex',
        flexDirection: 'cplumn',
        width: '90%',
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'space-between',
    },
    button:
    {
        display: "flex",
        width: "30%",
    },
    buttonDiv:
    {
        display:'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        paddingTop: 30,
        paddingBottom: 30,
    },
    dadosDiv:
    {
        display:'flex',
        flexDirection: 'column',
        width: '100%',
        paddingTop: 30,
        gap: 10,
    }
});

export default StyleDetalhesServicos;