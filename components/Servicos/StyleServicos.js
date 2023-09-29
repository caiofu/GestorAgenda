import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:
    {
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
    },

  
  
    btnContainer: {
        flexDirection: "row", // Alinha os filhos (ícone e texto) lado a lado
        alignItems: "center", // Alinha verticalmente ao centro
      },

    btn:
    {
        backgroundColor:'#006699',
        marginLeft:20,
        marginRight:20,
        padding:20,
        borderRadius:5
    },

    btnCancelar:
    {
        backgroundColor:'#fd1c1c',
        marginLeft:20,
        marginRight:20,
        padding:20,
        borderRadius:5
    },
    
    btnDesabilitado:
    {
        backgroundColor:'#9e9e9e',
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

    msgHelper:
    {
        color:'red',
        fontFamily:'Rubik_300Light'
    },

  

    
    
   
  

});

export default styles;