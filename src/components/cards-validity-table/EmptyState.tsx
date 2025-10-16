import { TableCell, TableRow } from "../ui/table";
import { CardIcon } from "./CardIcon";

export function EmptyState() {
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