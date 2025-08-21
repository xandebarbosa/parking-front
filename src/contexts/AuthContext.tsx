"use client"

// biome-ignore assist/source/organizeImports: <explanation>
import { createContext, useState, useContext, type ReactNode } from "react";
import { api } from '@/services/api';
import { useRouter } from "next/navigation";

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextData {
    user: User | null;
    token: string | null;
    signIn: (credentials: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    async function signIn({ email, password }: any) {
        try {
            const response = await api.post('/sessions', { email, password });
            const { user, token } = response.data;

            //Armazenas dados
            setUser(user);
            setToken(token);

            // Configurar o token em todas as futuras requisiçoes do Axios
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Redirecionar para o dashboard ou outra pagina
            router.push('/');
        } catch (error) {
            console.error("Erro no login: ", error);
            throw new Error('Email ou senha inválidos.');
            
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}