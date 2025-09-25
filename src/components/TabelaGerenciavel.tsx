import { CartaoEstacionamento } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { AlertCircle, Calendar, Car, CheckCircle2, CreditCard, ParkingCircle, Pencil, Trash2, User } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";
import { Badge } from "./ui/badge";

type Props = {
  cartoes: CartaoEstacionamento[];
  onEdit: (cartao: CartaoEstacionamento) => void;
  onDelete: (cartao: CartaoEstacionamento) => void;
};

export function TabelaGerenciavel({ cartoes = [], onEdit, onDelete }: Props) {
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

  const getCardStatus = (dateString?: string) => {
    if (!dateString) return { text: "N/A", variant: "secondary" as const, icon: AlertCircle };
    
    const cardDate = new Date(dateString);
    const today = new Date();
    const diffTime = cardDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Vencido", variant: "destructive" as const, icon: AlertCircle };
    } else if (diffDays <= 7) {
      return { text: "Vence em breve", color: '#faa307' as const, icon: AlertCircle };
    } else if (diffDays <= 30) {
      return { text: "Atenção", color: '#778da9' as const, icon: AlertCircle };
    } else {
      return { text: "Válido", color: '#4f772d' as const, icon: CheckCircle2 };
    }
  };

  const formatPlaca = (placa?: string) => {
    if (!placa) return "N/A";
    // Formato brasileiro de placa (ABC-1234 ou ABC1D23)
    return placa.toUpperCase().replace(/(\w{3})(\w{4})/, '$1-$2');
  };

  const validCards = cartoes.filter(c => isValidCard(c.validadeCartao));
  const expiredCards = cartoes.filter(c => !isValidCard(c.validadeCartao) && c.validadeCartao);
  
  return (
    <div className="space-y-4">
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
                <div className="flex items-center gap-2">
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
            {cartoes.length > 0 ? (
              cartoes.map((cartao, index) => {
                const cardStatus = getCardStatus(cartao.validadeCartao);
                const StatusIcon = cardStatus.icon;
                
                return (
                  <TableRow 
                    key={cartao.id} 
                    className={`
                      transition-colors hover:bg-slate-50 
                      ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}
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
                      <div className="flex items-center gap-2">
                        <Badge variant={cardStatus.variant} className="flex items-center gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {cardStatus.text}
                        </Badge>
                        <div className="text-xs text-slate-500">
                          {formatDate(cartao.validadeCartao)}
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
                      <p className="text-sm text-slate-400">Cadastre o primeiro cartão para começar</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer com estatísticas */}
      {cartoes.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>Total: <strong>{cartoes.length}</strong> cartões</span>
            <span className="text-slate-400">|</span>
            <span>Válidos: <strong className="text-green-600">{validCards.length}</strong></span>
            <span className="text-slate-400">|</span>
            <span>Vencidos: <strong className="text-red-600">{expiredCards.length}</strong></span>
            <span className="text-slate-400">|</span>
            <span>Taxa de validade: <strong>{cartoes.length > 0 ? Math.round((validCards.length / cartoes.length) * 100) : 0}%</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
