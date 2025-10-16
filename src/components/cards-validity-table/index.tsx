import type { TabelaCartoesValidadeProps } from "@/types";
import { useCardTableLogic } from "./useCardTableLogic";
import { ITEMS_PER_PAGE } from "./constants";
import { Pagination } from "./Pagination";
import { CardTableFooter } from "./CardTableFooter";
import { CardTableHeader } from "./CardTableHeader";
import { TableContent } from "./TableContent";


export function CardsValidityTable({
  cartoes = [],
}: TabelaCartoesValidadeProps) {

  const {
    currentPage,
    getCardStatus,
    sortedCards,
    statusCounts,
    handlePageChange,
    formatDate,
  } = useCardTableLogic(cartoes)  

  // A lógica de paginação pode ficar aqui ou dentro do hook
  const totalPages = Math.ceil(sortedCards.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCards = sortedCards.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden backdrop-blur-sm">
      <CardTableHeader totalCards={sortedCards.length} />
      <TableContent
        cards={paginatedCards}
        getCardStatus={getCardStatus}
        formatDate={formatDate}
      />
      {sortedCards.length > 0 && (
        <>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={sortedCards.length}
            startIndex={startIndex}
            endIndex={Math.min(endIndex, sortedCards.length)}
          />
          <CardTableFooter statusCounts={statusCounts} />
        </>
      )}
    </div>
  );
}
