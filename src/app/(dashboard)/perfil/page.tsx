"use client";

import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,  
  Save,
  Shield,
  User,  
  Eye,
  EyeOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// Schema de validação aprimorado
const updateUserSchema = z
  .object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
    email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
    oldPassword: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine(({ oldPassword, password, confirmPassword }, ctx) => {

    // Só valida senha se algum campo de senha estiver preenchido
    const hasOldPassword = oldPassword && oldPassword.length > 0;
    const hasNewPassword = password && password.length > 0;
    const hasConfirmPassword = confirmPassword && confirmPassword.length > 0;

    // Se qualquer campo de senha foi preenchido, valida todos
    if (hasOldPassword || hasNewPassword || hasConfirmPassword) {
      if (!hasOldPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A senha atual é obrigatória para alterar a senha.",
          path: ["oldPassword"],
        });
      }
      if (!hasNewPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A nova senha é obrigatória.",
          path: ["password"],
        });
      } else if (password && password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A nova senha deve ter pelo menos 6 caracteres.",
          path: ["password"],
        });
      }
      if (!hasConfirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Confirme a nova senha.",
          path: ["confirmPassword"],
        });
      } else if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "As senhas não coincidem.",
          path: ["confirmPassword"],
        });
      }
    }
  });

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// Componente de Input de Senha reutilizável para evitar repetição
const PasswordInput = ({ field, placeholder, isVisible, onToggle }: any) => (
  <div className="relative">
    <Input
      type={isVisible ? "text" : "password"}
      placeholder={placeholder}
      {...field}
      className="h-11 border-slate-200 dark:border-slate-700 focus:border-purple-500 transition-colors pr-10"
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 focus:outline-none"
      aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
    >
      {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  </div>
);

export default function PerfilPage() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // A função updateUserContext virá do seu AuthContext
  const { user, updateUserContext } = useAuth();

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        oldPassword: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, form]);

  async function handleUpdateUser(values: UpdateUserFormData) {
    if (!user) return;

    // Cria o payload apenas com os dados que foram alterados
    const payload: any = {};

    // Verifica alteração de nome
    if (values.name !== user.name) {
      payload.name = values.name;
    }
    
    // Verifica alteração de email
    if (values.email !== user.email) {
      payload.email = values.email;
    }
    
    // Verifica alteração de senha (só adiciona se todos os campos estiverem preenchidos)
    const hasPasswordData = values.oldPassword && values.password && values.confirmPassword;
    if (hasPasswordData) {
      payload.oldPassword = values.oldPassword;
      payload.password = values.password;
    }

    // Verifica se há algo para atualizar
    if (Object.keys(payload).length === 0) {
      toast.info("Nenhuma alteração foi feita.");
      return;
    }

    // Endpoint corrigido para incluir o ID do usuário
    const promise = api.put('/users', payload);

    toast.promise(promise, {
      loading: "Salvando alterações...",
      success: (response) => {
        // Limpa apenas os campos de senha
        form.reset({
          name: response.data.name || values.name,
          email: response.data.email || values.email,
          oldPassword: "",
          password: "",
          confirmPassword: "",
        });
        
        // Atualiza o contexto para refletir as mudanças na UI
        if (updateUserContext) {
           updateUserContext(response.data);
        }

        return "Dados atualizados com sucesso!";
      },
      error: (err) =>
        err.response?.data?.error || "Não foi possível atualizar os dados.",
    });
  }

  const { isSubmitting } = form.formState;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header da página */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Configurações do Perfil
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Gerencie suas informações pessoais e configurações de segurança
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar com informações do usuário */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {user?.name || "Usuário"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      {user?.email || "email@exemplo.com"}
                    </p>
                    <Badge variant="secondary">
                      <Shield className="w-3 h-3 mr-1" />
                      Conta Verificada
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário principal */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Atualize suas informações para manter sua conta segura.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleUpdateUser)}
                      className="space-y-8"
                    >
                      {/* Seção de Dados Pessoais */}
                      <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="h-11"
                                placeholder="Digite seu nome completo"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                {...field}
                                className="h-11"
                                placeholder="Digite seu e-mail"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      {/* Seção de Alteração de Senha */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Segurança da Conta
                        </h3>
                        <FormField
                          name="oldPassword"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha Atual</FormLabel>
                              <FormControl>
                                <PasswordInput
                                  field={field}
                                  placeholder="••••••••••"
                                  isVisible={showOldPassword}
                                  onToggle={() => setShowOldPassword(!showOldPassword)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nova Senha</FormLabel>
                                <FormControl>
                                  <PasswordInput
                                    field={field}
                                    placeholder="Mínimo 6 caracteres"
                                    isVisible={showPassword}
                                    onToggle={() => setShowPassword(!showPassword)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="confirmPassword"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirmar Nova Senha</FormLabel>
                                <FormControl>
                                  <PasswordInput
                                    field={field}
                                    placeholder="Repita a nova senha"
                                    isVisible={showConfirmPassword}
                                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Botão de Submit */}
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="h-11 px-6 bg-blue-600 hover:bg-blue-700"
                        >
                          {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Salvar Alterações
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
    </div>
  );
}