// src/components/print/Requisicao.tsx
import React from "react";
import { Calendar } from "lucide-react";

interface RequisicaoProps {
  efetivo: any; 
  vehicle: any; 
}

export default function Requisicao({ efetivo, vehicle }: RequisicaoProps) {

  const formatCardNumber = (num: number) => {
    return String(num).padStart(4, "0");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const formateTime = (timeString: string) => {
    if (!timeString) return "";

    // Caso venha no formato HH:mm:ss
    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    }

    return timeString;
  }

  return (
    <div className="print-request p-1 bg-white text-black font-sans w-[17cm] h-[11.36cm] border-2 border-black flex flex-col">
      <div className="flex flex-row mb-0.5 gap-0.5">
        {/*LADO ESQUERDO  */}
        <div className="flex flex-row flex-1 border-2 border-black justify-center items-center gap-0.5 pt-0.5 pb-0.5 pl-1">
          {/** biome-ignore lint/performance/noImgElement: <explanation> */}
          <img
            src="/brasao-pmesp.png"
            alt="Brasão da Polícia Militar"
            className="w-15 h-15 object-contain"
          />
          <div className="flex flex-col flex-1 text-xs font-bold items-center justify-center">
            <p>POLÍCIA MILITAR</p>
            <p>DO</p>
            <p>ESTADO DE SÃO PAULO</p>
          </div>
        </div>
        {/*LADO DIREITO*/}
        <div className="flex flex-col flex-1 border-2 border-black justify-center items-center gap-0.5 pt-0.5 pb-0.5">
          <h1 className="text-base font-bold">REQUISIÇÃO DE</h1>
          <h1 className="text-base font-bold">CARTÃO DE ESTACIONAMENTO</h1>
        </div>
      </div>

      {/* Informações do Efetivo */}
      <div className="mb-1 border-2 border-black p-0.5">
        <div className="bg-gray-200 text-xs border-2 border-black text-center font-bold mb-0.5">
          DADOS PESSOAIS
        </div>
        <div className="grid grid-cols-[1fr_1fr_1fr_3fr] gap-1">
          <div className="font-bold text-[10px] text-center">POSTO/GRAD</div>
          <div className="font-bold text-[10px] text-center">RE</div>
          <div className="font-bold text-[10px] text-center">RG</div>
          <div className="font-bold text-[10px] text-center">NOME</div>
          <div className="text-[10px] border border-black p-0.5 text-center">
            {efetivo?.postoGrad}
          </div>
          <div className="text-[10px] border border-black p-0.5 text-center">
            {efetivo?.re}
          </div>
          <div className="text-[10px] border border-black p-0.5 text-center">
            {efetivo?.rg}
          </div>
          <div className="text-[10px] border border-black p-0.5 text-center">
            {efetivo?.name}
          </div>
        </div>

        <div className="grid grid-cols-6 gap-1 mt-0.5">
          <div className="font-bold text-[10px] text-center">OPM</div>
          <div className="font-bold text-[10px] text-center">FUNÇÃO</div>
          <div className="font-bold text-[10px] text-center">SEÇÃO</div>
          <div className="font-bold text-[10px] text-center">RAMAL</div>
          <div className="font-bold text-[10px] text-center">PGU</div>
          <div className="font-bold text-[10px] text-center">VALIDADE CNH</div>
          <div className="text-[10px] border border-black p-0.5 text-center">
            {efetivo?.opm}
          </div>
          <div className="text-[10px] border border-black p-0.5 text-center">
            {efetivo?.funcao}
          </div>
          <div className="text-[10px] border border-black p-0.5 text-center">
            {efetivo?.secao}
          </div>
          <div className="text-[10px] border border-black p-0.5 text-center">
            {efetivo?.ramal}
          </div>
          <div className="text-[10px] border border-black p-0.5 text-center">
            {efetivo?.pgu}
          </div>
          <div className="text-[10px] border border-black p-0.5 text-center">
            {efetivo?.valCnh
              ? new Date(efetivo.valCnh).toLocaleDateString()
              : ""}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 mb-1">
        <div className="col-span-4 border-2 border-black p-0.5">
          <div className="bg-gray-200 border-2 border-black font-bold text-xs mb-0.5 text-center">
            DADOS DO VEÍCULO
          </div>
          <div className="grid grid-cols-8 gap-0.5">
            <div className="col-span-2 font-bold text-[10px] text-center">
              PLACAS
            </div>
            <div className="col-span-3 font-bold text-[10px] text-center">
              MARCA/MODELO
            </div>
            <div className="col-span-2 font-bold text-[10px] text-center">COR</div>
            <div className="col-span-1 font-bold text-[10px] text-center">ANO</div>

            <div className="col-span-2 font-bold text-[10px] text-center border border-black p-1">
              {vehicle?.placa}
            </div>
            <div className="col-span-3 font-medium text-[10px] text-center border border-black p-1">
              {vehicle?.modelo}
            </div>
            <div className="col-span-2 font-medium text-[10px] text-center border border-black p-1">
              {vehicle?.color}
            </div>
            <div className="col-span-1 font-medium text-[10px] text-center border border-black p-1">
              {vehicle?.ano}
            </div>

            <div className="col-span-3 font-bold text-[10px] text-center">
              MUNICÍPIO
            </div>
            <div className="col-span-1 font-bold text-[10px] text-center">UF</div>
            <div className="col-span-2 font-bold text-[10px] text-center">
              CHASSI
            </div>
            <div className="col-span-2 font-bold text-[10px] text-center">
              RENAVAN
            </div>

            <div className="col-span-3 font-medium text-[10px] text-center border border-black p-0.5">
              {vehicle?.municipio}
            </div>
            <div className="col-span-1 font-medium text-[10px] text-center border border-black p-0.5">
              {vehicle?.uf}
            </div>
            <div className="col-span-2 font-medium text-[10px] text-center border border-black p-0.5">
              {vehicle?.chassi}
            </div>
            <div className="col-span-2 font-medium text-[10px] text-center items-center border border-black p-0.5">
              {vehicle?.renavan}
            </div>
          </div>
        </div>

        {/* {Conferido e fiscalizado} */}
        <div className="col-span-1 border-2 border-black p-0.5 ml-1">
          <div className="bg-gray-200 border-2 border-black font-bold text-[8px] pt-0.5 text-center">
            CONFERIDO E FISCALIZADO
          </div>
          <p className="font-bold text-[10px] text-center pt-6">RE:</p>
          <div className="text-[10px] text-center border border-black p-0.5 h-5">
            {"126.126-1"}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-0.5">
        <div className="col-span-2 border-2 border-black p-0.5">
          <div className="bg-gray-200 border-2 border-black font-bold text-[10px] mb-0.5 text-center">
            ESTACIONAMENTO E PERÍODO
          </div>
          <div className="grid grid-cols-5 gap-0 text-center h-20 items-center">
            <div className="col-span-1 font-medium text-[10px] ml-1">
              {vehicle?.local || 'PÁTIO'}
            </div>
            <div className="col-span-2 font-medium text-[10px] gap-0.5">
              <div className="flex gap-0.5">
                <p className="flex-1 border-2 border-black mb-0.5">
                  {formateTime(vehicle?.periodo1Entrada)}
                </p>
                <p className="flex-1 border-2 border-black mb-0.5">
                  {formateTime(vehicle?.periodo1Saida)}
                </p>
              </div>
              <div className="flex gap-0.5">
                <p className="flex-1 border-2 border-black mb-0.5">
                  {formateTime(vehicle?.periodo2Entrada)}
                </p>
                <p className="flex-1 border-2 border-black mb-0.5">
                  {formateTime(vehicle?.periodo2Saida)}
                </p>
              </div>
            </div>
            <div className="col-span-1 font-medium text-[10px]">
              <div className="font-medium text-[10px] border-2 border-black ml-1">
                {vehicle?.dias}
              </div>
              
            </div>
            <div className="col-span-1 font-medium text-[10px]">
              DIAS
            </div>
          </div>
        </div>

        <div className="col-span-2 border-2 border-black p-0.5">
          <div className="bg-gray-200 border-2 border-black font-bold text-[10px] mb-2 text-center">
            ASSINATURA DO SOLICITANTE
          </div>
        </div>
        <div className="col-span-2 border-2 border-black p-0.5">
          <div className="bg-gray-200 border-2 border-black font-bold text-[10px] mb-2 text-center">
            N° E VALIDADE DO CARTÃO
          </div>

          <div className="flex items-center justify-center h-20">
            <div className="flex-1 font-bold text-lg text-center flex items-center justify-center">
              {vehicle?.card_number
                ? formatCardNumber(vehicle.card_number)
                : ""
              }
            </div>
            <div className="flex-1 font-bold text-xl text-center mr-7 flex items-center justify-center">
              {formatDate(vehicle?.validadeCartao)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
}
