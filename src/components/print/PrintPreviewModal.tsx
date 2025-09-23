"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// 1. Criamos um subcomponente para o conteúdo do modal
const ModalContent = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  // A ref e o hook de impressão agora vivem dentro deste componente,
  // que só é renderizado quando o modal está aberto.
  const contentToPrintRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentToPrintRef.current,
    documentTitle: title,
  });

  return (
    <DialogContent
      ref={contentToPrintRef}
      className="sm:max-w-[850px] h-[90vh] flex flex-col"
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      {/* A ref é aplicada aqui */}
      <div
        ref={contentToPrintRef}
        className="flex-grow overflow-auto p-4 border rounded-md"
      >
        {children}
      </div>
      <DialogFooter className="mt-4">
        <Button onClick={() => handlePrint}>Imprimir</Button>
        <Button onClick={handlePrint}> Impriir sem funcao</Button>
      </DialogFooter>
    </DialogContent>
  );
};

interface PrintPreviewModalProps {
  triggerButton: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

// 2. O componente principal agora apenas controla a visibilidade do modal
export function PrintPreviewModal({
  triggerButton,
  title,
  children,
}: PrintPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      {/* O conteúdo só é renderizado quando isOpen for true */}
      {isOpen && <ModalContent title={title}>{children}</ModalContent>}
    </Dialog>
  );
}
