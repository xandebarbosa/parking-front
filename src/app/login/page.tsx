"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

// Schema de validação com Zod
const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await signIn(values);
      toast.success("Sucesso!", {
        description: "Login realizado com sucesso.",
      });
    } catch (error: any) {
      toast.error("Erro no Login", {
        description: error.message || "Ocorreu um erro, tente novamente.",
      });
    }
  }

  return (
    <div className="flex w-full min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-yellow-300 relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-400 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-600 rounded-full blur-lg"></div>
        </div>

        {/* Conteúdo principal */}
        <div className="relative z-10 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center leading-tight">
            Sistema de Controle de
          </h1>
          <h2 className="text-2xl font-semibold text-yellow-800 mb-12 text-center">
            Cartão de Estacionamento
          </h2>

          <Card className="w-full bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden pt-0">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-center py-8">
              <CardTitle className="text-2xl font-bold text-yellow-900 mb-2">
                Acesso ao Sistema
              </CardTitle>
              <CardDescription className="text-yellow-800 font-medium">
                Entre com suas credenciais para continuar
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 bg-white">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-800 font-semibold text-sm uppercase tracking-wide">
                          E-mail
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="seu@email.com"
                              {...field}
                              className="bg-yellow-50 border-yellow-200 focus:border-yellow-400 focus:ring-yellow-300 text-gray-900 rounded-lg py-3 px-4 text-base transition-all duration-200 placeholder:text-yellow-600/70"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                              {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                              <svg
                                className="h-5 w-5 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                />
                              </svg>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-800 font-semibold text-sm uppercase tracking-wide">
                          Senha
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••••"
                              {...field}
                              className="bg-yellow-50 border-yellow-200 focus:border-yellow-400 focus:ring-yellow-300 text-gray-900 rounded-lg py-3 px-4 pr-12 text-base transition-all duration-200 placeholder:text-yellow-600/70"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                              {/* Botão de Toggle */}
                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="text-yellow-600 hover:text-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 rounded p-1"
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
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>

                              {/* Divisor */}
                              <div className="h-5 w-px bg-yellow-300"></div>

                              {/* Ícone de Cadeado */}
                              <Lock className="h-5 w-5 text-yellow-600" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-yellow-900 font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-base"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center justify-center">
                        {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-900"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Entrando...
                      </div>
                    ) : (
                      "Entrar no Sistema"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Informações adicionais */}
          <div className="mt-8 text-center">
            <p className="text-yellow-800 text-sm font-medium">
              Controle seguro e eficiente de estacionamentos
            </p>
            <div className="flex justify-center items-center mt-4 space-x-4">
              <div className="flex items-center text-yellow-700 text-xs">
                <h3>Desenvolvido - Alexandre dos Santos Barbosa - 2025</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500 relative overflow-hidden">
        {/* Elementos decorativos da direita */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-500 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-yellow-300 rounded-full blur-xl"></div>
        </div>

        {/* Container da imagem */}
        <div className="relative z-10 p-8">
          {/** biome-ignore lint/performance/noImgElement: <explanation> */}
          <img
            src="/logo-asinha.png"
            alt="Logo do Sistema de Estacionamento"
            className="w-150 h-auto rounded-2xl object-contain mix-blend-multiply"
          />
        </div>
      </div>
    </div>
  );
}
