import { StyleSheet } from "react-native";
const styles = StyleSheet.create({

      Container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      },
      
      switch: {
        marginLeft: 10,
      },

      txtSwitchTema:
      {
        fontFamily:'Rubik_700Bold'
      },

      // CheckboxContainer:
      // {
      //   flexDirection: "row",
      //   justifyContent: "center",
      //   alignItems: "center",
      // },

      btnRestaurar:
      {
        margin:10,
        padding:5,
        borderRadius:4,
        backgroundColor:'red'
      },

      txtBtnRestaurar:
      {
        color:'#fff',
        fontFamily:'Rubik_700Bold',
        padding:5
      },

      txtDialog:
      {
        color:'#fff',
        margin:3,
        fontFamily:'Rubik_400Regular'
      },

      btnRestaurarDialog:
      {
        alignSelf:'center',
        padding:5,
        backgroundColor:'red',
        borderRadius:5,
        margin:10,
        width:200,
      },

      txtBtnRestaurarDialog:
      {
        color:'#fff',
        fontFamily:'Rubik_700Bold',
        fontSize:20,
        alignSelf:'center'
      },

      linha:
      {
        borderWidth:0.2,
        borderColor: "#006699",
        width:'98%', 
        alignSelf:'center'
      },
      btn:
      {
        borderWidth:1,
        borderColor:'#006699',
        borderRadius:5,
        width:'60%',
        marginBottom:10,
        backgroundColor:'#006699',
        
        
      },
      btnTxt:
      {
        color:'#fff',
        fontFamily:'Rubik_700Bold',
        fontSize:20,
        alignSelf:'center',
        padding:5,
        
      },

      btnDark:
      {
        borderWidth:1,
        borderColor:'#fff',
        borderRadius:5,
        marginBottom:10,
        width:'60%',
        backgroundColor:'gray'
      },

      btnTxtDark:
      {
        color:'#fff',
        fontFamily:'Rubik_700Bold',
        fontSize:20,
        alignSelf:'center',
        padding:5,
      },

      txtBkpDialog:
      {
        alignSelf: 'center',
        color:'#fff',
        margin:3,
        fontFamily:'Rubik_400Regular'
      },
});
export default styles;