"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// Schema de validação para a atualização
const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email({ message: "E-mail inválido." }).optional().or(z.literal('')),
    oldPassword: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
}).superRefine(({ oldPassword, password, confirmPassword }, ctx) => {
    // Validações de senha só rodam se a senha antiga for preenchida
    if (oldPassword) {
        if (!password || password.length < 6) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "A nova senha deve ter pelo menos 6 caracteres.", path: ['password'] });
        }
        if (password !== confirmPassword) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "As senhas não coincidem.", path:['confirmPassword'] });
        }
    }
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export default function PerfilPage() {
    const { user } = useAuth();
    const form = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: { name: '', email: '', oldPassword: '', password: '', confirmPassword: ''},
    });

    // Popula o formulário com os dados do usuário quando eles estiverem disponíveis
    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                email: user.email,
            });
        }
    },[user, form]);

    async function handleUpdateUser(values: UpdateUserFormData) {
        // Filtra apenas os campos que foram preenchidos para enviar na requisição
        const payload: Partial<UpdateUserFormData> = {};
        if (values.name && values.name !== user?.name) payload.name = values.name;
        if (values.email && values.email !== user?.email) payload.email = values.email;
        if (values.oldPassword) payload.oldPassword = values.oldPassword;
        if (values.password) payload.password = values.password;

        if (Object.keys(payload).length === 0) {
            toast.info("Nenhuma alteração foi feita.");
            return;
        }

        const promise = api.put('/users', payload);

        toast.promise(promise, {
            loading: "Salvando alterações...",
            success: (response) => {
                form.reset({ ...form.getValues(), oldPassword: '', password: '', confirmPassword: '' });
                return "Dados atualizados com sucesso!";
            },
            error: (err) => err.response?.data?.error || "Não foi possível atualizar os dados.",
        });        
    }

    const { isSubmitting } = form.formState;
  return (
    <div className="container mx-auto py-10 flex justify-center">
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Meu Perfil</CardTitle>
                <CardDescription>Atualize seus dados pessoais e de acesso.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdateUser)} className="space-y-8">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Dados Pessoais</h3>
                            <div className="space-y-4">
                                <FormField 
                                    name="name" 
                                    control={form.control} 
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
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
                                                <Input type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} 
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                 Preencha os campos abaixo somente se desejar alterar sua senha.
                                </p>
                                <div className="space-y-4">
                                    <FormField
                                        name="oldPassword" 
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Senha Antiga</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="password" 
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nova Senha</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
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
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Alterações
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  )
}
