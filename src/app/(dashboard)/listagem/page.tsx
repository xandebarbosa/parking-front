"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

// Componentes que criamos e de UI
import { CardsValidityTable } from "@/components/CardsValidityTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Ótimo para feedback de loading

// Nossos tipos e serviço de API
import type { CartaoEstacionamento } from "@/types";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

// Componente de feedback para o estado de carregamento
function TabelaLoadingSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

export default function ListagemCartoesPage() {
  // Estados para gerenciar os dados, carregamento e erros
  const [cartoes, setCartoes] = useState<CartaoEstacionamento[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Começa como true para mostrar o loading inicial
  const { token } = useAuth();

  useEffect(() => {
    // Função async para buscar os dados
    const fetchCartoes = async () => {
      if (!token) {
        setIsLoading(false);
        // Não mostra toast aqui, pois o contexto de auth pode estar carregando
        return;
      }

      try {
        setIsLoading(true);
        // Configura o token para esta requisição, igual na sua página de cadastro
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Assumindo que a rota GET para buscar todos os veículos seja '/vehicles'
        const response = await api.get("/vehicles"); 

        console.log("Response ==> ", response);
        

        // O backend precisa retornar os dados do efetivo junto com o veículo
        setCartoes(response.data);

      } catch (error) {
        console.error("Erro ao buscar cartões de estacionamento:", error);
        toast.error("Não foi possível carregar a lista de cartões.");
      } finally {
        setIsLoading(false);
      }
    };
    console.log("fetchCartoes==>",fetchCartoes);
    fetchCartoes();
  }, [token]); // A dependência do token garante que a busca ocorra assim que ele estiver disponível

  console.log("setCartoes",setCartoes);
  //bg-gradient-to-r from-yellow-300 to-yellow-600
  
  return (
    <div className="mx-auto py-2">
      <Card className="bg-gradient-to-r from-amber-300 to-amber-500 mb-4 shadow-lg border border-[#14213d]">
        <CardHeader>
          <CardTitle className="text-[#001d3d]">Cartões de Estacionamento Ativos</CardTitle>
          <CardDescription className="text-[#003566]">
            Lista de todos os cartões cadastrados, ordenados por data de validade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TabelaLoadingSkeleton />
          ) : (
            <CardsValidityTable cartoes={cartoes} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}