// biome-ignore assist/source/organizeImports: <explanation>
import { useState, useEffect, type FC } from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Ajuste o caminho se necessário
import { api } from '@/services/api';

// 1. (NOVO) Interface para definir a "forma" da resposta da nossa API
interface CountResponse {
  total: number;
}

export const ActiveCardsWidget: FC = () => {
  // 2. (ALTERADO) Adicionamos tipos explícitos aos estados
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCardCount = async () => {
      try {        
        const response = await api.get<CountResponse>(
          '/vehicles/count'
        );
        setCount(response.data.total);

      } catch (err) {
        setError('Falha ao buscar dados.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardCount();
  }, []);

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-gray-500">Carregando...</div>
            <p className="text-sm text-gray-400">Cartões Ativos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-0 bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-red-700">Erro</div>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardContent className="p-4">
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-green-700">{count}</div>
          <p className="text-sm text-green-600">Cartões Ativos</p>
        </div>
      </CardContent>
    </Card>
  );
};