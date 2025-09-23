"use client";

// biome-ignore assist/source/organizeImports: <explanation>
import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  signIn: (credentials: any) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // NOVO: Efeito para carregar o token do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("@ParkingApp:token");
    const storedUser = localStorage.getItem("@ParkingApp:user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  async function signIn({ email, password }: any) {
    try {
      const response = await api.post("/sessions", { email, password });
      const { user, token } = response.data;

      //Armazenas dados
      setUser(user);
      setToken(token);
      localStorage.setItem("@ParkingApp:user", JSON.stringify(user));
      localStorage.setItem("@ParkingApp:token", token);

      // Configurar o token em todas as futuras requisiçoes do Axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirecionar para o dashboard ou outra pagina
      router.push("/");
    } catch (error) {
      console.error("Erro no login: ", error);
      throw new Error("Email ou senha inválidos.");
    }
  }

  // NOVO: Função para fazer logout e limpar o localStorage
  const signOut = () => {
    // 1. Limpa os dados de autenticação do estado da aplicação
    setUser(null);
    setToken(null);

    // 2. Remove o token e o usuário do localStorage
    localStorage.removeItem("@ParkingApp:user");
    localStorage.removeItem("@ParkingApp:token");

    // 3. Limpa o cabeçalho de autorização padrão do Axios
    delete api.defaults.headers.common["Authorization"]; // Limpa o header do Axios

    // 4. Redireciona o usuário para a página de login
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
