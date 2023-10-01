import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:
    {
        flex:1
    
    },

    inputFormulario:
    { 
        marginBottom:20, 
        backgroundColor: 'rgba(112, 120, 147, 0.3)',
        
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

   // ITEMS
    itemServico:
    {
        borderWidth:0.8,
        
        margin:5, 
        borderRadius:10,
      
    },

    itemTitulo:
    {
        color:'#006699',
        fontSize:13,
        fontFamily:'Rubik_700Bold'
    },

    itemDescricao:
    {
        fontFamily:'Rubik_300Light',
        fontStyle:'italic',
        color:'black',
        fontSize:12
    }
  

    
    
   
  

});

export default styles;