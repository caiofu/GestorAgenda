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
    },

    txtAnimacao:
    {
        alignSelf:'center',
        color:'#006699',
        fontFamily:'Rubik_700Bold',
        fontSize:22,
        marginTop:6
    },

    contornoModal:
    {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(128, 128, 128, 0.5)'
    },
    janelaModal:
    {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    txtModal:
    {
        fontFamily:'Rubik_700Bold',
        color:'#006699',
        fontSize:18
    },
    btnModal:
    {
        marginTop:28,
        
        backgroundColor:"#006699",
        padding:8,
        borderRadius:9,

    },
    txtBtnModal:
    {
        color:'#ffff',
        fontFamily:'Rubik_700Bold',

    }

});

export default styles;