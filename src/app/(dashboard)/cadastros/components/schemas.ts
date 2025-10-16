import { z } from "zod";

// Regex para validar hora no formato HH:mm
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

// 1. Defina e exporte o schema
export const cadastroSchema = z.object({
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
  periodo1Entrada: z.string().regex(timeRegex, "Período 1 de Entrada é obrigatório"),
  periodo1Saida: z.string().regex(timeRegex, "Período 1 de Saída é obrigatório"),
  periodo2Entrada: z.string().regex(timeRegex, "Período 2 de Entrada é obrigatório"),
  periodo2Saida: z.string().regex(timeRegex, "Período 2 de Saída é obrigatório"),
  local: z.string().min(1, "Local do estacionamento é obrigatório"),
  dias: z.coerce.number({ required_error: "Deve ser um número" }).min(1, "Número de dias é obrigatório"),
  validadeCartao: z.string().min(1, "Validade do cartão é obrigatória"),
});

// 2. Exporte também o tipo inferido para facilitar o uso nos componentes
export type CadastroFormData = z.infer<typeof cadastroSchema>;