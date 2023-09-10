
import React, { useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native';
import {Modal, Button } from 'react-native-paper';

//CSS
import styles from './StyleWizard';
import { guardaWizardAtivo, WizardAtivo } from '../AsyncStorage/AsyncStorage'; 

export default function Wizard({atualizarWizardAtivo})
{
    
    const [wizardAtivo, setWizardAtivo] = useState(null);
    const [passo, setPasso] = useState(1);
 
    let totalPassos = 2;

    function ProximoPasso()
    {
        if(passo < totalPassos)
        {
            setPasso(passo+ 1);
        }
    }

    function PassoAnterior()
    {
        if(passo > 1)
        {
            setPasso(passo -1);
        }
    }

    function PularWizard()
    {
   
       guardaWizardAtivo('false');
       WizardAtivo().then(ret => {
        setWizardAtivo(ret);
        atualizarWizardAtivo(false)
       console.log('reeeeeeet', ret)
      });

    }

    //VERIFICANDO NO ASYNC STORAGE O ESTADO ATUAL DO PULOU TUTORIAL
    WizardAtivo().then(ret => {
        setWizardAtivo(ret);
      
      });
   
   // console.log(passo)
    return(
        <View style={{ flex: 1 }}>
            <Modal animationType="slide" visible={wizardAtivo}>
                <View style={{ backgroundColor: '#fff', height: '100%' }}>
                <TouchableOpacity style={{ alignSelf: 'flex-end'}} onPress={PularWizard}>
                   <Text style={styles.btnWizard}>Pular tutorial</Text>
                </TouchableOpacity>
                    {passo === 1 && (
                        <View style={{ height:'90%'}}>
                            <Image source={require('../../assets/wizard/wizard_estabelecimento.gif')} style={{width:'100%', height:'100%'}}/>
                        </View>
                    )}
                </View>
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
                   {passo > 1 ?
                    <TouchableOpacity style={{ alignSelf: 'flex-start'}} onPress={PassoAnterior}>
                        <Text style={styles.btnWizard}>Anterior</Text>
                    </TouchableOpacity>
                    :  <TouchableOpacity style={{ alignSelf: 'flex-start'}} />}

                   
                    {/* <Button textColor='#006699'  style={{ alignSelf: 'flex-start' }} onPress={PassoAnterior}>Anterior</Button> */}
                    {passo == totalPassos ?   <TouchableOpacity style={{ alignSelf: 'flex-end'}} onPress={PularWizard}>
                                                <Text style={styles.btnWizard}>Terminar</Text>
                                             </TouchableOpacity> : <TouchableOpacity style={{ alignSelf: 'flex-end'}} onPress={ProximoPasso}>
                                                                        <Text style={styles.btnWizard}>Próximo</Text>
                                                                    </TouchableOpacity>}
                 
                </View>
            </Modal>
        </View>

    )
}