"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/services/api";
import { toast } from "sonner";
import {
  AlertCircle,
  Badge,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";

interface SearchEfetivoModalProps {
  onEfetivoSelect: (efetivo: any) => void;
}

export function SearchEfetivoModal({
  onEfetivoSelect,
}: SearchEfetivoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEfetivo, setSelectedEfetivo] = useState<any | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  // Efeito para buscar na API quando o texto digitado muda
  useEffect(() => {
    if (debouncedSearchQuery.length > 2) {
      setLoading(true);
      setHasSearched(true);

      // 1. URL do endpoint foi atualizada para a rota genérica '/search'
      // 2. Usamos o objeto 'params' para passar os parâmetros de forma limpa e segura
      api
        .get("/efetivos/search", {
          params: {
            name: debouncedSearchQuery, // Envia o texto da busca para o parâmetro 'name'
            re: debouncedSearchQuery, // Envia O MESMO texto para o parâmetro 're'
          },
        })
        .then((response) => {
          setResults(response.data);

          // Adiciona ao histórico se houver resultados
          if (response.data.length > 0) {
            setSearchHistory((prev) => {
              const newHistory = [
                debouncedSearchQuery,
                ...prev.filter((item) => item !== debouncedSearchQuery),
              ];
              return newHistory.slice(0, 5);
            });
          }
        })
        .catch(() => toast.error("Erro ao buscar efetivos."))
        .finally(() => setLoading(false));
    } else {
      // Limpa os resultados se a busca for muito curta
      setResults([]);
      setHasSearched(false);
    }
  }, [debouncedSearchQuery]);

  const handleSelect = () => {
    if (selectedEfetivo) {
      onEfetivoSelect(selectedEfetivo);
      setSelectedEfetivo(null);
      setIsOpen(false); // Fecha o modal principal

      // Limpa a busca ao fechar
      setSearchQuery("");
      setResults([]);
      setHasSearched(false);
    }
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setHasSearched(false);
  };

  const getRankColor = (postoGrad: string) => {
    const colors = {
      Major: "bg-red-100 text-red-800",
      Capitão: "bg-blue-100 text-blue-800",
      Tenente: "bg-green-100 text-green-800",
      "1º Sgt": "bg-green-100 text-green-800",
      "Cb PM": "bg-yellow-100 text-yellow-800",
    };
    return (
      colors[postoGrad as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const EfetivoDescription = ({ efetivo }: any) => {
  if (!efetivo) {
    return null;
  }

  return `    
    Nome: ${efetivo.name}
    RE: ${efetivo.re}
    Posto/Grad: ${efetivo.postoGrad}
    OPM: ${efetivo.opm}    
  `;
};

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 outline-blue-500 h-11 bg-amber-300 text-white hover:bg-amber-400 hover:border-[#14213d] hover:text-[#14213d] transition-all duration-200"
          >
            <Users className="h-4 w-4" />
            Pesquisar Efetivo
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              Pesquisar Efetivo
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col space-y-4 py-4">
            {/* Área de Busca */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Digite o nome ou RE para pesquisar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-12 text-base border-2 focus:border-blue-500 focus:ring-blue-500"
                />
                {searchQuery && (
                  <Button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Histórico de Buscas */}
              {searchHistory.length > 0 && !searchQuery && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Buscas recentes:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((term, index) => (
                      <Button
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        key={index}
                        onClick={() => handleQuickSearch(term)}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full transition-colors duration-200 border border-gray-200 hover:border-blue-300"
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dicas de Busca */}
              {!searchQuery && !hasSearched && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-blue-800">
                        Como pesquisar:
                      </p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>
                          • Digite pelo menos 3 caracteres para iniciar a busca
                        </li>
                        <li>
                          • Você pode buscar por nome e RE
                        </li>
                        <li>
                          • A busca é feita automaticamente conforme você digita
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Área de Resultados */}
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-medium text-gray-700">
                      Buscando efetivos...
                    </p>
                    <p className="text-sm text-gray-500">Aguarde um momento</p>
                  </div>
                </div>
              ) : hasSearched &&
                results.length === 0 &&
                searchQuery.length > 2 ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-medium text-gray-700">
                      Nenhum efetivo encontrado
                    </p>
                    <p className="text-sm text-gray-500">
                      Tente usar outros termos de busca
                    </p>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2 overflow-y-auto max-h-96">
                  {results.map((efetivo) => (
                    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
                    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                    <div
                      key={efetivo.id}
                      onClick={() => setSelectedEfetivo(efetivo)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="p-2 bg-gray-100 group-hover:bg-blue-100 rounded-lg transition-colors duration-200">
                            <User className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-900 truncate">
                                {efetivo.name}
                              </h3>
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getRankColor(efetivo.postoGrad)}`}
                              >
                                {efetivo.postoGrad}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Badge className="h-3 w-3" />
                                <span>RE: {efetivo.re}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Filter className="h-3 w-3" />
                                <span>{efetivo.opm}</span>
                              </div>
                              {efetivo.funcao && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>{efetivo.funcao}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-gray-400 group-hover:text-blue-600 transition-colors duration-200">
                          <UserCheck className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Rodapé com informações */}
            {results.length > 0 && (
              <div className="border-t pt-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{results.length} efetivo(s) encontrado(s)</span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Clique em um efetivo para selecioná-lo
                  </span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação */}
      <AlertDialog
        open={!!selectedEfetivo}
        onOpenChange={() => setSelectedEfetivo(null)}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <AlertDialogTitle className="text-lg">
                Confirmar Seleção
              </AlertDialogTitle>
            </div>  
            <AlertDialog><p className="text-gray-400 text-base">Você está selecionando o seguinte efetivo:</p></AlertDialog>          
            <AlertDialogDescription className="text-gray-600 space-y-1 whitespace-pre-line"> 
              <EfetivoDescription  efetivo={selectedEfetivo} />
            </AlertDialogDescription>
            <AlertDialog><p className="text-gray-400 text-base mb-1">Deseja continuar com esta seleção?</p></AlertDialog>             
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="flex-1">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSelect}
              className="flex-1 bg-green-600 hover:bg-green-700 focus:ring-green-500"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
