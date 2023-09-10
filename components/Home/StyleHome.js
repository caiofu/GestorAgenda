import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    homeContainer:
    {
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'space-around',
    },
    boxBotao:
    {
      borderWidth:1,
      borderColor:'#707893',
      width:70,
      height:70,
      margin: 15,
      borderRadius:5,
      backgroundColor:'#006699'
    },
    iconeBotao:
    {
        flex:1, 
        alignSelf:'center',
        marginTop:2
    },

    txtBotao:
    {
        fontSize:14, 
        fontFamily:'Rubik_700Bold',
        color:'#ffffff'
    }
});
export default styles;