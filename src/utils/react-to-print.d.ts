// react-to-print.d.ts
declare module "react-to-print" {
  // biome-ignore lint/correctness/noUnusedImports: <explanation>
  import { MutableRefObject } from "react";

  export interface UseReactToPrintOptions {
    content: () => HTMLElement | null;
    documentTitle?: string;
    removeAfterPrint?: boolean;
    // você pode adicionar outras opções que usar
  }

  export function useReactToPrint(options: UseReactToPrintOptions): () => void;
}
