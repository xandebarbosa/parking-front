// src/components/print/Cartao.tsx
import React from "react";

interface CartaoProps {
  efetivo: any;
  vehicle: any;
}

export default function Cartao({ efetivo, vehicle }: CartaoProps) {
  const formatCardNumber = (num: number) => {
    return String(num).padStart(4, "0");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  return (
    <div className="print-card p-1 bg-white text-black text-[8px] font-sans w-[14cm] h-[10cm] border-2 border-black flex flex-col">
  {/* CABEÇALHO */}
  {/* Ajustado padding vertical (py) para economizar espaço */}
  <div className="flex flex-row mb-0.5">
    {/* Lado esquerdo: Logo e Polícia Militar */}
    <div className="flex flex-row flex-1 border-2 border-black items-center gap-1 pl-4 justify-center">
      {/** biome-ignore lint/performance/noImgElement: <explanation> */}
      <img
        src="/brasao-pmesp.png"
        alt="Brasão da Polícia Militar"
        // Altura da imagem ligeiramente reduzida para garantir que caiba
        className="w-15 h-15 object-contain"
      />
      <div className="flex flex-col flex-1 text-xs font-bold pr-0.5 items-center justify-center">
        <p>POLÍCIA MILITAR</p>
        <p>DO</p>
        <p>ESTADO DE SÃO PAULO</p>
      </div>
    </div>

    {/* Lado direito: Título do cartão e Número/Validade */}
    <div className="flex flex-col flex-1 pl-1 gap-0.5">
      <h1 className="text-[8px] font-bold text-center border-2 border-black py-0.5 bg-gray-200">
        CARTÃO DE ESTACIONAMENTO
      </h1>

      <div className="flex flex-row flex-1 gap-[1px]">
        <div className="flex-1 border-2 border-black text-center">
          <p className="text-[7px] bg-gray-200 py-0.5 border-b border-black">
            NÚMERO
          </p>
          <p className="text-base font-bold py-1">
            {vehicle?.card_number
              ? formatCardNumber(vehicle.card_number)
              : ""}
          </p>
        </div>
        <div className="flex-1 border-2 border-black text-center">
          <p className="text-[7px] bg-gray-200 py-0.5 border-b border-black">
            VALIDADE
          </p>
          <p className="text-base font-bold py-1 text-red-600">
            {formatDate(vehicle?.validadeCartao)}
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* DADOS PESSOAIS */}
  <div className="mb-1">
    <div className="bg-gray-200 border-2 border-black text-center text-[8px] font-bold py-1 mb-1">
      DADOS PESSOAIS
    </div>
    <div className="flex flex-row gap-1 mb-1">
      <div className="w-1/4">
        {/* REMOVIDO h-12, adicionado padding (py-2) ao conteúdo */}
        <div className="border-2 border-black text-center flex flex-col">
          <div className="bg-gray-200 text-[8px] py-0.5 border-b border-black">
            POSTO/GRAD
          </div>
          <div className="flex-1 flex items-center justify-center text-[8px] font-bold py-1">
            {efetivo?.postoGrad}
          </div>
        </div>
      </div>
      <div className="w-3/4 flex flex-col">
        {/* REMOVIDO h-12, adicionado padding (py-2) ao conteúdo */}
        <div className="border-2 border-black text-center flex flex-col">
          <div className="bg-gray-200 text-[8px] py-0.5 border-b border-black">
            NOME
          </div>
          <div className="flex-1 flex items-center justify-center text-[8px] font-bold py-1">
            {efetivo?.name}
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-row gap-1">
      <div className="w-1/3 flex flex-col">
        {/* REMOVIDO h-12, adicionado padding (py-2) ao conteúdo */}
        <div className="border-2 border-black text-center flex flex-col">
          <div className="bg-gray-200 text-[8px] py-0.5 border-b border-black">
            OPM
          </div>
          <div className="flex-1 flex items-center justify-center text-[8px] font-bold py-1">
            {efetivo?.opm}
          </div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col">
        {/* REMOVIDO h-12, adicionado padding (py-2) ao conteúdo */}
        <div className="border-2 border-black text-center flex flex-col">
          <div className="bg-gray-200 text-[8px] py-0.5 border-b border-black">
            SEÇÃO
          </div>
          <div className="flex-1 flex items-center justify-center text-[8px] font-bold py-1">
            {efetivo?.secao}
          </div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col">
        {/* REMOVIDO h-12, adicionado padding (py-2) ao conteúdo */}
        <div className="border-2 border-black text-center flex flex-col">
          <div className="bg-gray-200 text-[8px] py-0.5 border-b border-black">
            RAMAL
          </div>
          <div className="flex-1 flex items-center justify-center text-[8px] font-bold py-1">
            {efetivo?.ramal}
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* DADOS DOS VEÍCULOS */}
  <div className="mb-1 flex-1 flex flex-col">
    <div className="bg-gray-200 border-2 border-black text-center text-[8px] font-bold py-0.5 mb-0.5">
      DADOS DOS VEÍCULOS
    </div>
    <div className="flex flex-row flex-1 gap-0 border-2 border-black">
      {/* REMOVIDO h-12 de todos os filhos, adicionado padding (py-2) */}
      <div className="w-1/5 border-r text-center flex flex-col">
        <div className="bg-gray-200 text-[8px] py-0.5 border-b border-black">
          MARCA/MODELO
        </div>
        <div className="flex-1 flex items-center justify-center text-[8px] font-semibold py-1">
          {vehicle?.modelo}
        </div>
      </div>

      <div className="w-1/5 border-r text-center flex flex-col">
        <div className="bg-gray-200 text-[8px] py-0.5 border-b border-black">
          PLACA
        </div>
        <div className="flex-1 flex items-center justify-center text-[10px] font-bold py-2">
          {vehicle?.placa}
        </div>
      </div>

      <div className="w-1/5 border-r text-center flex flex-col">
        <div className="bg-gray-200 text-[8px] py-0.5 border-b border-black">
          MUNICÍPIO
        </div>
        <div className="flex-1 flex items-center justify-center text-[8px] font-semibold py-1">
          {vehicle?.municipio}
        </div>
      </div>

      <div className="w-1/5 border-r text-center flex flex-col">
        <div className="bg-gray-200 text-[8px] py-0.5 border-b border-black">
          ESTADO
        </div>
        <div className="flex-1 flex items-center justify-center text-[8px] font-semibold py-1">
          {vehicle?.uf}
        </div>
      </div>

      <div className="w-1/5 text-center flex flex-col">
        <div className="bg-gray-200 text-[8px] py-0.5 border-b border-black">
          COR
        </div>
        <div className="flex-1 flex items-center justify-center text-[8px] font-semibold py-1">
          {vehicle?.color}
        </div>
      </div>
    </div>
  </div>

  {/* PARTE INFERIOR */}
  {/* mt-auto é a chave para empurrar esta seção para o fundo */}
  <div className="flex flex-row mt-auto">
    {/* Coluna Esquerda */}
    <div className="w-1/2 flex flex-col">
      {/* Local e quantidade de dias */}
      <div className="flex-1 border-2 border-black mb-1">
        <div className="bg-gray-200 text-center text-[8px] font-bold py-0.5 border-b border-black">
          Local e quantidade de dias
        </div>
        <div className="flex-1 flex items-center justify-center p-1 text-center text-[8px] font-normal">
            {vehicle?.local || 'PÁTIO'} - {vehicle?.dias} {" "}
            <span className="text-[8px]"> dias / semana</span>
          </div>
      </div>

      {/* Período e Data */}
      <div className="flex flex-row gap-1">
        <div className="w-1/2 flex flex-col">
           {/* REMOVIDO h-[68px] */}
          <div className="border-2 border-black ">
            <div className="bg-gray-200 text-center text-[8px] font-bold py-0.5 border-b border-black">
              Período Solicitado
            </div>
            <div className="p-0.5 text-[8px] text-center flex flex-col items-center justify-center">
              <p>
                das {vehicle?.periodo1Entrada} às {vehicle?.periodo1Saida}
              </p>
              <p>
                das {vehicle?.periodo2Entrada} às {vehicle?.periodo2Saida}
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
           {/* REMOVIDO h-[68px] */}
          <div className="border-2 border-black h-[50px]">
            <div className="bg-gray-200 text-center text-[8px] font-bold py-0.5 border-b border-black">
              Emitido em
            </div>
            <div className="p-1 text-[8px] text-center font-medium flex items-center justify-center">
              {formatDate(vehicle?.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Coluna Direita - Assinatura */}
    {/* Adicionado flex flex-col aqui para que o conteúdo interno possa crescer */}
    <div className="w-1/2 flex flex-col">
      {/* h-full garante que a caixa de assinatura ocupe todo o espaço vertical da coluna */}
      <div className="border-2 border-black h-[95px] ml-[5px] flex flex-col">
        <div className="bg-gray-200 text-center text-[8px] font-bold py-0.5 border-b border-black">
          Assinatura e Carimbo do emissor
        </div>
        {/* flex-1 (flex-grow: 1) faz este div se expandir para preencher o espaço restante */}
        <div className="p-2 flex-1">{/* Espaço para assinatura */}</div>
      </div>
    </div>
  </div>
</div>
  );
}
