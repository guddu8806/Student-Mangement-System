import { createContext, useState, useContext, useEffect } from 'react';
import { getMe } from '../services/api/auth.api';
import { FullScreenLoader } from '../components/common/Loader';

const AuthContext = createContext();

const readStoredToken = () => {
    const t = localStorage.getItem('token');
    return t && t !== 'undefined' && t !== 'null' ? t : null;
};

const readStoredUser = () => {
    try {
        const raw = localStorage.getItem('user');
        if (!raw || raw === 'undefined' || raw === 'null') return null;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        localStorage.removeItem('user');
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(readStoredToken);
    const [user, setUser] = useState(() => (readStoredToken() ? readStoredUser() : null));
    const [isInitializing, setIsInitializing] = useState(() => Boolean(readStoredToken()));

    useEffect(() => {
        let cancelled = false;

        const fetchCurrentUser = async () => {
            if (!token) {
                setUser(null);
                setIsInitializing(false);
                return;
            }
            try {
                const resp = await getMe();
                if (cancelled) return;
                const verifiedUser = resp?.user ?? null;
                if (!verifiedUser) {
                    throw new Error('Invalid user payload');
                }
                setUser(verifiedUser);
                localStorage.setItem('user', JSON.stringify(verifiedUser));
            } catch {
                if (cancelled) return;
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                if (!cancelled) {
                    setIsInitializing(false);
                }
            }
        };
        fetchCurrentUser();
        return () => {
            cancelled = true;
        };
    }, [token]);

    const login = (userData, tokenVal) => {
        const normalizedUser = userData?.user ?? userData ?? null;
        const normalizedToken = tokenVal && tokenVal !== 'undefined' && tokenVal !== 'null' ? tokenVal : null;

        setUser(normalizedUser);
        setToken(normalizedToken);
        setIsInitializing(false);

        if (normalizedUser) {
            localStorage.setItem('user', JSON.stringify(normalizedUser));
        } else {
            localStorage.removeItem('user');
        }

        if (normalizedToken) {
            localStorage.setItem('token', normalizedToken);
        } else {
            localStorage.removeItem('token');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsInitializing(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    if (isInitializing) {
        return <FullScreenLoader text="Checking session..." />;
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
