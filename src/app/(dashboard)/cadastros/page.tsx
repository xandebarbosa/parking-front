"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import router from "next/router";
import { CadastroForm } from "./components/CadastroForm";
import { AcoesPosCadastro } from "./components/AcoesPosCadastro";
import { cadastroSchema, type CadastroFormData } from "./components/schemas";

export default function CadastroPage() {
  const [nextCardNumber, setNextCardNumber] = useState<string>("");
  const [dadosParaImpressao, setDadosParaImpressao] = useState<{
    efetivo: any;
    vehicle: any;
  } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Estado para armazenar o ID do efetivo existente selecionado
  const [existingEfetivoId, setExistingEfetivoId] = useState<string | null>(
    null,
  );

  const { token } = useAuth();

  console.log("dadosParaImpressao ===> ", dadosParaImpressao);

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
      router.push("/login");
      return; // Interrompe a execução se não houver token
    }
    // Exibe um toast de carregamento
    // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
    const promise = new Promise(async (resolve, reject) => {
      try {
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
        let dadosFinaisParaImpressao;

        // SE TEMOS UM ID, significa que estamos adicionando um veículo a um efetivo existente
        if (existingEfetivoId) {
          toast.info("Adicionando novo veículo ao efetivo existente...");
          // Você precisará de um endpoint na sua API para isso. Ex: POST /efetivos/{id}/vehicles
          const response = await api.post(
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

          const response = await api.post("/full-cadastro", {
            efetivoData,
            vehicleData,
          });

          console.log("Resposta da API (Cadastro Completo):", response.data);
          const { efetivo, vehicle } = response.data;
          dadosFinaisParaImpressao = { efetivo, vehicle };
          //setDadosParaImpressao({ efetivo, vehicle });
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
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                Novo Cartão de Estacionamento
              </CardTitle>
              <CardDescription className="text-blue-100 text-base font-medium">
                Cadastre um novo efetivo e registre seu veículo principal de
                forma rápida e segura
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

        <FormProvider {...form}>
          <CardContent className="dark:bg-slate-800/80 backdrop-blur-sm pt-0.5 px-8">
            <CadastroForm
              onSubmit={onSubmit}
              isSubmitting={form.formState.isSubmitting}
              isSubmitted={isSubmitted}
              handleEfetivoSelect={handleEfetivoSelect}
            />
          </CardContent>
        </FormProvider>

        {/* Footer aprimorado com ações */}
        <CardFooter className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-t border-slate-200 dark:border-slate-600 p-6">
          {isSubmitted && dadosParaImpressao && (
            <AcoesPosCadastro
              dadosParaImpressao={dadosParaImpressao}
              onNewCard={handleNewCard}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
