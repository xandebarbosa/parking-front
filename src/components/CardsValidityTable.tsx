import { CartaoEstacionamento, type TabelaCartoesValidadeProps } from "@/types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { cn } from "@/lib/utils";


export function CardsValidityTable({ cartoes = []}: TabelaCartoesValidadeProps) {

    // TypeScript infere que 'a' e 'b' são do tipo 'CartaoEstacionamento'
  const sortedCartoes = [...cartoes].sort((a, b) => 
    new Date(b.validadeCartao).getTime() - new Date(a.validadeCartao).getTime()
  );

  // Tipamos o parâmetro da função para mais segurança
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      timeZone: "UTC",
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden backdrop-blur-sm">
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Cartões de Estacionamento</h3>
        <p className="text-sm text-gray-600 mt-1">Gerenciamento e controle de cartões ativos</p>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>{sortedCartoes.length} registros</span>
      </div>
    </div>
  </div>

  <Table>
    <TableHeader>
      <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150 border-b border-slate-200 transition-all duration-200">
        <TableHead className="w-[140px] text-slate-700 font-semibold text-sm uppercase tracking-wide py-4 px-6">
          <div className="flex items-center space-x-2">
            {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
            </svg>
            <span>Nº Cartão</span>
          </div>
        </TableHead>
        <TableHead className="text-slate-700 font-semibold text-sm uppercase tracking-wide py-4 px-6">
          <div className="flex items-center space-x-2">
            {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Militar</span>
          </div>
        </TableHead>
        <TableHead className="text-slate-700 font-semibold text-sm uppercase tracking-wide py-4 px-6">
          <div className="flex items-center space-x-2">
            {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Placa</span>
          </div>
        </TableHead>
        <TableHead className="text-slate-700 font-semibold text-sm uppercase tracking-wide py-4 px-6">
          <div className="flex items-center space-x-2">
            {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Modelo</span>
          </div>
        </TableHead>
        <TableHead className="text-center font-semibold text-sm uppercase tracking-wide py-4 px-6">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 110 2h-1v9a2 2 0 01-2 2H8a2 2 0 01-2-2V9H5a1 1 0 110-2h3z" />
            </svg>
            <span>Validade</span>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {sortedCartoes.length > 0 ? (
        sortedCartoes.map((cartao, index) => (
          <TableRow 
            key={cartao.id} 
            className={cn(
              "border-slate-100 hover:bg-slate-50/50 transition-all duration-200 group",
              {"border-b": index < sortedCartoes.length - 1}
            )}
          >
            <TableCell className="font-bold text-slate-900 py-4 px-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>
                <span className="text-base">{cartao.card_number}</span>
              </div>
            </TableCell>
            <TableCell className="text-slate-700 font-medium py-4 px-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span>{cartao.efetivo?.name ?? 'Não informado'}</span>
              </div>
            </TableCell>
            <TableCell className="text-slate-700 font-medium py-4 px-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {cartao.placa}
              </div>
            </TableCell>
            <TableCell className="text-slate-700 py-4 px-6">
              <span className="text-sm font-medium">{cartao.modelo}</span>
            </TableCell>
            <TableCell className="text-center py-4 px-6">
              <div className="inline-flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="font-bold text-base text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  {formatDate(cartao.validadeCartao)}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={5} className="h-32 text-center py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-slate-700 font-medium text-base">Nenhum cartão encontrado</p>
                <p className="text-slate-500 text-sm mt-1">Os cartões cadastrados aparecerão aqui</p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>

  {/* Footer com informações adicionais */}
  {sortedCartoes.length > 0 && (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Ativos: {sortedCartoes.filter(c => new Date(c.validadeCartao) > new Date()).length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span>Vencidos: {sortedCartoes.filter(c => new Date(c.validadeCartao) <= new Date()).length}</span>
          </div>
        </div>
        <div className="text-slate-500">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </div>
      </div>
    </div>
  )}
</div>
  )
}
