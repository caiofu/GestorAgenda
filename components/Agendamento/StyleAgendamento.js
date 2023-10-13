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
    }


});

export default styles;