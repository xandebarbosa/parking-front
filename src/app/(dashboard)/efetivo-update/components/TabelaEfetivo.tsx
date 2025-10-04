import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Efetivo } from "@/types";
import {
  AlertCircle,
  Building,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Filter,
  Pencil,
  Search,
  Shield,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";

type Props = {
  efetivos: Efetivo[];
  onEdit: (efetivo: Efetivo) => void;
  onDelete: (efetivo: Efetivo) => void;
};

type CardStatus = {
  text: string;
  bgColor: string;
  textColor: string;
  icon: typeof CheckCircle2;
};

const ITEMS_PER_PAGE = 10;

export default function TabelaEfetivo({
  efetivos = [],
  onEdit,
  onDelete,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  const isValidCNH = (dateString?: string) => {
    if (!dateString) return false;
    const cnhDate = new Date(dateString);
    const today = new Date();
    return cnhDate > today;
  };

  const getCNHStatus = (dateString?: string): CardStatus => {
    if (!dateString) {
      return {
        text: "N/A",
        bgColor: "bg-gray-400",
        textColor: "text-white",
        icon: AlertCircle,
      };
    }

    const cnhDate = new Date(dateString);
    const today = new Date();
    const diffTime = cnhDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: "Vencida",
        bgColor: "bg-red-600",
        textColor: "text-white",
        icon: AlertCircle,
      };
    } else if (diffDays <= 30) {
      return {
        text: "Vence em breve",
        bgColor: "bg-orange-500",
        textColor: "text-white",
        icon: Clock,
      };
    } else if (diffDays <= 90) {
      return {
        text: "Atenção",
        bgColor: "bg-gray-600",
        textColor: "text-white",
        icon: CheckCircle2,
      };
    } else {
      return {
        text: "Válida",
        bgColor: "bg-green-600",
        textColor: "text-white",
        icon: CheckCircle2,
      };
    }
  };

  // Normaliza string removendo acentos e convertendo para minúsculas
  const normalizeString = (str: string | number | undefined): string => {
    if (str === undefined || str === null) return "";
    return String(str)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const filteredEfetivos = useMemo(() => {
    if (!searchTerm.trim()) return efetivos;

    const normalizedSearch = normalizeString(searchTerm);

    return efetivos.filter((efetivo) => {
      const normalizedName = normalizeString(efetivo.name);
      const normalizedRe = normalizeString(efetivo.re);
      const normalizedOpm = normalizeString(efetivo.opm);
      const normalizedPostoGrad = normalizeString(efetivo.postoGrad);

      return (
        normalizedName.includes(normalizedSearch) ||
        normalizedRe.includes(normalizedSearch) ||
        normalizedOpm.includes(normalizedSearch) ||
        normalizedPostoGrad.includes(normalizedSearch)
      );
    });
  }, [efetivos, searchTerm]);



 // Estatísticas de CNH
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
   const { validCnh, expiredCnh } = useMemo(() => {
    const valid = filteredEfetivos.filter((e) => isValidCNH(e.valCnh));
    const expired = filteredEfetivos.filter(
      (e) => !isValidCNH(e.valCnh) && e.valCnh
    );
    return { validCnh: valid, expiredCnh: expired };
  }, [filteredEfetivos]);

  // Cálculos de paginação
  const totalPages = Math.ceil(filteredEfetivos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEfetivos = filteredEfetivos.slice(startIndex, endIndex);

  // Funções de navegação
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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
                        ? `Pesquisando: "${searchTerm}" - ${filteredEfetivos.length} resultado(s)`
                        : "Clique para pesquisar efetivo"}
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
                        placeholder="Buscar por nome do efetivo, RE ou Posto/Graduação..."
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
                        <strong>{filteredEfetivos.length}</strong> efetivo(s) encontrado(s)
                        {filteredEfetivos.length !== efetivos.length && (
                          <span className="ml-1">
                            de <strong>{efetivos.length}</strong> total
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
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Efetivo Cadastrado
            </h2>
            <p className="text-sm text-slate-600">
              {efetivos.length}{" "}
              {efetivos.length === 1
                ? "militar cadastrado"
                : "militares cadastrados"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            CNH Válida: {validCnh.length}
          </Badge>
          {expiredCnh.length > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              CNH Vencida: {expiredCnh.length}
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
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  RE
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Posto/Grad.
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  OPM
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Validade CNH
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 py-4 text-center">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEfetivos.length > 0 ? (
              currentEfetivos.map((efetivo, index) => {
                const cnhStatus = getCNHStatus(efetivo.valCnh);
                const StatusIcon = cnhStatus.icon;

                return (
                  <TableRow
                    key={efetivo.id}
                    className={`
                        transition-colors hover:bg-slate-50 
                        ${index % 2 === 0 ? "bg-white" : "bg-slate-25"}
                    `}
                  >
                    <TableCell className="font-bold text-center py-4">
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-mono">
                        {efetivo.re}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">
                          {efetivo.name}
                        </span>
                        {efetivo.funcao && (
                          <span className="text-xs text-slate-500 mt-1">
                            {efetivo.funcao}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className="font-semibold">
                        {efetivo.postoGrad}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-slate-700 font-medium">
                        {efetivo.opm}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-2">
                        <div
                          className={`
                            inline-flex items-center gap-2 px-1.5 py-1.5 rounded-full
                            ${cnhStatus.bgColor} ${cnhStatus.textColor}
                            font-semibold text-xs tracking-wide shadow-sm
                            transition-all duration-200 hover:shadow-md
                            w-40
                          `}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {cnhStatus.text}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm font-bold">
                            {formatDate(efetivo.valCnh)}
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
                              onClick={() => onEdit(efetivo)}
                              className="h-8 w-8 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar informações</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onDelete(efetivo)}
                              className="h-8 w-8 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir militar</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="text-slate-500">
                      <p className="font-medium">Nenhum militar encontrado</p>
                      <p className="text-sm text-slate-400">
                        Cadastre o primeiro militar para começar
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
      {efetivos.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>
              Total: <strong>{efetivos.length}</strong> militares
            </span>
            <span className="text-slate-400">|</span>
            <span>
              CNH Válida:{" "}
              <strong className="text-green-600">
                {validCnh.length}
              </strong>
            </span>
            <span className="text-slate-400">|</span>
            <span>
              CNH Vencida:{" "}
              <strong className="text-red-600">
                {expiredCnh.length}
              </strong>
            </span>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
              <div className="text-sm text-slate-600">
                Mostrando <strong>{startIndex + 1}</strong> a{" "}
                <strong>{Math.min(endIndex, efetivos.length)}</strong> de{" "}
                <strong>{efetivos.length}</strong> cartões
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
