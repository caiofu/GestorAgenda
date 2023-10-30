import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:
    {
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
    },

    inputFormulario:
    {
        marginLeft:15, 
        marginRight:25, 
        marginBottom:20, 
        backgroundColor: 'rgba(112, 120, 147, 0.3)',
        
    },

    txtInput:
    {
        alignSelf:'center', 
        marginLeft:5, 
        color: '#006699', 
        fontFamily:'Rubik_700Bold'
    },
    btn:
    {
        backgroundColor:'#006699',
        marginLeft:20,
        marginRight:20,
        padding:20,
        borderRadius:5
    },

    btnText:
    {
        color:'#ffff',
        marginLeft:10,
        fontSize:20,
        alignSelf:'center',
        fontFamily:'Rubik_700Bold'

    },

    btnAcaoDetalhes:
    {
        backgroundColor:'#006699',
        marginLeft:20,
        marginRight:20,
        padding:6,
        borderRadius:5,
        
    },

    btnAcaoText:
    {
        color:'#ffff',
        marginLeft:10,
        fontSize:17,
        alignSelf:'center',
        fontFamily:'Rubik_700Bold'

    },

    inputFormularioSelect:
    {
        marginLeft:15, 
        marginRight:25, 
       borderRadius:5,
      
        backgroundColor: 'rgba(112, 120, 147, 0.3)',
    },

    btnDataTime:
    {
        borderWidth:1,   
        marginLeft:15, 
        marginRight:25, 
        marginBottom:20, 
        flexDirection: 'row',
        padding:4,
        backgroundColor: 'rgba(112, 120, 147, 0.3)',
        borderColor:'#006699',
        borderRadius:3
    },

    txtDialog:
    {
        alignSelf:'center',
        fontFamily:'Rubik_700Bold',
        marginBottom:10
    },
    txtHelper:
    {
        color:'red',
        fontFamily:'Rubik_700Bold',
        marginBottom:5
    }


});

export default styles;