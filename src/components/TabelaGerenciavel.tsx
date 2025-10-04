import { CartaoEstacionamento } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { AlertCircle, Calendar, Car, CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Clock, CreditCard, Filter, ParkingCircle, Pencil, Search, Trash2, User, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";

type Props = {
  cartoes: CartaoEstacionamento[];
  onEdit: (cartao: CartaoEstacionamento) => void;
  onDelete: (cartao: CartaoEstacionamento) => void;
};

type CardStatus = {
  text: string;
  bgColor: string;
  textColor: string;
  icon: typeof CheckCircle2;
};

const ITEMS_PER_PAGE = 10;

export function TabelaGerenciavel({ cartoes = [], onEdit, onDelete }: Props) {

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  const isValidCard = (dateString?: string) => {
    if (!dateString) return false;
    const cardDate = new Date(dateString);
    const today = new Date();
    return cardDate > today;
  };

  const getCardStatus = (dateString?: string): CardStatus => {
    if (!dateString) {
      return { 
        text: "N/A", 
        bgColor: "bg-gray-400", 
        textColor: "text-white", 
        icon: AlertCircle 
      };
    }
    
    const cardDate = new Date(dateString);
    const today = new Date();
    const diffTime = cardDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: "Vencido",
        bgColor: "bg-red-600",
        textColor: "text-white",
        icon: AlertCircle,
      };
    }

    if (diffDays <= 7) {
      return {
        text: "Vence em breve",
        bgColor: "bg-orange-500",
        textColor: "text-white",
        icon: Clock,
      };
    }

    return {
      text: "Válido",
      bgColor: "bg-green-600",
      textColor: "text-white",
      icon: CheckCircle2,
    };
  };

  const formatPlaca = (placa?: string) => {
    if (!placa) return "N/A";
    // Formato brasileiro de placa (ABC-1234 ou ABC1D23)
    return placa.toUpperCase().replace(/(\w{3})(\w{4})/, '$1-$2');
  };

  // Filtrar cartões pela pesquisa
  const filteredCartoes = cartoes.filter((cartao) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      cartao.card_number?.toString().includes(searchLower) ||
      cartao.efetivo?.name?.toLowerCase().includes(searchLower) ||
      cartao.placa?.toLowerCase().includes(searchLower)
    );
  });

  const validCards = filteredCartoes.filter((c) => isValidCard(c.validadeCartao));
  const expiredCards = filteredCartoes.filter(
    (c) => !isValidCard(c.validadeCartao) && c.validadeCartao
  );

  // Cálculos de paginação
  const totalPages = Math.ceil(filteredCartoes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCartoes = filteredCartoes.slice(startIndex, endIndex);

  // Funções de navegação
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Resetar para primeira página ao pesquisar
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };
  
  return (
    <div className="space-y-4">
      {/* Card de Pesquisa com Accordion */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="py-1 px-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="search" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Filter className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold text-slate-800">
                      Filtros de Pesquisa
                    </h3>
                    <p className="text-sm text-slate-600">
                      {searchTerm
                        ? `Pesquisando: "${searchTerm}" - ${filteredCartoes.length} resultado(s)`
                        : "Clique para pesquisar cartões"}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Buscar por número do cartão, militar ou placa..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 pr-10 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      {searchTerm && (
                        <Button
                          onClick={clearSearch}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        onClick={clearSearch}
                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                      >
                        Limpar Filtros
                      </Button>
                    )}
                  </div>

                  {searchTerm && (
                    <div className="flex items-center gap-2 p-3 bg-blue-100 rounded-lg border border-blue-200">
                      <Search className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-800">
                        <strong>{filteredCartoes.length}</strong> cartão(ões) encontrado(s)
                        {filteredCartoes.length !== cartoes.length && (
                          <span className="ml-1">
                            de <strong>{cartoes.length}</strong> total
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Header da Tabela */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <ParkingCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Cartões de Estacionamento</h2>
            <p className="text-sm text-slate-600">
              {cartoes.length} {cartoes.length === 1 ? 'cartão cadastrado' : 'cartões cadastrados'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3" />
            Válidos: {validCards.length}
          </Badge>
          {expiredCards.length > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Vencidos: {expiredCards.length}
            </Badge>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold text-slate-700 py-4">
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Nº Cartão
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Militar
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Placa
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Validade
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 py-4 text-center">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCartoes.length > 0 ? (
              currentCartoes.map((cartao, index) => {
                const cardStatus = getCardStatus(cartao.validadeCartao);
                const StatusIcon = cardStatus.icon;

                return (
                  <TableRow
                    key={cartao.id}
                    className={`
                      transition-colors hover:bg-slate-50 
                      ${index % 2 === 0 ? "bg-white" : "bg-slate-25"}
                    `}
                  >
                    <TableCell className="font-medium text-center py-4">
                      <div className="flex items-center justify-center">
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-mono">
                          #{cartao.card_number}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">
                          {cartao?.efetivo?.name || "N/A"}
                        </span>
                        {cartao?.efetivo?.postoGrad && (
                          <span className="text-xs text-slate-500 mt-1">
                            {cartao.efetivo.postoGrad}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-slate-700 font-medium">
                          {formatPlaca(cartao?.placa)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex flex-col gap-2">
                        <div
                          className={`
                            inline-flex items-center gap-2 px-1.5 py-1.5 rounded-full
                            ${cardStatus.bgColor} ${cardStatus.textColor}
                            font-semibold text-xs tracking-wide shadow-sm
                            transition-all duration-200 hover:shadow-md
                            w-40 
                          `}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {cardStatus.text}
                        </div>
                        <div className="flex text-slate-600">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          <span className="text-sm font-bold">
                            {formatDate(cartao.validadeCartao)}
                          </span>                          
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center py-4">
                      <div className="flex justify-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onEdit(cartao)}
                              className="h-8 w-8 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar cartão</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onDelete(cartao)}
                              className="h-8 w-8 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir cartão</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                      <ParkingCircle className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="text-slate-500">
                      <p className="font-medium">Nenhum cartão encontrado</p>
                      <p className="text-sm text-slate-400">
                        Cadastre o primeiro cartão para começar
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer com Paginação e Estatísticas */}
      {cartoes.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>
              Total: <strong>{cartoes.length}</strong> cartões
            </span>
            <span className="text-slate-400">|</span>
            <span>
              Válidos: <strong className="text-green-600">{validCards.length}</strong>
            </span>
            <span className="text-slate-400">|</span>
            <span>
              Vencidos: <strong className="text-red-600">{expiredCards.length}</strong>
            </span>
            <span className="text-slate-400">|</span>
            <span>
              Taxa de validade:{" "}
              <strong>
                {cartoes.length > 0
                  ? Math.round((validCards.length / cartoes.length) * 100)
                  : 0}
                %
              </strong>
            </span>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
              <div className="text-sm text-slate-600">
                Mostrando <strong>{startIndex + 1}</strong> a{" "}
                <strong>{Math.min(endIndex, cartoes.length)}</strong> de{" "}
                <strong>{cartoes.length}</strong> cartões
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                      className="h-8 w-8"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Primeira página</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Página anterior</p>
                  </TooltipContent>
                </Tooltip>

                <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-md">
                  <span className="text-sm font-medium text-slate-700">
                    Página {currentPage} de {totalPages}
                  </span>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Próxima página</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Última página</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
