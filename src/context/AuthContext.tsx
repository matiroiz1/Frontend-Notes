import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../services/authService";

interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null;
    login: (username: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Al cargar la app, verificamos si ya había sesión guardada
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        const user = localStorage.getItem('app_user');
        if (token && user) {
            setIsAuthenticated(true);
            setUsername(user);
        }
        setLoading(false);
    }, []);

    const login = (user: string, token: string) => {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('app_user', user);
        setIsAuthenticated(true);
        setUsername(user);
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUsername(null);
    };

    if (loading) return null; // O un spinner

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar el contexto fácil
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};