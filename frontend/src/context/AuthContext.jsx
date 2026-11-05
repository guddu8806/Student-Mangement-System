import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem('user')) || null;
    });

    const [token, setToken] = useState(() => {
        const t = localStorage.getItem("token");
        return t && t !== "undefined" && t !== "null" ? t : null;
    });

    const login = (userData, tokenVal) => {
        setUser(userData || null);
        setToken(tokenVal || null);
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            localStorage.removeItem("user");
        }
        if (tokenVal) {
            localStorage.setItem("token", tokenVal);
        } else {
            localStorage.removeItem("token");
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
