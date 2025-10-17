"use client";

import { FilePen, Home, IdCard, LogOut, PlusCircle, UserCircle2, UserRoundPen, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import React from "react";

//Definindo um tipo para os itens de menu
type MenuItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: ('admin' | 'user')[]; // Define quais cargos podem ver este item
};

const menuItems: MenuItem[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/cadastros", label: "Cadastro Cartão", icon: PlusCircle },
  { href: "/update", label: "Atualizar Cartão", icon: FilePen},
  { href: "/efetivo-update", label: "Atualizar Efetivo", icon: UserRoundPen},
  { href: "/pesquisar-cartao", label: "Pesquisar Cartão", icon: IdCard},
  { href: "/cadastrar-usuario", label: "Cadastro Usuário", icon: UserCircle2, roles: ['admin'] },
  { href: "/usuarios", label: "Usuários", icon: Users2, roles: ['admin']}
  // Adicione mais itens aqui no futuro
];

export function Sidebar() {
  const pathname = usePathname();
  // Usando o hook de autenticação para obter a função signOut
  const { user, signOut } = useAuth();

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase().slice(0, 2);
  }

  // Filtrar os itens de menu com base na 'role' do usuário
  const accessibleMenuItems = menuItems.filter(item => {
    // Se o item não tem a propriedade 'roles', ele é público para todos.
    if (!item.roles) {
      return true;
    }
    // Se o item tem 'roles', verifica se a 'role' do usuário está na lista de permissões.
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <aside className="fixed top-0 left-0 z-40 w-72 h-screen transition-all duration-300 ease-in-out -translate-x-full sm:translate-x-0 shadow-2xl">
  <div className="h-full overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col relative">
    {/* Elementos decorativos de fundo */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-8 w-24 h-24 bg-purple-500 rounded-full blur-2xl"></div>
    </div>

    {/* Header da Sidebar */}
    <div className="relative z-10 px-6 py-8 border-b border-slate-700/50">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center w-16 h-16">
          {/** biome-ignore lint/performance/noImgElement: <explanation> */}
          <img
            src="/logo-pmrv.png"
            alt="Logo PMRV"
            className="w-150 h-auto object-contain mix-blend-multiply"
          />          
        </div>
        <h2 className="text-xl font-bold text-white mb-1">
          Sistema de Controle
        </h2>
        <p className="text-sm text-slate-300 font-medium">
          Cartões de Estacionamento
        </p>
      </div>
    </div>

    {/* Menu Principal */}
    <div className="flex-1 px-4 py-3 relative z-10">
      <nav className="space-y-2">
        {accessibleMenuItems.map((item, index) => (
          <div key={item.href} className="relative">
            <Link
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-2.5 rounded-xl text-slate-300 font-medium transition-all duration-200 hover:text-white relative overflow-hidden",
                {
                  "bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-white shadow-lg border border-blue-500/20": pathname === item.href,
                  "hover:bg-slate-700/50 hover:translate-x-1": pathname !== item.href,
                }
              )}
            >
              {/* Indicador ativo */}
              {pathname === item.href && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r-full"></div>
              )}
              
              {/* Ícone com container estilizado */}
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg mr-4 transition-all duration-200",
                {
                  "bg-blue-500/20 text-blue-400": pathname === item.href,
                  "bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-white": pathname !== item.href,
                }
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              
              <span className="text-sm font-semibold tracking-wide">
                {item.label}
              </span>

              {/* Seta para item ativo */}
              {pathname === item.href && (
                <div className="ml-auto">
                  {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </Link>
          </div>
        ))}
      </nav>

      {/* Seção de Logout */}
      <div className="mt-8 pt-6 border-t border-slate-700/50">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-200 rounded-xl py-3.5 px-4 font-medium group"
          onClick={signOut}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg mr-4 bg-slate-700/50 group-hover:bg-red-500/20 transition-all duration-200">
            <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-400 transition-colors duration-200" />
          </div>
          <span className="text-sm font-semibold tracking-wide">Sair do Sistema</span>
        </Button>
      </div>
    </div>

    {/* Profile Section */}
    <div className="relative z-10 px-6 py-6 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {/* Avatar com gradiente */}
        <div className="relative">
          <Avatar className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white ring-2 ring-slate-600 shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          {/* Indicador online */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white truncate mb-1">
              {user?.name || "Usuário"}
            </span>
            <Link 
              href="/perfil" 
              className="inline-flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
            >
              {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurações
            </Link>
          </div>
        </div>

        {/* Menu de opções do usuário */}
        <div className="flex-shrink-0">
          <Button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200">
            {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Status do sistema
      <div className="mt-4 pt-4 border-t border-slate-700/30">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Sistema Online</span>
          </div>
          <span className="font-mono">v2.1.0</span>
        </div>
      </div> */}
    </div>
  </div>
</aside>
  );
}
