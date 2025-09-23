import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";

export function usePrint() {
    const handlePrint = (printTableComponent: ReactElement) => {
        // 1. Cria um div temporário no corpo do documento
        const printMountElement = document.createElement("div");
        printMountElement.classList.add("print-mount");
        document.body.appendChild(printMountElement);

        // 2. Usa a nova API createRoot para renderizar o componente
        const root = createRoot(printMountElement);
        root.render(printTableComponent);

        // 3. Adiciona um pequeno delay para garantir que tudo foi renderizado
        setTimeout(() => {
            window.print(); // 4. Chama a impressão do navegador

            // 5. Limpa e desmonta o componente React e o elemento do DOM
            root.unmount();
            document.body.removeChild(printMountElement);
        }, 250);
    };

    return { handlePrint };
  
}
