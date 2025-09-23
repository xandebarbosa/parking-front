// Opcional: Tipo para o objeto aninhado 'efetivo'
export type Efetivo = {
  id: number;
  re: string;
  name: string;
  postoGrad: string;
  rg: string;
  cpf: string;
  opm: string;
  funcao: string;
  secao: string;
  ramal: string;
  pgu: string;
  valCnh: string;

};

// Tipo principal para cada objeto de cartão de estacionamento
export type CartaoEstacionamento = {
  id: number;
  card_number: string;
  placa: string;
  modelo: string;
  color: string;
  ano: string;
  municipio: string;
  uf: string;
  chassi: string;
  renavan: string;
  reFiscalizador: string,
  periodo1Entrada: string,
  periodo1Saida: string,
  periodo2Entrada: string,
  periodo2Saida: string,
  local: string,
  dias: number,
  validadeCartao: string; // Mantemos como string, pois é assim que vem da API
  efetivo?: Efetivo;       // A '?' torna a propriedade opcional
};

// Tipo para as props do nosso componente
export type TabelaCartoesValidadeProps = {
  cartoes?: CartaoEstacionamento[]; // O array também é opcional
};