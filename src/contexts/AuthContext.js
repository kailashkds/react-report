import {createContext, useState} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [username, setUsername] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    return (
        <AuthContext.Provider
            value={{username, setUsername, userId, setUserId, isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};