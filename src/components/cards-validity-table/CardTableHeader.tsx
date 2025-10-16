import { CardIcon } from "./CardIcon";

interface CardTableHeaderProps {
  totalCards: number;
}

export function CardTableHeader({ totalCards }: CardTableHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Cartões de Estacionamento
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Gerenciamento e controle de cartões ativos
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <CardIcon />
          <span>{totalCards} registros</span>
        </div>
      </div>
    </div>
  );
}