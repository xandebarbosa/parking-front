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
    setExistingEfetivoId(String(efetivo.id)); // Assumindo que o objeto 'efetivo' tem uma propriedade 'id'

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
            opm: values.opm,
            funcao: values.funcao,
            secao: values.secao,
            ramal: values.ramal,
            pgu: values.pgu,
            valCnh: values.valCnh,
            // ... inclua os outros campos do efetivo que você precisa para a impressão
          };

          dadosFinaisParaImpressao = {
            efetivo: efetivoDataFromForm,
            vehicle: newVehicle,
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
        if (
          !dadosFinaisParaImpressao?.efetivo ||
          !dadosFinaisParaImpressao?.vehicle
        ) {
          throw new Error(
            "A resposta da API não continha os dados esperados do efetivo ou do veículo.",
          );
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
    <div className="mx-auto py-2">
  
    <Card className="w-full h-full shadow-xl bg-white dark:bg-slate-800/95 backdrop-blur-sm border border-[#14213d] pt-0">
      {/* Header aprimorado sem espaços extras */}
      <CardHeader className="bg-[#14213d] shadow-lg border-yellow-300 text-white px-4.5 py-3 border rounded-t-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-2xl text-yellow-300 font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              Novo Cartão de Estacionamento
            </CardTitle>
            <CardDescription className="text-blue-100 text-base font-medium">
              Cadastre um novo efetivo e registre seu veículo principal de forma rápida e segura
            </CardDescription>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <Label className="block font-semibold text-center mb-2 text-white text-sm uppercase tracking-wide">
              Número do Cartão
            </Label>
            <Input
              readOnly
              value={nextCardNumber}
              className="bg-white text-slate-900 border-0 text-2xl text-center font-bold shadow-inner focus:ring-2 focus:ring-blue-300 h-8 w-36 mx-auto"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="dark:bg-slate-800/80 backdrop-blur-sm pt-0.5 px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Seção do Efetivo com design melhorado */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-100 dark:border-slate-600">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Dados do Efetivo
                </h3>
              </div>

              <div className="space-y-2">
                {/* Primeira linha - RE, Nome e Botão de Busca */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                  <FormField
                    control={form.control}
                    name="re"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          RE
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                            placeholder="000000-0"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-7">
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Nome Completo
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                            placeholder="Digite o nome completo do efetivo"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <div className="lg:col-span-3">
                    <SearchEfetivoModal onEfetivoSelect={handleEfetivoSelect} />
                  </div>
                </div>

                {/* Segunda linha - Dados complementares */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <FormField
                    control={form.control}
                    name="postoGrad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Posto/Graduação
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                            placeholder="Ex: Cb PM"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          RG
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                            placeholder="00.000.000-0"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          CPF
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                            placeholder="000.000.000-00"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pgu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Nº PGU
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                            placeholder="00000000"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="opm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          OPM
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                            placeholder="Ex: 2º BPRv - EM"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Terceira linha - Informações de trabalho */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  <FormField
                    control={form.control}
                    name="funcao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Função
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                            placeholder="Ex: Auxiliar P1"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="secao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Seção
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                            placeholder="Ex: P1"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ramal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Ramal
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                            placeholder="0000"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="valCnh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Validade CNH
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Seção do Veículo */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-100 dark:border-slate-600">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                  {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4zm-6-4a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Dados do Veículo
                </h3>
              </div>

              <div className="space-y-6">
                {/* Primeira linha - Dados básicos do veículo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                  <FormField
                    control={form.control}
                    name="placa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Placa
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-200 font-mono uppercase"
                            placeholder="ABC-1I34"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="modelo"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Marca/Modelo
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-200"
                            placeholder="Ex: Honda Civic"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Cor
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-200"
                            placeholder="Ex: Branco"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ano"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Ano
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-200"
                            placeholder="2023"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Segunda linha - Dados de registro */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-2">
                  <FormField
                    control={form.control}
                    name="municipio"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Município
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-200"
                            placeholder="Ex: São Paulo"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="uf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          UF
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-200 uppercase"
                            placeholder="SP"
                            maxLength={2}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="chassi"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Chassi
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-200 font-mono"
                            placeholder="Ex: 9BD00000000000000"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="renavan"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          Renavan
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-200"
                            placeholder="00000000000"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reFiscalizador"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                          RE Fiscalizador
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-200"
                            placeholder="00000-0"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Terceira linha - RE Fiscalizador
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
                  
                </div> */}
              </div>
            </div>

            {/* Seção de Período e Validade */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-violet-100 dark:border-slate-600">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full flex items-center justify-center">
                  {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Período e Validade
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-2">
                <FormField
                  control={form.control}
                  name="periodo1Entrada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                        Período 1 - Entrada
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="h-11 border-slate-200 dark:border-slate-600 focus:border-violet-500 focus:ring-violet-200 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="periodo1Saida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                        Período 1 - Saída
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="h-11 border-slate-200 dark:border-slate-600 focus:border-violet-500 focus:ring-violet-200 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="periodo2Entrada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                        Período 2 - Entrada
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="h-11 border-slate-200 dark:border-slate-600 focus:border-violet-500 focus:ring-violet-200 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="periodo2Saida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                        Período 2 - Saída
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="h-11 border-slate-200 dark:border-slate-600 focus:border-violet-500 focus:ring-violet-200 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="local"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                        Local
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11 border-slate-200 dark:border-slate-600 focus:border-violet-500 focus:ring-violet-200 transition-all duration-200"
                          placeholder="Ex: Garagem Principal"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                        Dias
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 7"
                          {...field}
                          className="h-11 border-slate-200 dark:border-slate-600 focus:border-violet-500 focus:ring-violet-200 transition-all duration-200"
                          value={field.value === undefined || isNaN(field.value) ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="validadeCartao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                        Validade do Cartão
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="h-11 border-slate-200 dark:border-slate-600 focus:border-violet-500 focus:ring-violet-200 transition-all duration-200 text-slate-700 dark:text-slate-300"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Botão de submissão melhorado */}
            <div className="flex justify-start pt-0.5">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isSubmitted}
                className="h-12 px-12 bg-[#14213d] hover:bg-[#1a2749] text-white font-bold shadow-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-blue-200 rounded-xl text-lg"
              >
                {form.formState.isSubmitting ? (
                  <>
                    {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando Cartão...
                  </>
                ) : (
                  <>
                    {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Salvar Cadastro
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      {/* Footer aprimorado com ações */}
      <CardFooter className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-t border-slate-200 dark:border-slate-600 p-6">
        {isSubmitted && dadosParaImpressao && (
          <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="outline"
                onClick={handleNewCard}
                className="h-11 px-6 border-2 bg-blue-500 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 hover:border-slate-400 transition-all duration-200 font-semibold"
              >
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                Novo Cartão
              </Button>
              
              <Button
                onClick={() => setIsRequisicaoModalOpen(true)}
                className="h-11 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                </svg>
                Visualizar Requisição
              </Button>
              
              <Button
                onClick={() => setIsCartaoModalOpen(true)}
                className="h-11 px-6 bg-[#14213d] hover:bg-[#1a2749] text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                </svg>
                Visualizar Cartão
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>

    {/* Modais de impressão aprimorados */}
    {dadosParaImpressao && (
      <>
        {/* Modal para a Requisição */}
        <Dialog open={isRequisicaoModalOpen} onOpenChange={setIsRequisicaoModalOpen}>
          <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col border-0 shadow-2xl">
            <DialogHeader className="bg-[#14213d] text-white rounded-t-lg p-6 -m-6 mb-6">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                </svg>
                Visualização da Requisição
              </DialogTitle>
            </DialogHeader>
            
            <div className="print-content flex-grow overflow-auto p-6 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800">
              <Requisicao
                efetivo={dadosParaImpressao.efetivo}
                vehicle={dadosParaImpressao.vehicle}
              />
            </div>
            
            <DialogFooter className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
              <Button
                onClick={() =>
                  handlePrint(
                    <Requisicao
                      efetivo={dadosParaImpressao.efetivo}
                      vehicle={dadosParaImpressao.vehicle}
                    />,
                  )
                }
                className="h-11 px-6 bg-[#14213d] hover:bg-[#1a2749] text-white font-semibold shadow-lg transition-all duration-200"
              >
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd"/>
                </svg>
                Imprimir Requisição
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal para o Cartão */}
        <Dialog open={isCartaoModalOpen} onOpenChange={setIsCartaoModalOpen}>
          <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col border-0 shadow-2xl">
            <DialogHeader className="bg-[#14213d] text-white rounded-t-lg p-6 -m-6 mb-6">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                </svg>
                Visualização do Cartão
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-grow overflow-auto p-6 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800">
              <Cartao
                efetivo={dadosParaImpressao.efetivo}
                vehicle={dadosParaImpressao.vehicle}
              />
            </div>
            
            <DialogFooter className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
              <Button
                onClick={() =>
                  handlePrint(
                    <Cartao
                      efetivo={dadosParaImpressao.efetivo}
                      vehicle={dadosParaImpressao.vehicle}
                    />,
                  )
                }
                className="h-11 px-6 bg-[#14213d] hover:bg-[#1a2749] text-white font-semibold shadow-lg transition-all duration-200"
              >
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd"/>
                </svg>
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
