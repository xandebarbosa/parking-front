import { STATUS_CONFIGS } from "./constants";
import { CardStatus } from "./types";

interface CardTableFooterProps {
  statusCounts: {
    valid: number;
    expiring: number;
    expired: number;
  };
}

export function CardTableFooter({ statusCounts }: CardTableFooterProps) {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center space-x-4">
          {(["valid", "expiring", "expired"] as CardStatus[]).map((status) => {
            const config = STATUS_CONFIGS[status];
            return (
              <div key={status} className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${config.dotColor} rounded-full`} />
                <span>
                  {config.label}: {statusCounts[status]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-slate-500">
          Última atualização: {new Date().toLocaleString("pt-BR")}
        </div>
      </div>
    </div>
  );
}