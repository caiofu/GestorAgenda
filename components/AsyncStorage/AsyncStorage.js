import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export async function guardarPrimeiroAcesso() {
  try {
    await AsyncStorage.setItem(
      'primeiroAcesso',
      'false',
    );

    // console.log('Primeiro acesso guardado com sucesso');

  } catch (error) {
    // console.log('Erro ao guardar primeiro acesso - async storage');
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
    // console.log('Erro ao verificar primeiro acesso - async storage');
  }
};

export async function guardaWizardAtivo(valor) {
  try {
    await AsyncStorage.setItem(
      'pulouTutorial',
      valor.toString(),
    );
    // console.log('Salvo o status de "Pulou o tutorial" ');
  } catch (error) {
    // console.log('Erro ao guardar o estado de pulou o tutoriol - asyn storage => ', error);
  }
}

export async function WizardAtivo() {
  try {
    const valorString = await AsyncStorage.getItem('pulouTutorial');

    if (valorString === 'true') {
      // console.log('Wizard: true');
      return true;
    } else if (valorString === 'false') {
      // console.log('Wizard: false');
      return false;
    } else {
      // console.log('Valor inválido no AsyncStorage');
      guardaWizardAtivo('true');
      return true; // Ou qualquer outro valor padrão que você deseje usar
    }
  } catch (error) {
    // console.log('Erro ao verificar o estado de "pulou o tutorial" - AsyncStorage', error);
    return false; // Ou qualquer outro valor padrão que você deseje usar em caso de erro
  }
};

export async function SalvaTema(tema) {

  try {
    // console.log('salvo no async -->', tema)
    await AsyncStorage.setItem('temaAtual', tema);

  } catch (error) {
    // console.log('ERRO VALOR DO TEMA ASYNC', tema)
    // console.log('Erro ao criar async slavaTema -> ', error);
  }
}


export async function VerificaTema() {
  try {
    const temaSalvo = await AsyncStorage.getItem('temaAtual');

    // console.log('TEMA SALVO ----------->',temaSalvo)
    temaSalvo === null ? '' : temaSalvo; //Null foi tirado para nao dar erro.

    return temaSalvo;
  } catch (error) {
    // console.log('Não foi possivel verificar o tema -> ', error);
    return error;
  }
}

export async function RemoveTemaAsync() {
  try {
    await AsyncStorage.removeItem('temaAtual');
    // console.log('Valor do temaAtual removido com sucesso.');
  } catch (error) {
    // console.log('Erro ao remover valor do temaAtual:', error);
  }
}

export const removerAsyncStorage = async () => {
  try {
    await AsyncStorage.clear()
  } catch (e) {
    // clear error
  }

  // console.log('Async storage limpo com sucesso');
}

export async function setUsaTemaSistema(usaTemaSistema) {
  // Guarda 'true' ou 'false' em string
  try {
    await AsyncStorage.setItem('usaTemaSistema', usaTemaSistema);
  } catch (error) {
    // console.log('Erro em setUsaTemaSistema()");
  }
}

export async function getUsaTemaSistema() {
  // Retorna 'true' ou 'false' em string
  try {
    const valor = await AsyncStorage.getItem('usaTemaSistema');
    return valor;
  } catch (error) {
    // console.log('Erro em getUsaTemaSistema()');
  }
}
