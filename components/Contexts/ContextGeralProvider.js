import React, { createContext, useContext, useState } from "react";

// Crie o contexto
export const ContextGeral = createContext({});

// Componente que envolve o conteúdo que deseja fornecer através do contexto
export default function ContextGeralProvider({ children }) 
{
    const [tutorialAtivo, setTutorialAtivo] = useState(true);
    const contextTutorialAtivo = {tutorialAtivo, setTutorialAtivo};
  // Defina o estado ou valores que deseja fornecer através do contexto
  const state = {
    // Seu estado aqui
  };
console.log("DENTRO DO CONTeXT",tutorialAtivo)
//AQUI A GENTE PEGA O ESTADO NO ASYNCSTOREGE E ATUALIZA PARA SABER SE JA FEZ O TUTORIAL
  return (
    <ContextGeral.Provider value={contextTutorialAtivo}>
      {children}
    </ContextGeral.Provider>
  );
}
