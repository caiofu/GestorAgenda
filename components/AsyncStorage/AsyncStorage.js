import AsyncStorage from '@react-native-async-storage/async-storage';

export async function guardarPrimeiroAcesso() {
    try {
        await AsyncStorage.setItem(
            'primeiroAcesso',
            'false',
        );

        console.log('Primeiro acesso guardado com sucesso');

    } catch (error) {
        console.log('Erro ao guardar primeiro acesso - async storage');
    }
};

export async function houvePrimeiroAcesso() {
    try {
        const value = await AsyncStorage.getItem('primeiroAcesso');

        if (value !== null) {
            const data = JSON.parse(value);
            
            return false;

        } else return true;

    } catch (error) {
        console.log('Erro ao verificar primeiro acesso - async storage');
    }
};

export const removerAsyncStorage = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  
    console.log('Async storage limpo com sucesso');
  }