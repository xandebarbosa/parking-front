"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/services/api";
import { toast } from "sonner"; 

// Schema (sem alterações)
const cadastroSchema = z.object({
  re: z.string().min(1, "RE é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  postoGrad: z.string().min(1, "Posto/Grad é obrigatório"),
  cpf: z.string().optional(),
  placa: z.string().min(7, "Placa é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  color: z.string().min(1, "Cor é obrigatória"),
  ano: z.string().optional(),
});


export default function CadastroPage() {  

  const form = useForm<z.infer<typeof cadastroSchema>>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { re: "", name: "", postoGrad: "", placa: "", modelo: "", color: "" },
  });

  async function onSubmit(values: z.infer<typeof cadastroSchema>) {
    // Exibe um toast de carregamento
    // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
        const promise = new Promise(async (resolve, reject) => {
      try {
        const efetivoData = { re: values.re, name: values.name, postoGrad: values.postoGrad, cpf: values.cpf };
        const responseEfetivo = await api.post('/efetivos', efetivoData);
        const novoEfetivo = responseEfetivo.data;

        const veiculoData = { placa: values.placa, modelo: values.modelo, color: values.color, ano: values.ano };
        await api.post(`/efetivos/${novoEfetivo.id}/vehicles`, veiculoData);
        
        form.reset();
        resolve("Cadastro realizado!");
      } catch (error: any) {
        reject(error.response?.data?.error || "Ocorreu um erro, tente novamente.");
      }
    });

    // O sonner gerencia os estados da promise automaticamente
    toast.promise(promise, {
      loading: 'Salvando cadastro...',
      success: (message) => `${message}`,
      error: (errorMessage) => `${errorMessage}`,
    });
  }

  // O JSX do formulário continua o mesmo...
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Novo Cadastro</CardTitle>
          <CardDescription>Cadastre um novo efetivo e seu veículo principal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Seção do Efetivo */}
              <div>
                <h3 className="text-lg font-medium mb-4">Dados do Efetivo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="re" render={({ field }) => (
                    <FormItem><FormLabel>RE</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="postoGrad" render={({ field }) => (
                    <FormItem><FormLabel>Posto/Grad.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                   <FormField control={form.control} name="cpf" render={({ field }) => (
                    <FormItem><FormLabel>CPF</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
              </div>

              {/* Seção do Veículo */}
              <div>
                <h3 className="text-lg font-medium mb-4">Dados do Veículo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <FormField control={form.control} name="placa" render={({ field }) => (
                    <FormItem><FormLabel>Placa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                   <FormField control={form.control} name="modelo" render={({ field }) => (
                    <FormItem><FormLabel>Modelo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                   <FormField control={form.control} name="color" render={({ field }) => (
                    <FormItem><FormLabel>Cor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
              </div>
              
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : "Salvar Cadastro"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}