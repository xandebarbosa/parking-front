"use client";

import { ModalEdicao } from "@/components/ModalEdicao";
import { TabelaGerenciavel } from "@/components/TabelaGerenciavel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import type { CartaoEstacionamento } from "@/types";
import {
  AlertTriangle,
  Car,
  ParkingCircle,
  RefreshCw,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CardStatus = "expired" | "expiring" | "valid";

const ITEMS_PER_PAGE = 10;

interface StatusConfig {
  bgColor: string;
  textColor: string;  
}

const STATUS_CONFIGS: Record<CardStatus, StatusConfig> = {
  expired: {
    bgColor: "bg-red-500",
    textColor: "text-white",        
  },
  expiring: {
    bgColor: "bg-orange-500",
    textColor: "text-white",        
  },
  valid: {
    bgColor: "bg-green-500",
    textColor: "text-white",        
  },
};

const STATUS_ORDER: Record<CardStatus, number> = {
  expired: 0,
  expiring: 1,
  valid: 2,
};

export default function UpdateCartoesPage() {
  const [cartoes, setCartoes] = useState<CartaoEstacionamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCartao, setSelectCartao] =
    useState<CartaoEstacionamento | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useAuth();

  const fetchCartoes = async (showRefreshLoader = false) => {
    if (!token) return;

    try {
      if (showRefreshLoader) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await api.get("/vehicles");
      setCartoes(response.data);
    } catch (error) {
      toast.error("Não foi possível carregar os cartões.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchCartoes();
  }, [token]);

  const handleRefresh = () => {
    fetchCartoes(true);
  };

  const handleEdit = (cartao: CartaoEstacionamento) => {
    setSelectCartao(cartao);
    setIsEditModalOpen(true);
  };

  const handleDelete = (cartao: CartaoEstacionamento) => {
    setSelectCartao(cartao);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCartao) return;
    const promise = api.delete(`/vehicles/${selectedCartao.id}`);
    toast.promise(promise, {
      loading: "Excluindo cartão...",
      success: () => {
        // Atualização
        setCartoes((prevCartoes) =>
          prevCartoes.filter((c) => c.id !== selectedCartao.id),
        );
        setIsDeleteAlertOpen(false);
        return "Cartão excluído com sucesso!";
      },
      error: "Erro ao excluir o cartão.",
    });
  };

  const formatPlaca = (placa?: string) => {
    if (!placa) return "N/A";
    return placa.toUpperCase().replace(/(\w{3})(\w{4})/, "$1-$2");
  };

  // Componente de Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-slate-50 p-4 border-b">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={i} className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-amber-300 to-amber-500 mb-4 shadow-lg rounded-sm border border-[#14213d]">
      <div className="container mx-auto py-6 px-4">
        {/* Header da Página */}
        <div className="mb-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Gerenciamento de Cartões
              </h1>
              <p className="text-indigo-600 mt-1">
                Edite ou exclua cartões de estacionamento existentes
              </p>
            </div>
          </div>

          {/* Breadcrumb */}
          {/* <nav className="flex text-sm text-slate-500">
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span>Estacionamento</span>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-medium">
              Gerenciar Cartões
            </span>
          </nav> */}
        </div>

        {/* Card Principal */}
        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm py-0 pb-2">
          <CardHeader className="pb-2 rounded-t-lg border-b border-slate-200 bg-gradient-to-r from-white to-slate-50 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ParkingCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-800">
                    Cartões de Estacionamento
                  </CardTitle>
                  <CardDescription className="text-slate-600 mt-1">
                    Gerencie todos os cartões de estacionamento cadastrados no
                    sistema
                  </CardDescription>
                </div>
              </div>

              {!isLoading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {isRefreshing ? "Atualizando..." : "Atualizar"}
                </Button>
              )}
            </div>

            {/* Status Bar */}
            {!isLoading && (
              <div className="flex items-center gap-4 mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-600">
                    <strong className="text-slate-800">{cartoes.length}</strong>{" "}
                    cartões total
                  </span>
                </div>
                <div className="w-px h-4 bg-slate-300"></div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Car className="w-4 h-4" />
                  Sistema atualizado
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-0">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <TabelaGerenciavel
                cartoes={cartoes}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>

        {/* Modal de Edição */}
        <ModalEdicao
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          cartao={selectedCartao}
          onUpdateSuccess={() => {
            setIsEditModalOpen(false);
            fetchCartoes(true); // Recarrega com loader de refresh
            toast.success("Lista atualizada com sucesso!");
          }}
        />

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog
          open={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
        >
          <AlertDialogContent className="sm:max-w-lg">
            <AlertDialogHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <AlertDialogTitle className="text-xl text-slate-800">
                  Confirmar Exclusão
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-slate-600 leading-relaxed">
                Esta ação não pode ser desfeita. O cartão será permanentemente
                removido do sistema.
                {selectedCartao && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-slate-700">
                        Cartão #{selectedCartao.card_number}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <span className="text-slate-500">Placa:</span>
                      <span className="font-mono font-medium text-slate-800">
                        {formatPlaca(selectedCartao.placa)}
                      </span>
                    </div>
                    {selectedCartao.efetivo?.name && (
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-slate-500">Proprietário:</span>
                        <span className="font-medium text-slate-800">
                          {selectedCartao.efetivo.name}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-4 border-t border-slate-200">
              <AlertDialogCancel className="hover:bg-slate-100">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirmar Exclusão
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
