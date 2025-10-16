import type { CardStatus, StatusConfig } from "./types";

export const ITEMS_PER_PAGE = 10;
export const DAYS_TO_EXPIRE = 30;

export const STATUS_CONFIGS: Record<CardStatus, StatusConfig> = {
  expired: {
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    borderColor: "border-red-500",
    dotColor: "bg-red-400",
    label: "Vencidos",
  },
  expiring: {
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    borderColor: "border-orange-500",
    dotColor: "bg-orange-400",
    label: "A vencer",
  },
  valid: {
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    borderColor: "border-green-500",
    dotColor: "bg-green-400",
    label: "Válidos",
  },
};

export const STATUS_ORDER: Record<CardStatus, number> = {
  expired: 0,
  expiring: 1,
  valid: 2,
};