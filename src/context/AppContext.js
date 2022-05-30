import {createContext, useEffect, useState} from 'react';

export const AppContext = createContext();

export const AppProvider = ({children}) => {
    const [activeFilter, setActiveFilter] = useState(false);

     
    /**
     * Handle "state" in AppContext because context is not persistent.
     * We store "state" in sessionStorage
     */
    useEffect(() => {
        const activeFilter = sessionStorage.getItem("activeFilter");
        
        if(typeof activeFilter === "string"){
            setActiveFilter(activeFilter === "true"? true : false);
        }
    }, []);

    const handleActiveFilter = (action) => {
        if(typeof action === "boolean"){
            sessionStorage.setItem("activeFilter", action);
            setActiveFilter(action);
        }else{
            sessionStorage.setItem("activeFilter", !activeFilter);
            setActiveFilter(activeFilter => !activeFilter);
        }
    }

    return (
        <AppContext.Provider value={{
            activeFilter,
            handleActiveFilter
        }}>
            {children}
        </AppContext.Provider>
    );
}


