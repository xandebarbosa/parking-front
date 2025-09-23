import React from "react";

export default function PrintContent({ contentRef }: any) {
  return (
    <div ref={contentRef}>
      <p>
        A expressão Lorem ipsum em design gráfico e editoração é um texto padrão
        em latim utilizado na produção gráfica para preencher os espaços de
        texto em publicações
      </p>
    </div>
  );
}
