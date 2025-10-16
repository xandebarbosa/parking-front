export interface StatusConfig {
  bgColor: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
  label: string;
}

export type CardStatus = "expired" | "expiring" | "valid";