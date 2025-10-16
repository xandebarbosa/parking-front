import { CartaoEstacionamento } from "@/types";
import { CardStatus } from "./types";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { BuildingIcon, CalendarIcon, CardIcon, DocumentIcon, UserIcon } from "./CardIcon";
import { CardRow } from "./CardRow";
import { EmptyState } from "./EmptyState";

interface HeaderCellProps {
  icon: React.ReactNode;
  label: string;
}
// Componente auxiliar para as células do cabeçalho
function HeaderCell({ icon, label }: HeaderCellProps) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span>{label}</span>
    </div>
  );
}

interface TableContentProps {
  cards: CartaoEstacionamento[];
  getCardStatus: (date?: string) => CardStatus;
  formatDate: (date?: string) => string;
}

export function TableContent({ cards, getCardStatus, formatDate }: TableContentProps) {
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
          cards.map((card) => (
            <CardRow
              key={card.id}
              card={card}
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