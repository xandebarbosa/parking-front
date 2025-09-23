"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import Cartao from "@/components/print/Cartao";
import Requisicao from "@/components/print/Requisicao";

// Define os tipos de dados esperados para clareza
interface PrintData {
  efetivo: any; // O ideal é criar uma interface para Efetivo
  vehicle: any; // O ideal é criar uma interface para Vehicle
}

interface PrintSectionProps {
  data: PrintData | null;
}

export function PrintSection({ data }: PrintSectionProps) {
  const requisicaoRef = useRef<HTMLDivElement>(null);
  const cartaoRef = useRef<HTMLDivElement>(null);

  const handlePrintRequisicao = useReactToPrint({
    content: () => requisicaoRef.current,
    documentTitle: "Requisicao_Cartao_Estacionamento",
  } as any);

  const handlePrintCartao = useReactToPrint({
    content: () => cartaoRef.current,
    documentTitle: "Cartao_Estacionamento",
  } as any);

  // Se não houver dados, não renderiza nada
  if (!data) {
    return null;
  }

  return (
    <>
      {/* Botões de impressão visíveis para o usuário */}
      <div className="mt-8 flex justify-center space-x-4">
        <Button onClick={handlePrintRequisicao}>Imprimir Requisição</Button>
        <Button onClick={handlePrintCartao}>Imprimir Cartão</Button>
      </div>

      {/* Componentes de impressão (visualmente ocultos, mas presentes no DOM) */}
      <div className="absolute -z-10 -top-[9999px] -left-[9999px]">
        <Requisicao efetivo={data.efetivo} vehicle={data.vehicle} />
        <Cartao efetivo={data.efetivo} vehicle={data.vehicle} />
      </div>
    </>
  );
}
