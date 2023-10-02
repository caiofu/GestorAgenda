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
   
    viewBotoesAcao:
    {
        // display:'flex',
        // flexDirection: 'row',
        // width: '100%',
        // justifyContent: 'space-evenly',
        // paddingTop: 30,
        // paddingBottom: 30,
        // maxHeight: 100,
        flexDirection:'row',
        gap:10,
        justifyContent: 'space-between',
        marginBottom:15
    },

    btnAcao:
    {
        backgroundColor:'#006699',
        flex:1,
        padding:20,
        borderRadius:5
    },

    btnAcaoText:
    {
        color:'#ffff',
        fontSize:15,
        alignSelf:'center',
        fontFamily:'Rubik_700Bold'

    },

    dadosDiv:
    {
        display:'flex',
        flexDirection: 'column',
        width: '100%',
        paddingTop: 30,
        gap: 10,
    },

    viewFavoritos:
    {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf:'flex-end',
  
    },

    txtFavoritos:
    {
        fontFamily:'Rubik_700Bold',
    
        fontSize:13
    }
});

export default StyleDetalhesServicos;