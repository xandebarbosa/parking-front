import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Efetivo } from '@/types'
import { AlertCircle, Building, Calendar, Pencil, Shield, Trash2, User, Users } from 'lucide-react';
import React from 'react'

type Props = {
    efetivos: Efetivo[];
    onEdit: (efetivo: Efetivo) => void;
    onDelete: (efetivo: Efetivo) => void;
};

export default function TabelaEfetivo({ efetivos = [], onEdit, onDelete}: Props) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("pf-BR", {
            timeZone: "UTC",
        });
    }

    const isValidCNH = (dateString?: string) => {
        if (!dateString) return false;
        const cnhDate = new Date(dateString);
        const today = new Date();
        return cnhDate > today;
    };

    const getCNHStatus = (dateString?: string) => {
        if (!dateString) return { text: "N/A", variant: "secondary" as const };
        
        const cnhDate = new Date(dateString);
        const today = new Date();
        const diffTime = cnhDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { text: "Vencida", variant: "destructive" as const };
        } else if (diffDays <= 30) {
            return { text: "Vence em breve", variant: "destructive" as const };
        } else if (diffDays <= 90) {
            return { text: "Atenção", variant: "secondary" as const };
        } else {
            return { text: "Válida", variant: "default" as const };
        }
    };
    return (
    <div className="space-y-4">
            {/* Header da Tabela */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Efetivo Cadastrado</h2>
                        <p className="text-sm text-slate-600">
                            {efetivos.length} {efetivos.length === 1 ? 'militar cadastrado' : 'militares cadastrados'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        CNH Válida: {efetivos.filter(e => isValidCNH(e.valCnh)).length}
                    </Badge>
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
                        {efetivos.length > 0 ? (
                            efetivos.map((efetivo, index) => {
                                const cnhStatus = getCNHStatus(efetivo.valCnh);
                                return (
                                    <TableRow 
                                        key={efetivo.id} 
                                        className={`
                                            transition-colors hover:bg-slate-50 
                                            ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}
                                        `}
                                    >
                                        <TableCell className="font-bold text-center py-4">
                                            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-mono">
                                                {efetivo.re}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-800">{efetivo.name}</span>
                                                {efetivo.funcao && (
                                                    <span className="text-xs text-slate-500 mt-1">{efetivo.funcao}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge variant="outline" className="font-semibold">
                                                {efetivo.postoGrad}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="text-slate-700 font-medium">{efetivo.opm}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={cnhStatus.variant} className="flex items-center gap-1">
                                                    {cnhStatus.variant === 'destructive' && (
                                                        <AlertCircle className="w-3 h-3" />
                                                    )}
                                                    {cnhStatus.text}
                                                </Badge>
                                                <div className="text-xs text-slate-500">
                                                    {formatDate(efetivo.valCnh)}
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
                                            <p className="text-sm text-slate-400">Cadastre o primeiro militar para começar</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer com estatísticas */}
            {efetivos.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>Total: <strong>{efetivos.length}</strong> militares</span>
                        <span className="text-slate-400">|</span>
                        <span>CNH Válida: <strong>{efetivos.filter(e => isValidCNH(e.valCnh)).length}</strong></span>
                        <span className="text-slate-400">|</span>
                        <span>CNH Vencida: <strong>{efetivos.filter(e => !isValidCNH(e.valCnh) && e.valCnh).length}</strong></span>
                    </div>
                </div>
            )}
        </div>
  );
}
