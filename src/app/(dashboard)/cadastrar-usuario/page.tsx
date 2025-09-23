"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";
import { AlertCircle, CheckCircle2, Loader2, Mail, Shield, User, UserPlus, Lock, User2, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const newUserSchema = z
  .object({
    name: z
      .string()
      .min(5, { message: "O nome deve ter pelo menos cinco caracteres" }),
    email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
    role: z.enum(["admin", "user"], {
      required_error: "Selecione o perfil do usuário",
      invalid_type_error: "Função deve ser 'admin' ou 'user'"
    }),
    password: z.string().min(6, "A senha deve ter pelo menos seis caracteres"),
    confirmPassword: z.string().min(6, "A confirmação de senha é obrigatória."),
  })
  // Usamos .refine() para validar campos dependentes (confirmar senha)
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"], // Indica qual campo receberá a mensagem de erro
  });

type NewUserFormData = z.infer<typeof newUserSchema>;

export default function CadastrarUsuarioPage() {
  const form = useForm<NewUserFormData>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: undefined,
      password: "",
      confirmPassword: "",
    },
    mode: "onChange" // Adicionado para validação em tempo real mais precisa
  });

  // 2. Função de submissão do formulário
  async function handleCreateUser(values: NewUserFormData) {
    try {
      // Omitimos 'confirmPassword' do objeto enviado para a API
      const { name, email, role, password } = values;

      console.log("Values ==>",values);
      

      const promise = api.post('/users', { name, email, role, password });
      
      toast.promise(promise, {
        loading: "Criando novo usuário...",
        success: () => {
          form.reset(); // Limpa o formulário após o sucesso
          return "Usuário criado com sucesso!";
        },
        error: (err) => {
          // Captura erros específicos da API, como e-mail duplicado
          const errorMessage = err.response?.data?.error || "Não foi possível criar o usuário.";
          return errorMessage;
        },
      });

    } catch (error) {
      toast.error("Ocorreu um erro inesperado. Tente novamente.");
    }
  }

  const { isSubmitting } = form.formState;

  // Validação em tempo real dos campos
  const watchedPassword = form.watch("password");
  const watchedConfirmPassword = form.watch("confirmPassword");
  const watchedName = form.watch("name");
  const watchedEmail = form.watch("email");
  const watchedRole = form.watch("role");

  const getFieldStatus = (fieldName: any, value: string) => {
    if (!value) return null;
    const fieldState = form.getFieldState(fieldName);
    if (fieldState.error) return 'error';
    
    // Validações específicas
    switch (fieldName) {
      case 'name':
        return value.length >= 5 ? 'success' : 'error';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'success' : 'error';
      case 'role':
        return (value === 'admin' || value === 'user') ? 'success' : 'error';
      case 'password':
        return value.length >= 6 ? 'success' : 'error';
      case 'confirmPassword':
        return value === watchedPassword && value.length >= 6 ? 'success' : 'error';
      default:
        return null;
    }
  };

  const StatusIcon = ({ status }: { status: string | null }) => {
    if (status === 'success') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === 'error') return <AlertCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header da Página */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Gerenciamento de Usuários</h1>
              <p className="text-slate-600 text-sm">Cadastrar novo usuário no sistema</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-slate-500 mb-8">
          <span>Dashboard</span>
          <span className="mx-2">/</span>
          <span>Usuários</span>
          <span className="mx-2">/</span>
          <span className="text-slate-800 font-medium">Novo Usuário</span>
        </nav>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Sidebar Informativa */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Requisitos de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Nome completo</p>
                    <p className="text-xs text-slate-600">Mínimo de 5 caracteres</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">E-mail válido</p>
                    <p className="text-xs text-slate-600">Formato: usuario@dominio.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User2 className="w-3 h-3 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Perfil do usuário</p>
                    <p className="text-xs text-slate-600">Selecione Admin ou user</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-3 h-3 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Senha segura</p>
                    <p className="text-xs text-slate-600">Mínimo de 6 caracteres</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status do Formulário */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Status da Validação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Nome</span>
                  <StatusIcon status={getFieldStatus('name', watchedName)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">E-mail</span>
                  <StatusIcon status={getFieldStatus('email', watchedEmail)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Perfil do usuário</span>
                  <StatusIcon status={getFieldStatus('role', watchedRole)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Senha</span>
                  <StatusIcon status={getFieldStatus('password', watchedPassword)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Confirmação</span>
                  <StatusIcon status={getFieldStatus('confirmPassword', watchedConfirmPassword)} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário Principal */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-800">Cadastrar Novo Usuário</CardTitle>
                    <CardDescription className="text-slate-600 mt-1">
                      Preencha os dados abaixo para criar uma nova conta de acesso ao sistema
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleCreateUser)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Nome Completo <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Digite o nome completo do usuário"
                                {...field}
                                className="h-12 pl-4 pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <StatusIcon status={getFieldStatus('name', field.value)} />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            E-mail <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="email"
                                placeholder="usuario@exemplo.com"
                                {...field}
                                className="h-12 pl-4 pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <StatusIcon status={getFieldStatus('email', field.value)} />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Função do Usuário <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <div className="relative">
                                <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200">
                                  <SelectValue placeholder="Selecione a função" />
                                </SelectTrigger>
                                <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <StatusIcon status={getFieldStatus('role', field.value)} />
                                </div>
                              </div>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin" className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-red-600" />
                                  <div>
                                    <div className="font-medium">Administrador</div>
                                    <div className="text-xs text-slate-500">Acesso total ao sistema</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="user" className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-blue-600" />
                                  <div>
                                    <div className="font-medium">Usuário</div>
                                    <div className="text-xs text-slate-500">Acesso limitado</div>
                                  </div>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              Senha <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="password"
                                  placeholder="••••••••••"
                                  {...field}
                                  className="h-12 pl-4 pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <StatusIcon status={getFieldStatus('password', field.value)} />
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Confirmar Senha <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="password"
                                  placeholder="••••••••••"
                                  {...field}
                                  className="h-12 pl-4 pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <StatusIcon status={getFieldStatus('confirmPassword', field.value)} />
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-white font-medium shadow-lg" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Criando usuário...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Cadastrar Usuário
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  ); 
}
