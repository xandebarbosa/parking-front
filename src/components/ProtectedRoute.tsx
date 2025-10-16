"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Se já está na página de login, não precisa verificar
    if (pathname === "/login") {
      setIsLoading(false);
      setIsChecking(false);
      return;
    }

    // Pequeno delay para garantir que o localStorage foi carregado
    const checkAuth = setTimeout(() => {
      setIsChecking(false);
      if (!token || !user) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [token, user, router, pathname]);

  // Se estiver na página de login, renderiza sem verificação
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Mostra um loading enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">Verificando autenticação...</p>
            <p className="text-sm text-gray-500">Aguarde um momento</p>
          </div>
        </div>
      </div>
    );
  }

  // Se chegou aqui, o usuário está autenticado
  return <>{children}</>;
}