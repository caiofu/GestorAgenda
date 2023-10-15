
import React, { useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Modal, Button } from 'react-native-paper';
import { useAppState } from "../Contexts/AppStateContext";

//CSS
import styles from './StyleWizard';
import { guardaWizardAtivo, WizardAtivo } from '../AsyncStorage/AsyncStorage';
import darkTheme from '../../Tema/darkTheme';
import lightTheme from '../../Tema/lightTheme';

export default function Wizard({ atualizarWizardAtivo }) {

    const [wizardAtivo, setWizardAtivo] = useState(null);
    const [passo, setPasso] = useState(1);

    
    const { tema} = useAppState();
    
    let totalPassos = 2;

    function ProximoPasso() {
        if (passo < totalPassos) {
            setPasso(passo + 1);
        }
    }

    function PassoAnterior() {
        if (passo > 1) {
            setPasso(passo - 1);
        }
    }

    function PularWizard() {

        guardaWizardAtivo('false');
        WizardAtivo().then(ret => {
            setWizardAtivo(ret);
            atualizarWizardAtivo(false)

        });

    }

    //VERIFICANDO NO ASYNC STORAGE O ESTADO ATUAL DO PULOU TUTORIAL
    WizardAtivo().then(ret => {
        setWizardAtivo(ret);

    });

  
    return (
        <View style={{ flex: 1 }}>
            <Modal animationType="slide" visible={wizardAtivo}>
                <View style={{ backgroundColor: tema === 'light' ? lightTheme.backgroundColor: darkTheme.backgroundColor, height: '100%' }}>
                    <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={PularWizard}>
                        <Text style={[styles.btnWizard, {color: tema === 'light' ? lightTheme.textColor : darkTheme.textColor}  ]}>Pular tutorial</Text>
                    </TouchableOpacity>
                    {passo === 1 && (
                        <View style={{ height: '83%' }}>
                            <Image source={require('../../assets/wizard/wizard-estabelecimento.gif')} style={{ width: '100%', height: '100%' }} />
                        </View>
                    )}
                </View>
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
                    {passo > 1 ?
                        <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={PassoAnterior}>
                            <Text style={[styles.btnWizard, {color: tema === 'light' ? lightTheme.textColor : darkTheme.textColor}  ]}>Anterior</Text>
                        </TouchableOpacity>
                        : <TouchableOpacity style={{ alignSelf: 'flex-start' }} />}


                    {/* <Button textColor='#006699'  style={{ alignSelf: 'flex-start' }} onPress={PassoAnterior}>Anterior</Button> */}
                    {passo == totalPassos ? <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={PularWizard}>
                        <Text style={[styles.btnWizard, {color: tema === 'light' ? lightTheme.textColor : darkTheme.textColor}  ]}>Terminar</Text>
                    </TouchableOpacity> : <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={ProximoPasso}>
                        <Text style={[styles.btnWizard, {color: tema === 'light' ? lightTheme.textColor : darkTheme.textColor}  ]}>Próximo</Text>
                    </TouchableOpacity>}

                </View>
            </Modal>
        </View>

    )
}