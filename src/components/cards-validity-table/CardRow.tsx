import type { CartaoEstacionamento } from "@/types";
import type { CardStatus } from "./types";
import { TableCell, TableRow } from "../ui/table";
import { UserIcon } from "./CardIcon";
import { STATUS_CONFIGS } from "./constants";

interface CardRowProps {
  card: CartaoEstacionamento;
  status: CardStatus;
  formatDate: (date?: string) => string;
}

export function CardRow({ card, status, formatDate }: CardRowProps) {
  const config = STATUS_CONFIGS[status];

  return (
    <TableRow className="border-slate-100 hover:bg-slate-50/50 transition-all duration-200 group">
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