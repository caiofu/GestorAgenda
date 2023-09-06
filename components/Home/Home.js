import {SafeAreaView, Text, Button } from "react-native";

export default function Home({navigation})
{
    return(
      <SafeAreaView>
        <Text style={{paddingTop:200}}>Éssa é a home</Text>
        <Button title="Estabelecimento" onPress={() => navigation.navigate('Estabelecimento') }></Button>
      </SafeAreaView>
    )
}