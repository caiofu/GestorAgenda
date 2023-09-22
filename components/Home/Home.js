import { SafeAreaView, Text, Button, TouchableOpacity, View, } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';

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
    <SafeAreaView style={{ margin: 10 }}>
      <TouchableOpacity style={styles.homeContainer} onPress={() => navigation.navigate('Estabelecimento')}>
        <View style={styles.boxBotao}>
          <View style={styles.iconeBotao}>
            <FontAwesome5 style={styles.iconeBotao} name="store" size={34} color='#ffffff' />
            <Text style={styles.txtBotao}>Negócio</Text>
          </View>
        </View>
      </TouchableOpacity>

    </SafeAreaView>
  )
}