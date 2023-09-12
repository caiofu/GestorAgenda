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

export async function guardaWizardAtivo(valor){
    try{
        await AsyncStorage.setItem(
            'pulouTutorial',
             valor.toString(),
        );
        console.log('Salvo o status de "Pulou o tutorial" ');
    } catch(error)
    {
        console.log('Erro ao guardar o estado de pulou o tutoriol - asyn storage => ', error);
    }
}

export async function WizardAtivo() {
    try {
        const valorString = await AsyncStorage.getItem('pulouTutorial');
        
        if (valorString === 'true') {
          console.log('Wizard: true');
          return true;
        } else if (valorString === 'false') {
          console.log('Wizard: false');
          return false;
        } else {
          console.log('Valor inválido no AsyncStorage');
          guardaWizardAtivo('true');
          return true; // Ou qualquer outro valor padrão que você deseje usar
        }
      } catch (error) {
        console.log('Erro ao verificar o estado de "pulou o tutorial" - AsyncStorage', error);
        return false; // Ou qualquer outro valor padrão que você deseje usar em caso de erro
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