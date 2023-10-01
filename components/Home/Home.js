import { SafeAreaView, Text, Button, TouchableOpacity, View, } from "react-native";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

//CONTEXT
import { useAppState } from "../Contexts/AppStateContext";
import { ConsultaEstabelecimento } from "../SQLiteManager/SQLEstabelecimento";

import styles from "./StyleHome";

export default function Home({ navigation }) {
  const { navegacaoEstabelecimento, setNavegacaoEstabelecimento } = useAppState();
  
 


  ConsultaEstabelecimento((resultado) => {
    if(resultado === null)
    {
      setNavegacaoEstabelecimento(true);
    }
    else
    {
      setNavegacaoEstabelecimento(false);
    }
  })

  return (
    <SafeAreaView style={{ margin: 10, display:'flex', flexDirection:'row' , display: 'flex', flexDirection:'row'}}>
      <TouchableOpacity style={styles.homeContainer} onPress={() => navigation.navigate('Estabelecimento')}>
        <View style={styles.boxBotao}>
          <View style={styles.iconeBotao}>
            <FontAwesome5 style={styles.iconeBotao} name="store" size={34} color='#ffffff' />
            <Text style={styles.txtBotao}>Estabelecimento</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeContainer} onPress={() => navigation.navigate('Serviços')}>
        <View style={styles.boxBotao}>
          <View style={styles.iconeBotao}>
            <FontAwesome5 style={styles.iconeBotao} name="store" size={34} color='#ffffff' />
            <Text style={styles.txtBotao}>Serviços</Text>
          </View>
        </View>
      </TouchableOpacity>


      <TouchableOpacity style={styles.homeContainer} onPress={() => navigation.navigate('Colaboradores')}>
        <View style={styles.boxBotao}>
          <View style={styles.iconeBotao}>
            <FontAwesome5 style={styles.iconeBotao} name="house-user" size={34} color='#ffffff' />
            <Text style={styles.txtBotao}>Colab</Text>
          </View>
        </View>
      </TouchableOpacity>

      

    </SafeAreaView>
  )
}