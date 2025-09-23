"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Shield, Trash2, User, Users } from "lucide-react";

type TableUser = {
    id: number;
    name: string;
    email: string;
    role: string;
}

type Props = {
    users: TableUser[];
    onDelete: (user: TableUser) => void;
}

// Função para mapear roles para cores e ícones
const getRoleConfig = (role: string) => {
    const roleConfigs = {
        'Admin': { color: 'bg-purple-100 text-purple-800 hover:bg-purple-200', icon: Shield },
        'Administrador': { color: 'bg-purple-100 text-purple-800 hover:bg-purple-200', icon: Shield },        
        'User': { color: 'bg-green-100 text-green-800 hover:bg-green-200', icon: User },
        'Usuário': { color: 'bg-green-100 text-green-800 hover:bg-green-200', icon: User },        
    };
    
    return roleConfigs[role as keyof typeof roleConfigs] || 
           { color: 'bg-gray-100 text-gray-800 hover:bg-gray-200', icon: User };
};

// Função para gerar iniciais do nome
const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
};

export default function TabelaUsuarios({ users = [], onDelete }: Props) {
  return (
    <div className="w-full space-y-4">
            {/* Cabeçalho da seção */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Usuários</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {users.length === 0 ? "Nenhum usuário cadastrado" : 
                         users.length === 1 ? "1 usuário encontrado" : 
                         `${users.length} usuários encontrados`}
                    </p>
                </div>
            </div>

            {/* Container da tabela com sombra e bordas arredondadas */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow className="hover:bg-gray-50">
                            <TableHead className="font-semibold text-gray-900 py-4">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Usuário
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    E-mail
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Função
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900 text-center">
                                Ações
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user, index) => {
                                const roleConfig = getRoleConfig(user.role);
                                const RoleIcon = roleConfig.icon;
                                
                                return (
                                    <TableRow 
                                        key={user.id} 
                                        className="hover:bg-gray-50/50 transition-colors duration-150 group"
                                    >
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar com iniciais */}
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                                        {getInitials(user.name)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 group-hover:text-gray-700">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-gray-900">{user.email}</div>
                                            <div className="text-xs text-gray-500">
                                                {user.email.split('@')[1]}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant="secondary" 
                                                className={`${roleConfig.color} transition-colors duration-150 font-medium`}
                                            >
                                                <RoleIcon className="h-3 w-3 mr-1" />
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => onDelete(user)}
                                                className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150 group/button"
                                            >
                                                <Trash2 className="h-4 w-4 group-hover/button:scale-110 transition-transform duration-150" />
                                                <span className="sr-only">Excluir usuário {user.name}</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32">
                                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Users className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-medium">Nenhum usuário encontrado</p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Comece adicionando o primeiro usuário ao sistema
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
  )
}
