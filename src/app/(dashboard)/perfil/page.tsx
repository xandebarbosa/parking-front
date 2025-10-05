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
  Mail,
  Save,
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// Schema de validação para a atualização
const updateUserSchema = z
  .object({
    name: z.string().optional(),
    email: z
      .string()
      .email({ message: "E-mail inválido." })
      .optional()
      .or(z.literal("")),
    oldPassword: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine(({ oldPassword, password, confirmPassword }, ctx) => {
    // Validações de senha só rodam se a senha antiga for preenchida
    if (oldPassword) {
      if (!password || password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A nova senha deve ter pelo menos 6 caracteres.",
          path: ["password"],
        });
      }
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "As senhas não coincidem.",
          path: ["confirmPassword"],
        });
      }
    }
  });

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export default function PerfilPage() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user } = useAuth();

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prev) => !prev);
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Popula o formulário com os dados do usuário quando eles estiverem disponíveis
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  async function handleUpdateUser(values: UpdateUserFormData) {
    // Filtra apenas os campos que foram preenchidos para enviar na requisição
    const payload: Partial<UpdateUserFormData> = {};
    if (values.name && values.name !== user?.name) payload.name = values.name;
    if (values.email && values.email !== user?.email)
      payload.email = values.email;
    if (values.oldPassword) payload.oldPassword = values.oldPassword;
    if (values.password) payload.password = values.password;

    if (Object.keys(payload).length === 0) {
      toast.info("Nenhuma alteração foi feita.");
      return;
    }

    const promise = api.put("/users", payload);

    toast.promise(promise, {
      loading: "Salvando alterações...",
      success: (response) => {
        form.reset({
          ...form.getValues(),
          oldPassword: "",
          password: "",
          confirmPassword: "",
        });
        return "Dados atualizados com sucesso!";
      },
      error: (err) =>
        err.response?.data?.error || "Não foi possível atualizar os dados.",
    });
  }

  const { isSubmitting } = form.formState;

  return (
    <div className="min-h-screen rounded-md bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-4 px-4">
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
              <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
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
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      Conta Verificada
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário principal */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-slate-100">
                    <User className="w-5 h-5" />
                    Informações Pessoais
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Atualize suas informações para manter sua conta segura e
                    atualizada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleUpdateUser)}
                      className="space-y-8"
                    >
                      {/* Seção de Dados Pessoais */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                          <Mail className="w-5 h-5 text-blue-500" />
                          Dados Pessoais
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                                  Nome Completo
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="h-11 border-slate-200 dark:border-slate-700 focus:border-blue-500 transition-colors"
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
                                <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                                  E-mail
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    {...field}
                                    className="h-11 border-slate-200 dark:border-slate-700 focus:border-blue-500 transition-colors"
                                    placeholder="Digite seu e-mail"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator className="bg-slate-200 dark:bg-slate-700" />

                      {/* Seção de Alteração de Senha */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            <Lock className="w-5 h-5 text-purple-500" />
                            Segurança da Conta
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Preencha os campos abaixo somente se desejar alterar
                            sua senha atual
                          </p>
                        </div>

                        <div className="space-y-3">
                          <FormField
                            name="oldPassword"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                                  Senha Atual
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type={showOldPassword ? "text" : "password"}
                                    placeholder="••••••••••"
                                    {...field}
                                    className="h-11 border-slate-200 dark:border-slate-700 focus:border-purple-500 transition-colors"
                                  />
                                  <button
                                    type="button"
                                    onClick={toggleOldPasswordVisibility}
                                    className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                                    aria-label={
                                      showOldPassword
                                        ? "Ocultar senha"
                                        : "Mostrar senha"
                                    }
                                    title={
                                      showOldPassword
                                        ? "Ocultar senha"
                                        : "Mostrar senha"
                                    }
                                  >
                                    {showOldPassword ? (
                                      <EyeOff className="w-5 h-5" />
                                    ) : (
                                      <Eye className="w-5 h-5" />
                                    )}
                                  </button>
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
                                  <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                                    Nova Senha
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      {...field}
                                      className="h-11 border-slate-200 dark:border-slate-700 focus:border-purple-500 transition-colors"
                                      placeholder="Mínimo 6 caracteres"
                                    />
                                    <button
                                      type="button"
                                      onClick={togglePasswordVisibility}
                                      className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                                      aria-label={
                                        showPassword
                                          ? "Ocultar senha"
                                          : "Mostrar senha"
                                      }
                                      title={
                                        showPassword
                                          ? "Ocultar senha"
                                          : "Mostrar senha"
                                      }
                                    >
                                      {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                      ) : (
                                        <Eye className="w-5 h-5" />
                                      )}
                                    </button>
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
                                  <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                                    Confirmar Nova Senha
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type={
                                        showConfirmPassword
                                          ? "text"
                                          : "password"
                                      }
                                      {...field}
                                      className="h-11 border-slate-200 dark:border-slate-700 focus:border-purple-500 transition-colors"
                                      placeholder="Repita a nova senha"
                                    />
                                    <button
                                      type="button"
                                      onClick={toggleConfirmPasswordVisibility}
                                      className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                                      aria-label={
                                        showConfirmPassword
                                          ? "Ocultar senha"
                                          : "Mostrar senha"
                                      }
                                      title={
                                        showConfirmPassword
                                          ? "Ocultar senha"
                                          : "Mostrar senha"
                                      }
                                    >
                                      {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                      ) : (
                                        <Eye className="w-5 h-5" />
                                      )}
                                    </button>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-slate-200 dark:bg-slate-700" />

                      {/* Botão de Submit */}
                      <div className="flex justify-end pt-1">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="h-11 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Salvar Alterações
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
    </div>
  );
}
