import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:
    {
      
    },

    inputFormulario:
    {
        marginLeft:10, 
        marginRight:10, 
        marginBottom:13, 
        backgroundColor: 'rgba(112, 120, 147, 0.3)',
      
    },

    boxLogo:
    {
        borderWidth:1, 
        width:"50%", 
        marginLeft:10, 
        marginBottom:10, 
        borderRadius:8
    },
    btnLogo:
    {
        backgroundColor:'#006699',
        borderRadius:5,
        padding:8,
        fontWeight:'bold',
        color:'red'
    },

    btnLogoText:
    {
        alignSelf:'center', 
        color:'#ffff',
        fontFamily:'Rubik_700Bold'
        
    },
    
    btnSalvar:
    {
        backgroundColor:'#006699',
        marginLeft:20,
        marginRight:20,
        padding:20,
        borderRadius:5
    },
    btnSalvarDesabilitado:
    {
        backgroundColor:'#9e9e9e',
        marginLeft:20,
        marginRight:20,
        padding:20,
        borderRadius:5
    },
    btnSalvarText:
    {
        color:'#ffff',
      
        fontSize:20,
        alignSelf:'center',
        fontFamily:'Rubik_700Bold'

    },

    msgHelper:
    {
        color:'red',
        fontFamily:'Rubik_300Light'
    }
});

export default styles;