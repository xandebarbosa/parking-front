import type { TabelaCartoesValidadeProps } from "@/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type CardStatus = "expired" | "expiring" | "valid";

const ITEMS_PER_PAGE = 10;

interface StatusConfig {
  bgColor: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
  label: string;
}

const STATUS_CONFIGS: Record<CardStatus, StatusConfig> = {
  expired: {
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    borderColor: "border-red-500",
    dotColor: "bg-red-400",
    label: "Vencidos",
  },
  expiring: {
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    borderColor: "border-orange-500",
    dotColor: "bg-orange-400",
    label: "A vencer",
  },
  valid: {
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    borderColor: "border-green-500",
    dotColor: "bg-green-400",
    label: "Válidos",
  },
};

const STATUS_ORDER: Record<CardStatus, number> = {
  expired: 0,
  expiring: 1,
  valid: 2,
};

const DAYS_TO_EXPIRE = 30;

export function CardsValidityTable({
  cartoes = [],
}: TabelaCartoesValidadeProps) {

  const [currentPage, setCurrentPage] = useState(1);
   
  const getCardStatus = (dateString?: string): CardStatus => {
    if (!dateString) return "expired";

    const cardDate = new Date(dateString);
    const today = new Date();
    const diffTime = cardDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "expired";
    if (diffDays <= DAYS_TO_EXPIRE) return "expiring";
    return "valid";
  };

  const sortedCards = [...cartoes].sort((a, b) => {
    const statusA = getCardStatus(a.validadeCartao);
    const statusB = getCardStatus(b.validadeCartao);

    if (statusA !== statusB) {
      return STATUS_ORDER[statusA] - STATUS_ORDER[statusB];
    }

    return (
      new Date(a.validadeCartao).getTime() -
      new Date(b.validadeCartao).getTime()
    );
  });

  // TypeScript infere que 'a' e 'b' são do tipo 'CartaoEstacionamento'
  const sortedCartoes = [...cartoes].sort(
    (a, b) =>
      new Date(b.validadeCartao).getTime() -
      new Date(a.validadeCartao).getTime(),
  );

  // Tipamos o parâmetro da função para mais segurança
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  const getStatusCounts = () => {
    return {
      valid: sortedCards.filter(
        (c) => getCardStatus(c.validadeCartao) === "valid",
      ).length,
      expiring: sortedCards.filter(
        (c) => getCardStatus(c.validadeCartao) === "expiring",
      ).length,
      expired: sortedCards.filter(
        (c) => getCardStatus(c.validadeCartao) === "expired",
      ).length,
    };
  };

  const statusCounts = getStatusCounts();

  // Paginação
  const totalPages = Math.ceil(sortedCards.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCards = sortedCards.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden backdrop-blur-sm">
      <CardTableHeader totalCards={sortedCards.length} />
      <TableContent
        cards={sortedCards}
        getCardStatus={getCardStatus}
        formatDate={formatDate}
      />
      {sortedCards.length > 0 && (
        <>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={sortedCards.length}
            startIndex={startIndex}
            endIndex={Math.min(endIndex, sortedCards.length)}
          />
          <CardTableFooter statusCounts={statusCounts} />
        </>
      )}
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

function Pagination({ currentPage, totalPages, onPageChange, totalItems, startIndex, endIndex }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Mostrando <span className="font-semibold">{startIndex + 1}</span> a <span className="font-semibold">{endIndex}</span> de <span className="font-semibold">{totalItems}</span> registros
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              currentPage === 1
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300 shadow-sm"
            )}
          >
            <ChevronLeftIcon />
          </Button>
          
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
index}`} className="px-3 py-2 text-slate-400">
                ...
              </span>
            ) : (
              <Button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300 shadow-sm"
                )}
              >
                {page}
              </Button>
            )
          ))}
          
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              currentPage === totalPages
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300 shadow-sm"
            )}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CardTableHeader({ totalCards }: { totalCards: number }) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Cartões de Estacionamento
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Gerenciamento e controle de cartões ativos
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <CardIcon />
          <span>{totalCards} registros</span>
        </div>
      </div>
    </div>
  );
}

interface TableContentProps {
  cards: any[];
  getCardStatus: (date?: string) => CardStatus;
  formatDate: (date?: string) => string;
}

function TableContent({ cards, getCardStatus, formatDate }: TableContentProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150 border-b border-slate-200 transition-all duration-200">
          <TableHead className="w-[140px] text-slate-700 font-semibold text-sm uppercase tracking-wide py-4 px-6">
            <HeaderCell icon={<CardIcon />} label="Nº Cartão" />
          </TableHead>
          <TableHead className="text-slate-700 font-semibold text-sm uppercase tracking-wide py-4 px-6">
            <HeaderCell icon={<UserIcon />} label="Militar" />
          </TableHead>
          <TableHead className="text-slate-700 font-semibold text-sm uppercase tracking-wide py-4 px-6">
            <HeaderCell icon={<DocumentIcon />} label="Placa" />
          </TableHead>
          <TableHead className="text-slate-700 font-semibold text-sm uppercase tracking-wide py-4 px-6">
            <HeaderCell icon={<BuildingIcon />} label="Modelo" />
          </TableHead>
          <TableHead className="text-center font-semibold text-sm uppercase tracking-wide py-4 px-6">
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <CalendarIcon />
              <span>Validade</span>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <CardRow
              key={card.id}
              card={card}
              index={index}
              totalCards={cards.length}
              status={getCardStatus(card.validadeCartao)}
              formatDate={formatDate}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </TableBody>
    </Table>
  );
}

interface HeaderCellProps {
  icon: React.ReactNode;
  label: string;
}

function HeaderCell({ icon, label }: HeaderCellProps) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span>{label}</span>
    </div>
  );
}

interface CardRowProps {
  card: any;
  index: number;
  totalCards: number;
  status: CardStatus;
  formatDate: (date?: string) => string;
}

function CardRow({
  card,
  index,
  totalCards,
  status,
  formatDate,
}: CardRowProps) {
  const config = STATUS_CONFIGS[status];

  return (
    <TableRow
      className={cn(
        "border-slate-100 hover:bg-slate-50/50 transition-all duration-200 group",
        { "border-b": index < totalCards - 1 },
      )}
    >
      <TableCell className="font-bold text-slate-900 py-4 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
          <span className="text-base">{card.card_number}</span>
        </div>
      </TableCell>

      <TableCell className="text-slate-700 font-medium py-4 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
            <UserIcon />
          </div>
          <span>{card.efetivo?.name ?? "Não informado"}</span>
        </div>
      </TableCell>

      <TableCell className="text-slate-700 font-medium py-4 px-6">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
          {card.placa}
        </div>
      </TableCell>

      <TableCell className="text-slate-700 py-4 px-6">
        <span className="text-sm font-medium">{card.modelo}</span>
      </TableCell>

      <TableCell className="text-center py-4 px-6">
        <div className="inline-flex items-center space-x-2">
          <div
            className={`w-2 h-2 ${config.dotColor} rounded-full animate-pulse`}
          />
          <span
            className={`font-bold text-base ${config.textColor} ${config.bgColor} px-3 py-1 rounded-full border ${config.borderColor}`}
          >
            {formatDate(card.validadeCartao)}
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-32 text-center py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <CardIcon className="h-8 w-8 text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-slate-700 font-medium text-base">
              Nenhum cartão encontrado
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Os cartões cadastrados aparecerão aqui
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface CardTableFooterProps {
  statusCounts: {
    valid: number;
    expiring: number;
    expired: number;
  };
}

function CardTableFooter({ statusCounts }: CardTableFooterProps) {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center space-x-4">
          {(["valid", "expiring", "expired"] as CardStatus[]).map((status) => {
            const config = STATUS_CONFIGS[status];
            return (
              <div key={status} className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${config.dotColor} rounded-full`} />
                <span>
                  {config.label}: {statusCounts[status]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-slate-500">
          Última atualização: {new Date().toLocaleString("pt-BR")}
        </div>
      </div>
    </div>
  );
}

// SVG Icons Components
function CardIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );
}

function UserIcon({
  className = "h-4 w-4 text-blue-600",
}: {
  className?: string;
}) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function DocumentIcon({
  className = "h-4 w-4 text-slate-500",
}: {
  className?: string;
}) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function BuildingIcon({
  className = "h-4 w-4 text-slate-500",
}: {
  className?: string;
}) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );
}

function CalendarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 110 2h-1v9a2 2 0 01-2 2H8a2 2 0 01-2-2V9H5a1 1 0 110-2h3z"
      />
    </svg>
  );
}
