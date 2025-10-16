import { useState, useMemo } from "react";
import { DAYS_TO_EXPIRE, STATUS_ORDER } from "./constants";
import type { CardStatus } from "./types";
// Supondo que você tenha um tipo para o objeto 'cartao'
import type { CartaoEstacionamento } from "@/types"; 

export function useCardTableLogic(cartoes: CartaoEstacionamento[] = []) {
  const [currentPage, setCurrentPage] = useState(1);

 const getCardStatus = (dateString?: string): CardStatus => {
    if (!dateString) return "expired";

    const cardDate = new Date(dateString);
    const today = new Date();
    const diffTime = cardDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "expired";
    if (diffDays <= DAYS_TO_EXPIRE) return "expiring";
    return "valid";
  };

  const sortedCards = [...cartoes].sort((a, b) => {
    const statusA = getCardStatus(a.validadeCartao);
    const statusB = getCardStatus(b.validadeCartao);

    if (statusA !== statusB) {
      return STATUS_ORDER[statusA] - STATUS_ORDER[statusB];
    }

    return (
      new Date(a.validadeCartao).getTime() -
      new Date(b.validadeCartao).getTime()
    );
  });

  const getStatusCounts = () => {
    return {
      valid: sortedCards.filter(
        (c) => getCardStatus(c.validadeCartao) === "valid",
      ).length,
      expiring: sortedCards.filter(
        (c) => getCardStatus(c.validadeCartao) === "expiring",
      ).length,
      expired: sortedCards.filter(
        (c) => getCardStatus(c.validadeCartao) === "expired",
      ).length,
    };
  };

  const statusCounts = getStatusCounts();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Tipamos o parâmetro da função para mais segurança
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  return {
    currentPage,
    getCardStatus,
    sortedCards,
    statusCounts,
    handlePageChange,
    formatDate,
    setCurrentPage, // exportar o setter se necessário
  };
}