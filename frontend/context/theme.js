"use client"
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext({})
export const ThemeContextProvider = ({children}) => {
    
    const [IsAccountExist, setIsAccountExist] = useState(false)
    const [workflowStatus, setWorkflowStatus] = useState(1)
    const [sessionID,setSessionID] = useState(0)

    return (
        <ThemeContext.Provider value={{IsAccountExist, setIsAccountExist, workflowStatus, setWorkflowStatus, sessionID, setSessionID }}>
            {children}
        </ThemeContext.Provider>
    )
};

export const useThemeContext = () => useContext(ThemeContext);