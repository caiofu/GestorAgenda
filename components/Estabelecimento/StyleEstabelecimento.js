import { StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const styles = StyleSheet.create({
    container:
    {
      
    },

    inputFormulario:
    {
        marginLeft:10, marginRight:10, marginBottom:13, backgroundColor: 'rgba(112, 120, 147, 0.3)'
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
        padding:5,
        fontWeight:'bold',
        color:'red'
    },

    btnLogoText:
    {
        alignSelf:'center', 
        color:'#ffff',
        fontWeight:'bold'
    },
    
    btnSalvar:
    {
        backgroundColor:'#006699',
        marginLeft:20,
        marginRight:20,
        padding:20,
        borderRadius:5
    },

    btnSalvarText:
    {
        color:'#ffff',
        fontWeight:'bold',
        fontSize:20,
        alignSelf:'center',

    }
});

export default styles;