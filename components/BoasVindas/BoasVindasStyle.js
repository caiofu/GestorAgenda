import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:
    {
        backgroundColor:'#006699',
        height:'100%',
        justifyContent:'center'
    },

    textoBoasVindas:
    {
        fontSize: 25,
        color: '#ffff',
        alignSelf: 'center',
        paddingVertical: '30%',
        fontFamily:'Rubik_400Regular'
    },

    button:
    {
        width: '40%',
        alignSelf: 'center',
        backgroundColor:'#ffffff',
        color:'#006699',
        borderRadius:5,
        padding:8,
    },

    boxLogo:
    {
        width:"90%",
        alignSelf:'center',
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