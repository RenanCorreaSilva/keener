//Condição de login(navbar)
import React, { createContext, useContext, useState, useEffect} from 'react';
import api from '../services/api'

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [user, setUser] = useState(null); // 



    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken && !user) { 
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            api.get('/auth/me')
               .then(response => {
                   setUser(response.data);
               })
               .catch((error) => {
                   logout(); 
               });
        } else if (!storedToken) {
            if (user) {
                setUser(null);
            }
        }
    }, [token, user, logout]); 

    function login(newToken, userData) {
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        setToken(newToken);
        setUser(userData);
    }

    function logout() {
        localStorage.removeItem('token');
        api.defaults.headers.common['Authorization'] = null;
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    return useContext(AuthContext);
}