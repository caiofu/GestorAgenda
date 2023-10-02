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

    txtListaVazia:
    {
        alignSelf:'center',
        padding:10,
        fontFamily:'Rubik_400Regular'
    },

   // ITEMS
   tituloCabecalhoLista:
   {
        color:'#fff',
        fontFamily:'Rubik_700Bold'
   },
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
    },
  
    //Botaão novo serviço
    btnNovoServico:
    {
        position: 'absolute', 
        margin: 16, 
        right: 0, 
        bottom: 0, 
        backgroundColor:'#006699',
        fontFamily: 'Rubik_700Bold',
       
    },

    inputFormularioSelect:
    {
        marginLeft:15, 
        marginRight:25, 
       
      
        backgroundColor: 'rgba(112, 120, 147, 0.3)',
    },
    
    btnDialog:
    {
        fontFamily: 'Rubik_700Bold',
        color:'red'
    },
   
    dialogTitulo:
    {
        fontFamily: 'Rubik_700Bold',
    },

    dialogContent:
    {
        fontFamily:'Rubik_400Regular'
    },
    
    //Tema dark
    dialogDark:
    {
        borderWidth:1,
        borderColor: '#fff',
        backgroundColor:'black'
    },

    dialogLight:
    {
        backgroundColor:'#fff'
    }
  

});

export default styles;