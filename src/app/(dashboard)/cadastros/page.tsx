"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import Requisicao from "@/components/print/Requisicao";
import Cartao from "@/components/print/Cartao";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createRoot } from "react-dom/client";
import { FileText, Printer } from "lucide-react";
import { SearchEfetivoModal } from "@/components/SearchEfetivoModal";

// Regex para validar hora no formato HH:mm
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

// Schema (sem alterações)
const cadastroSchema = z.object({
  // Efetivo
  re: z.string().min(1, "RE é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  postoGrad: z.string().min(1, "Posto/Grad é obrigatório"),
  rg: z.string().min(1, "RG é obrigatório"),
  cpf: z.string().min(1, "CPF é obrigatório"),
  opm: z.string().min(1, "OPM é obrigatória"),
  funcao: z.string().min(1, "Função é obrigatória"),
  secao: z.string().min(1, "Seção é obrigatória"),
  ramal: z.string().min(1, "Ramal é obrigatório"),
  pgu: z.string().min(1, "Número do PGU é obrigatório"),
  valCnh: z.string().min(1, "Data da CNH é obrigatória"),

  // Veículo
  placa: z.string().min(7, "Placa do veículo é obrigatória"),
  modelo: z.string().min(1, "Modelo do veículo é obrigatório"),
  color: z.string().min(1, "Cor do veículo é obrigatória"),
  ano: z.string().min(4, "Ano do veículo é obrigatório"),
  municipio: z.string().min(1, "Nome do Município é obrigatório"),
  uf: z.string().min(2, "UF é obrigatório"),
  chassi: z.string().min(1, "Número do Chassi é obrigatório"),
  renavan: z.string().min(1, "Número do Renavan é obrigatório"),
  reFiscalizador: z.string().min(1, "RE do Fiscalizador é obrigatório"),
  periodo1Entrada: z
    .string()
    .regex(timeRegex, "Período 1 de Entrada é obrigatório"), // Horas são strings no input type="time"
  periodo1Saida: z
    .string()
    .regex(timeRegex, "Período 1 de Saída é obrigatório"),
  periodo2Entrada: z
    .string()
    .regex(timeRegex, "Período 2 de Entrada é obrigatório"),
  periodo2Saida: z
    .string()
    .regex(timeRegex, "Período 2 de Saída é obrigatório"),
  local: z.string().min(1, "Local do estacionamento é obrigatório"),
  dias: z.coerce
    .number({ required_error: "Deve ser um número" })
    .min(1, "Número de dias é obrigatório"),
  validadeCartao: z.string().min(1, "Validade do cartão é obrigatória"),
});

type CadastroFormData = z.infer<typeof cadastroSchema>;

export default function CadastroPage() {
  const [nextCardNumber, setNextCardNumber] = useState<string>("");
  const [dadosParaImpressao, setDadosParaImpressao] = useState<{
    efetivo: any;
    vehicle: any;
  } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRequisicaoModalOpen, setIsRequisicaoModalOpen] = useState(false);
  const [isCartaoModalOpen, setIsCartaoModalOpen] = useState(false);
  // NOVO: Estado para armazenar o ID do efetivo existente selecionado
  const [existingEfetivoId, setExistingEfetivoId] = useState<string | null>(
    null,
  );

  const { token } = useAuth();

  console.log("dadosParaImpressao ===> ", dadosParaImpressao);

  const contentRef = useRef(null);

  // O componente Dialog do Shadcn é portado para o final do <body>.
  // A classe 'print-container' será adicionada ao seu contêiner de conteúdo.
  const handlePrint = (printableComponent: React.ReactElement) => {
    // 1. Cria um div temporário no corpo do documento
    const printMountElement = document.createElement("div");
    printMountElement.classList.add("print-mount");
    document.body.appendChild(printMountElement);

    // 2. Usa a nova API createRoot para renderizar o componente
    const root = createRoot(printMountElement);
    root.render(printableComponent);

    // 3. Adiciona um pequeno delay para garantir que tudo foi renderizado
    setTimeout(() => {
      window.print(); // 4. Chama a impressão do navegador

      // 5. Limpa e desmonta o componente React e o elemento do DOM
      root.unmount();
      document.body.removeChild(printMountElement);
    }, 250);
  };

  // Função para buscar o próximo número de cartão
  const fetchNextCardNumber = useCallback(async () => {
    if (!token) return;
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await api.get("/vehicles/next-card-number");
      console.log("Card Number", response);
      const formattedNumber = String(response.data.nextCardNumber).padStart(
        4,
        "0",
      );
      setNextCardNumber(formattedNumber);
    } catch (error) {
      console.error("Erro ao buscar o próximo número do cartão:", error);
      toast.error("Não foi possível carregar o número do próximo cartão.");
    }
  }, [token]);

  useEffect(() => {
    fetchNextCardNumber();
  }, [fetchNextCardNumber]);

  const form = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      re: "",
      name: "",
      postoGrad: "",
      rg: "",
      cpf: "",
      opm: "",
      funcao: "",
      secao: "",
      ramal: "",
      pgu: "",
      valCnh: "",
      placa: "",
      modelo: "",
      color: "",
      ano: "",
      municipio: "",
      uf: "",
      chassi: "",
      renavan: "",
      reFiscalizador: "",
      periodo1Entrada: "",
      periodo1Saida: "",
      periodo2Entrada: "",
      periodo2Saida: "",
      local: "",
      dias: 0,
      validadeCartao: "",
    },
  });

  // NOVO: Efeito para resetar o ID do efetivo se o RE for alterado manualmente
  // const reValue = form.watch("re");
  // // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  // useEffect(() => {
  //   // Se o usuário selecionou um efetivo, mas depois alterou o RE,
  //   // assumimos que ele quer cadastrar um novo.
  //   if (existingEfetivoId) {
  //     setExistingEfetivoId(null);
  //     toast.info(
  //       "O RE foi alterado. Um novo efetivo será criado se não existir.",
  //     );
  //   }
  // }, [reValue]);

  const handleEfetivoSelect = (efetivo: any) => {
    console.log("Objeto 'efetivo' recebido do modal:", efetivo); // <--- ADICIONE ESTA LINHA
    // Usamos 'setValue' do react-hook-form para preencher os campos
    form.setValue("re", efetivo.re);
    form.setValue("name", efetivo.name);
    form.setValue("postoGrad", efetivo.postoGrad);
    form.setValue("rg", efetivo.rg);
    form.setValue("cpf", efetivo.cpf);
    form.setValue("opm", efetivo.opm);
    form.setValue("funcao", efetivo.funcao);
    form.setValue("secao", efetivo.secao);
    form.setValue("ramal", efetivo.ramal);
    form.setValue("pgu", efetivo.pgu);

    // A parte mais importante: guardar o ID do efetivo existente
    setExistingEfetivoId(String(efetivo.id));  // Assumindo que o objeto 'efetivo' tem uma propriedade 'id'

    toast.success(
      `Efetivo "${efetivo.name}" carregado. Preencha os dados do veículo.`,
    );
  };

  async function onSubmit(values: z.infer<typeof cadastroSchema>) {
    if (!token) {
      toast.error("Erro de Autenticação", {
        description: "Sua sessão expirou. Por favor, faça o login novamente.",
      });
      // Opcional: redirecionar para o login
      // router.push('/login');
      return; // Interrompe a execução se não houver token
    }
    // Exibe um toast de carregamento
    // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
    const promise = new Promise(async (resolve, reject) => {
      try {
        //Separa os dados para cada entidade
        
        // const responseEfetivo = await api.post("/efetivos", efetivoData);
        // const novoEfetivo = responseEfetivo.data;

        const vehicleData = {
          placa: values.placa,
          modelo: values.modelo,
          color: values.color,
          ano: values.ano,
          municipio: values.municipio,
          uf: values.uf,
          chassi: values.chassi,
          renavan: values.renavan,
          reFiscalizador: values.reFiscalizador,
          periodo1Entrada: values.periodo1Entrada,
          periodo1Saida: values.periodo1Saida,
          periodo2Entrada: values.periodo2Entrada,
          periodo2Saida: values.periodo2Saida,
          local: values.local,
          dias: values.dias,
          validadeCartao: values.validadeCartao,
        };

        // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
        let response;
        // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
        let dadosFinaisParaImpressao;

        // SE TEMOS UM ID, significa que estamos adicionando um veículo a um efetivo existente
        if (existingEfetivoId) {
          toast.info("Adicionando novo veículo ao efetivo existente...");
          // Você precisará de um endpoint na sua API para isso. Ex: POST /efetivos/{id}/vehicles
          response = await api.post(
            `/efetivos/${existingEfetivoId}/vehicles`,
            vehicleData,
          );

          console.log("Resposta da API (Veículo):", response.data);

        // Cenário Provável: A API retorna apenas o novo veículo.
        const newVehicle = response.data; 
        
        // Nós já temos os dados do efetivo no formulário! Vamos usá-los.
        const efetivoDataFromForm = {
          re: values.re,
          name: values.name,
          postoGrad: values.postoGrad,
          rg: values.rg,
          cpf: values.cpf,
          // ... inclua os outros campos do efetivo que você precisa para a impressão
        };

        dadosFinaisParaImpressao = { 
          efetivo: efetivoDataFromForm, 
          vehicle: newVehicle 
        };
        } else {
          // SE NÃO TEMOS UM ID, usamos a lógica original para criar um novo efetivo e veículo
          toast.info("Criando novo efetivo e veículo..."); 
          
          const efetivoData = {
          re: values.re,
          name: values.name,
          postoGrad: values.postoGrad,
          rg: values.rg,
          cpf: values.cpf,
          opm: values.opm,
          funcao: values.funcao,
          secao: values.secao,
          ramal: values.ramal,
          pgu: values.pgu,
          valCnh: values.valCnh,
        };

          response = await api.post("/full-cadastro", {
            efetivoData,
            vehicleData,
          });
          console.log("Resposta da API (Cadastro Completo):", response.data);
          const { efetivo, vehicle } = response.data;
          setDadosParaImpressao({ efetivo, vehicle });
        }
         // Validação final para garantir que não estamos salvando undefined
      if (!dadosFinaisParaImpressao?.efetivo || !dadosFinaisParaImpressao?.vehicle) {
        throw new Error("A resposta da API não continha os dados esperados do efetivo ou do veículo.");
      }

      setDadosParaImpressao(dadosFinaisParaImpressao);

        setIsSubmitted(true);
        resolve("Cadastro realizado com sucesso!");
      } catch (error: any) {
        // O erro agora pode vir com detalhes, vamos exibi-los
        const errorMessage =
          error.response?.data?.details?.[0]?.message ||
          error.response?.data?.error ||
          "Ocorreu um erro, tente novamente.";
        reject(errorMessage);
      }
    });

    // O sonner gerencia os estados da promise automaticamente
    toast.promise(promise, {
      loading: "Salvando cadastro...",
      success: (message) => `${message}`,
      error: (errorMessage) => `${errorMessage}`,
    });
  }

  // Função para lidar com o clique em "Novo Cartão"
  const handleNewCard = () => {
    form.reset(); // Limpa o formulário para os valores padrão
    setIsSubmitted(false); // Reseta o estado de submissão
    setDadosParaImpressao(null); // Limpa os dados de impressão
    setExistingEfetivoId(null); // Limpa o ID do efetivo existente
    fetchNextCardNumber(); // Busca o próximo número de cartão
  };

  return (
    <div className="min-h-screen w-full py-1">
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-lg">
        <CardHeader className="flex flex-row items-start justify-between bg-gradient-to-r from-amber-100 to-amber-200 rounded-t-lg border-b border-amber-300">
          <div className="mt-2.5">
            <CardTitle className="text-amber-900 font-bold text-xl">
              Novo Cartão de Estacionamento
            </CardTitle>
            <CardDescription className="mt-0.5 text-amber-700 font-medium">
              Cadastre um novo efetivo e seu veículo principal.
            </CardDescription>
          </div>
          <div className="w-48 text-center mt-2.5">
            <Label className="block font-semibold text-center mb-0.5 text-amber-900">
              Nº do Cartão
            </Label>
            <Input
              readOnly
              value={nextCardNumber}
              className="bg-white border-amber-300 text-lg text-center font-bold text-amber-900 shadow-sm focus:border-amber-400 focus:ring-amber-200"
            />
          </div>
        </CardHeader>

        <CardContent className="bg-white/70 backdrop-blur-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Seção do Efetivo */}
              <div>
                <h3 className="text-lg font-semibold mb-2 border-b border-amber-200 pb-1 text-amber-900">
                  Dados do Efetivo
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                    <FormField
                      control={form.control}
                      name="re"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            RE
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-amber-800 font-medium">
                            Nome Completo
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <div className="md:col-span-2">
                      <SearchEfetivoModal
                        onEfetivoSelect={handleEfetivoSelect}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <FormField
                      control={form.control}
                      name="postoGrad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            Posto/Grad.
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            RG
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            CPF
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pgu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            Nº PGU
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="opm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            OPM
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <FormField
                      control={form.control}
                      name="funcao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            Função
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="secao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            Seção
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ramal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            Ramal
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="valCnh"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            Validade CNH
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Seção do Veículo */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b border-amber-200 pb-1 text-amber-900">
                  Dados do Veículo
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <FormField
                      control={form.control}
                      name="placa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            Placa
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="modelo"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-amber-800 font-medium">
                            Marca/Modelo
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            Cor
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ano"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            Ano
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                    <FormField
                      control={form.control}
                      name="municipio"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-amber-800 font-medium">
                            Município
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="uf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800 font-medium">
                            UF
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="chassi"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-amber-800 font-medium">
                            Chassi
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="renavan"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-amber-800 font-medium">
                            Renavan
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-7">
                    <FormField
                      control={form.control}
                      name="reFiscalizador"
                      render={({ field }) => (
                        <FormItem className="col-start-1 col-end-1">
                          <FormLabel className="text-amber-800 font-medium">
                            RE Fiscalizador
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Seção de Período e Validade */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b border-amber-200 pb-2 text-amber-900">
                  Período e Validade
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-8 gap-2">
                  <FormField
                    control={form.control}
                    name="periodo1Entrada"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-800 font-medium">
                          Período 1 - Entrada
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="periodo1Saida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-800 font-medium">
                          Período 1 - Saída
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="periodo2Entrada"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-800 font-medium">
                          Período 2 - Entrada
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="periodo2Saida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-800 font-medium">
                          Período 2 - Saída
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="local"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="text-amber-800 font-medium">
                          Local
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-800 font-medium">
                          Dias
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 7"
                            {...field}
                            className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                            value={
                              field.value === undefined || isNaN(field.value)
                                ? ""
                                : field.value
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="validadeCartao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-800 font-medium">
                          Validade do Cartão
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isSubmitted}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                {form.formState.isSubmitting
                  ? "Salvando..."
                  : "Salvar Cadastro"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="bg-gradient-to-r from-amber-100 to-amber-200 rounded-b-lg border-t border-amber-300">
          {isSubmitted && dadosParaImpressao && (
            <div
              ref={contentRef}
              className="mt-8 flex justify-center space-x-4"
            >
              <div className="mt-8 flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleNewCard}
                  className="border-amber-300 text-amber-800 hover:bg-amber-50"
                >
                  Novo Cartão
                </Button>
                <Button
                  onClick={() => setIsRequisicaoModalOpen(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Visualizar Requisição
                </Button>
                <Button
                  onClick={() => setIsCartaoModalOpen(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Visualizar Cartão
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* --- MODAIS DE IMPRESSÃO INTEGRADOS DIRETAMENTE --- */}
      {dadosParaImpressao && (
        <>
          {/* Modal para a Requisição */}
          <Dialog
            open={isRequisicaoModalOpen}
            onOpenChange={setIsRequisicaoModalOpen}
          >
            <DialogContent className="sm:max-w-[850px] h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Visualização da Requisição</DialogTitle>
              </DialogHeader>
              {/* Adicionada a classe print-content */}
              <div className="print-content flex-grow overflow-auto p-4 border rounded-md">
                <Requisicao
                  efetivo={dadosParaImpressao.efetivo}
                  vehicle={dadosParaImpressao.vehicle}
                />
              </div>
              <DialogFooter className="mt-4">
                <Button
                  onClick={() =>
                    handlePrint(
                      <Requisicao
                        efetivo={dadosParaImpressao.efetivo}
                        vehicle={dadosParaImpressao.vehicle}
                      />,
                    )
                  }
                >
                  <Printer className="w-5 h-5" />
                  Imprimir Requisição
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal para o Cartão */}
          <Dialog open={isCartaoModalOpen} onOpenChange={setIsCartaoModalOpen}>
            <DialogContent className="sm:max-w-[850px] h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Visualização do Cartão</DialogTitle>
              </DialogHeader>
              <div className="flex-grow overflow-auto p-4 border rounded-md">
                <Cartao
                  efetivo={dadosParaImpressao.efetivo}
                  vehicle={dadosParaImpressao.vehicle}
                />
                {/* <CartaoPDF efetivo={dadosParaImpressao.efetivo} vehicle={dadosParaImpressao.vehicle}/> */}
              </div>
              <DialogFooter className="mt-4">
                <Button
                  onClick={() =>
                    handlePrint(
                      <Cartao
                        efetivo={dadosParaImpressao.efetivo}
                        vehicle={dadosParaImpressao.vehicle}
                      />,
                    )
                  }
                >
                  <Printer className="w-5 h-5" />
                  Imprimir Cartão
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
