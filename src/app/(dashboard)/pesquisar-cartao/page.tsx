"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import type { CartaoEstacionamento } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CreditCard, Info, Loader2, Search, Terminal, Zap, History } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod"
import CardResultado from "./components/CardResultado";

// Schema de valicação para o formulário de busca
// const searchSchema = z.object({
//     cardNumber: z.string().min(1, "Digite o número do cartão."),
// });

// Schema de validação
const searchSchema = {
  parse: (data: any) => {
    if (!data.cardNumber || data.cardNumber.trim() === '') {
      throw new Error("Digite o número do cartão.");
    }
    return data;
  }
};
//type SearchFormData = z.infer<typeof searchSchema>;
type SearchFormData = {
  cardNumber: string;
};

export default function PesquisarCartaoPage() {
    const [searchResult, setSearchResult] = useState<CartaoEstacionamento | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);    
    const [searchHistory, setSearchHistory] = useState<string[]>(['']);
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
      const response = await api.get(`/vehicles/by-card-number/${values.cardNumber}`);
      
      setSearchResult(response.data);
      
      // Adiciona ao histórico (evita duplicatas)
      setSearchHistory(prev => {
        const newHistory = [values.cardNumber, ...prev.filter(item => item !== values.cardNumber)];
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
    form.setValue('cardNumber', cardNumber);
    handleSearch({ cardNumber });
  };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pesquisar Cartão</h1>
              <p className="text-gray-600">Encontre informações detalhadas do cartão de estacionamento</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Painel Principal de Busca */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-xl">Buscar Cartão de Estacionamento</CardTitle>
                    <CardDescription className="text-blue-100">
                      Digite o número do cartão para acessar todas as informações
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSearch)} className="space-y-4">
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
                                className="pl-10 h-12 text-lg border-2 focus:border-blue-500 focus:ring-blue-500"
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
                      className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
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
                      <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-700">Buscando cartão...</p>
                      <p className="text-sm text-gray-500">Isso pode levar alguns segundos</p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <Alert variant="destructive" className="mt-6 border-red-200 bg-red-50">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="text-red-800 font-semibold">Erro na Busca</AlertTitle>
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
                  <History className="h-5 w-5 text-purple-600" />
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
                      className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 transition-all duration-200 group"
                      disabled={isLoading}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 group-hover:text-blue-700">
                          Cartão {cardNumber}
                        </span>
                        <Zap className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
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
                    <p>Digite apenas números, sem espaços ou caracteres especiais</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                    <p>Use o histórico para acessar buscas recentes rapidamente</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                    <p>Verifique a validade do cartão na seção de resultados</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-amber-100 rounded-md border border-amber-200">
                  <p className="text-xs text-amber-800 font-medium">
                    💡 <strong>Dica:</strong> Experimente buscar por "12345" para ver um exemplo completo
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-700">1,247</div>
                  <p className="text-sm text-green-600">Cartões Ativos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    )
}
