"use client";

import Cartao from "@/components/print/Cartao";
import Requisicao from "@/components/print/Requisicao";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePrint } from "@/hooks/usePrint";
import { CreditCard, FileText, Printer } from "lucide-react";
import { useState } from "react";

interface AcoesPosCadastroProps {
  dadosParaImpressao: { efetivo: any; vehicle: any };
  onNewCard: () => void;
}

export function AcoesPosCadastro({
  dadosParaImpressao,
  onNewCard,
}: AcoesPosCadastroProps) {
  const [isRequisicaoModalOpen, setIsRequisicaoModalOpen] = useState(false);
  const [isCartaoModalOpen, setIsCartaoModalOpen] = useState(false);
  const { handlePrint } = usePrint();
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          variant="outline"
          onClick={onNewCard}
          className="h-11 px-6 border-2 bg-blue-500 border-slate-300 text-slate-700 hover:bg-slate-100 transition-all duration-200 font-semibold"
        >
          Novo Cartão
        </Button>
        <Button
          onClick={() => setIsRequisicaoModalOpen(true)}
          className="h-11 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg transition-all"
        >
          <FileText className="w-5 h-5 mr-2" />
          Visualizar Requisição
        </Button>
        <Button
          onClick={() => setIsCartaoModalOpen(true)}
          className="h-11 px-6 bg-[#14213d] hover:bg-[#1a2749] text-white font-semibold shadow-lg transition-all"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Visualizar Cartão
        </Button>
      </div>

      {/* Modais de Impressão */}
      <Dialog
        open={isRequisicaoModalOpen}
        onOpenChange={setIsRequisicaoModalOpen}
      >
        <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Visualização da Requisição</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-auto p-4 border rounded-md">
            <Requisicao
              efetivo={dadosParaImpressao.efetivo}
              vehicle={dadosParaImpressao.vehicle}
            />
          </div>
          <DialogFooter className="border-t pt-4 px-6 pb-6 flex gap-2 justify-end">
             <Button 
              variant="outline"
              onClick={() => setIsRequisicaoModalOpen(false)}
              className="bg-white hover:bg-gray-50 border-2 border-gray-300"
            >
              Fechar
            </Button>
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
              <Printer className="mr-2 h-4 w-4" /> Imprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCartaoModalOpen} onOpenChange={setIsCartaoModalOpen}>
        <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Visualização do Cartão</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-auto p-4 border rounded-md">
            <Cartao
              efetivo={dadosParaImpressao.efetivo}
              vehicle={dadosParaImpressao.vehicle}
            />
          </div>
          <DialogFooter className="border-t pt-4 px-6 pb-6 flex gap-2 justify-end">
             <Button 
              variant="outline"
              onClick={() => setIsCartaoModalOpen(false)}
              className="bg-white hover:bg-gray-50 border-2 border-gray-300"
            >
              Fechar
            </Button>
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
              <Printer className="mr-2 h-4 w-4" /> Imprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
