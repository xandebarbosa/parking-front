"use client";

import { useFormContext } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchEfetivoModal } from "@/components/SearchEfetivoModal";
import type { CadastroFormData } from "./schemas";


interface CadastroFormProps {
  onSubmit: (values: CadastroFormData) => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  handleEfetivoSelect: (efetivo: any) => void;
}

export function CadastroForm({
  onSubmit,
  isSubmitting,
  isSubmitted,
  handleEfetivoSelect,
}: CadastroFormProps) {
  const form = useFormContext<CadastroFormData>();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Seção do Efetivo com design melhorado */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-100 dark:border-slate-600">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
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
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4zm-6-4a2 2 0 11-4 0 2 2 0 014 0z"
                  clipRule="evenodd"
                />
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
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
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
                      value={
                        field.value === undefined || isNaN(field.value)
                          ? ""
                          : field.value
                      }
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
            disabled={isSubmitting || isSubmitted}
            className="h-12 px-12 bg-[#14213d] hover:bg-[#1a2749] text-white font-bold shadow-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-blue-200 rounded-xl text-lg"
          >
            {isSubmitting ? (
              <>
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
                Salvando Cartão...
              </>
            ) : (
              <>
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Salvar Cadastro
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
