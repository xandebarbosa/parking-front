"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cartao from "@/components/print/Cartao";
import { Button } from "@/components/ui/button";

export default function PrintCartaoPage() {
  const [printData, setPrintData] = useState<{
    efetivo: any;
    vehicle: any;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Pega os dados salvos no localStorage pela página de cadastro
    const dataString = localStorage.getItem("dadosParaImpressao");

    if (dataString) {
      const data = JSON.parse(dataString);
      setPrintData(data);

      // 2. Aciona a impressão após um pequeno atraso para garantir que o componente renderizou
      setTimeout(() => {
        window.print();
      }, 500);
    } else {
      // Se não houver dados (ex: usuário acessou a URL diretamente), redireciona de volta
      alert("Nenhum dado encontrado para impressão.");
      router.back();
    }
  }, [router]);

  // Enquanto os dados não carregam, mostra uma mensagem
  if (!printData) {
    return <div className="p-10">Carregando dados para impressão...</div>;
  }

  // Renderiza a página de visualização
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      {/* Este botão só aparecerá na tela, não no papel */}
      <div className="print:hidden mb-4 p-4 bg-white rounded-md shadow-lg">
        <p className="mb-2">
          Se a janela de impressão não abriu, clique no botão abaixo.
        </p>
        <Button onClick={() => window.print()}>Imprimir novamente</Button>
      </div>
      <Cartao efetivo={printData.efetivo} vehicle={printData.vehicle} />
    </div>
  );
}
