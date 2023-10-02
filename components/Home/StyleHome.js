import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    homeContainer:
    {
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        gap:5,
        marginTop:10,
        marginLeft:5,
        marginRight:5,
        justifyContent:'space-around',
    },
    boxBotao:
    {
      borderWidth:1,
      borderColor:'#707893',
      minWidth:100,
      height:70,
     
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
        fontSize:10, 
        fontFamily:'Rubik_700Bold',
        color:'#ffffff',
        marginBottom:8
    }
});
export default styles;