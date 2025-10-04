"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import type { CartaoEstacionamento } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CreditCard,
  Info,
  Loader2,
  Search,
  Terminal,
  Zap,
  History,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import CardResultado from "./components/CardResultado";
import { ActiveCardsWidget } from "@/components/ActiveCardsWidget";

// Schema de valicação para o formulário de busca
// const searchSchema = z.object({
//     cardNumber: z.string().min(1, "Digite o número do cartão."),
// });

// Schema de validação
const searchSchema = {
  parse: (data: any) => {
    if (!data.cardNumber || data.cardNumber.trim() === "") {
      throw new Error("Digite o número do cartão.");
    }
    return data;
  },
};
//type SearchFormData = z.infer<typeof searchSchema>;
type SearchFormData = {
  cardNumber: string;
};

export default function PesquisarCartaoPage() {
  const [searchResult, setSearchResult] = useState<CartaoEstacionamento | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([""]);
  const { token } = useAuth();

  const form = useForm<SearchFormData>({
    defaultValues: { cardNumber: "" },
  });

  async function handleSearch(values: SearchFormData) {
    try {
      searchSchema.parse(values);
    } catch (error: any) {
      toast.error(error.message);
      return;
    }

    if (!token) {
      toast.error("Sessão expirada. Faça o login novamente.");
      return;
    }

    setIsLoading(true);
    setSearchResult(null);
    setError(null);

    try {
      const response = await api.get(
        `/vehicles/by-card-number/${values.cardNumber}`,
      );

      setSearchResult(response.data);

      // Adiciona ao histórico (evita duplicatas)
      setSearchHistory((prev) => {
        const newHistory = [
          values.cardNumber,
          ...prev.filter((item) => item !== values.cardNumber),
        ];
        return newHistory.slice(0, 5); // Mantém apenas os 5 últimos
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError("Nenhum cartão encontrado com esse número.");
        toast.error("Nenhum cartão encontrado com esse número.");
      } else {
        setError("Ocorreu um erro ao buscar. Tente novamente.");
        toast.error("Falha na comunicação com o servidor.");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleQuickSearch = (cardNumber: string) => {
    form.setValue("cardNumber", cardNumber);
    handleSearch({ cardNumber });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-t-lg">
      {/* Header */}
      <div className="bg-[#14213d] backdrop-blur-sm border-b border-yellow-300 sticky top-0 z-10 rounded-t-lg">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-yellow-300">
                Pesquisar Cartão
              </h1>
              <p className="text-gray-200">
                Encontre informações detalhadas do cartão de estacionamento
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Painel Principal de Busca */}
          <div className="lg:col-span-2 space-y-3">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden py-0 pb-2">
              <CardHeader className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white pb-2 pt-0 relative overflow-hidden">
                {/* Padrão decorativo sutil no fundo */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                <div className="flex items-center gap-3 p-4 relative z-10">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight">
                      Buscar Cartão de Estacionamento
                    </CardTitle>
                    <CardDescription className="text-amber-50 font-medium">
                      Digite o número do cartão para acessar todas as
                      informações
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-6 py-1">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSearch)}
                    className="space-y-4"
                  >
                    <FormField
                      name="cardNumber"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium text-gray-700 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Número do Cartão
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Ex: 12345, 67890..."
                                className="pl-10 h-12 text-lg border-2 focus:border-amber-500 focus:ring-amber-500"
                                {...field}
                              />
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-58 h-12 text-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Pesquisando...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" />
                          Pesquisar Cartão
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                {/* Loading State */}
                {isLoading && (
                  <div className="mt-8 flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-700">
                        Buscando cartão...
                      </p>
                      <p className="text-sm text-gray-500">
                        Isso pode levar alguns segundos
                      </p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <Alert
                    variant="destructive"
                    className="mt-6 border-red-200 bg-red-50"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="text-red-800 font-semibold">
                      Erro na Busca
                    </AlertTitle>
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Resultado da Pesquisa */}
            {searchResult && (
              <div className="animate-in slide-in-from-bottom-5 duration-500">
                <CardResultado cartao={searchResult} />
              </div>
            )}
          </div>

          {/* Painel Lateral */}
          <div className="space-y-6">
            {/* Histórico de Buscas */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                  <History className="h-5 w-5 text-amber-600" />
                  Buscas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {searchHistory.length > 0 ? (
                  searchHistory.map((cardNumber, index) => (
                    <Button
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={index}
                      onClick={() => handleQuickSearch(cardNumber)}
                      className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-amber-50 hover:border-amber-200 border border-gray-200 transition-all duration-200 group"
                      disabled={isLoading}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 group-hover:text-amber-700">
                          Cartão {cardNumber}
                        </span>
                        <Zap className="h-4 w-4 text-gray-400 group-hover:text-amber-600" />
                      </div>
                    </Button>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma busca recente</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dicas de Uso */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                  <Info className="h-5 w-5 text-amber-600" />
                  Dicas de Uso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-amber-700">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                    <p>
                      Digite apenas números, sem espaços ou caracteres especiais
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                    <p>
                      Use o histórico para acessar buscas recentes rapidamente
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                    <p>Verifique a validade do cartão na seção de resultados</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-100 rounded-md border border-amber-200">
                  <p className="text-xs text-amber-800 font-medium">
                    💡 <strong>Dica:</strong> Experimente buscar por "12345"
                    para ver um exemplo completo
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <ActiveCardsWidget />            
          </div>
        </div>
      </div>
    </div>
  );
}
