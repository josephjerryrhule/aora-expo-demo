import { getCurrentUser } from "lib/appwrite";
import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {

    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setisLoading] = useState(true);
    useEffect(() => {
        getCurrentUser().then((res) => {
            if (res) {
                setisLoggedIn(true);
                setUser(res)
            } else {
                setisLoggedIn(false)
                setUser(null)
            }
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setisLoading(false)
        })
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn, setisLoggedIn, user, setUser, isLoading
            }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;  