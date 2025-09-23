import Cartao from "@/components/print/Cartao";
import Requisicao from "@/components/print/Requisicao";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePrint } from "@/hooks/usePrint";
import type { CartaoEstacionamento } from "@/types";
import { BadgeIcon, Calendar, Car, Clock, CreditCard, FileText, Hash, IdCard, MapPin, Palette, Phone, Printer, Settings, User } from "lucide-react";
import { useState } from "react";

type Props = {
  cartao: CartaoEstacionamento;
};

export default function CardResultado({ cartao }: Props) {

  // Estados para controlar a visibilidade de cada modal
  const [isCartaoModalOpen, setIsCartaoModalOpen]  = useState(false);
  const [isRequisicaoModalOpen, setIsRequisicaoModalOpen] = useState(false);

  const { handlePrint } = usePrint();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  // Verifica se a validade está próxima do vencimento (30 dias)
  const isExpiringSoon = (dateString?: string) => {
    if (!dateString) return false;
    const validadeDate = new Date(dateString);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return validadeDate <= thirtyDaysFromNow;
  };

  const isExpired = (dateString?: string) => {
    if (!dateString) return false;
    const validadeDate = new Date(dateString);
    const today = new Date();
    return validadeDate < today;
  };

  // Extrai os dados para facilitar o uso nos componentes de impressao
  const dadosImpressao = {
    efetivo: cartao.efetivo,
    vehicle: cartao
  }

  const getValidityStatus = () => {
    if (isExpired(cartao.validadeCartao)) {
      return { color: 'text-red-600 bg-red-50 border-red-200', label: 'Vencido', icon: '🔴' };
    }
    if (isExpiringSoon(cartao.validadeCartao)) {
      return { color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Vence em breve', icon: '🟡' };
    }
    return { color: 'text-green-600 bg-green-50 border-green-200', label: 'Válido', icon: '🟢' };
  };

  const validityStatus = getValidityStatus();

  return (
    <div className="space-y-6">
      {/* Card Principal */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Cartão N° {cartao.card_number}
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg font-medium flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Placa: {cartao.placa}
                </CardDescription>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${validityStatus.color} bg-white`}>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <div className="text-center">
                  <p className="text-xs font-medium opacity-80">Validade</p>
                  <p className="text-sm font-bold">
                    {formatDate(cartao.validadeCartao)}
                  </p>
                  <p className="text-xs mt-1 flex items-center gap-1">
                    <span>{validityStatus.icon}</span>
                    {validityStatus.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* Dados do Militar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Dados do Militar</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: BadgeIcon, label: "RE", value: cartao?.efetivo?.re },
                { icon: User, label: "Nome", value: cartao?.efetivo?.name },
                { icon: BadgeIcon, label: "Posto/Grad", value: cartao?.efetivo?.postoGrad },
                { icon: MapPin, label: "OPM", value: cartao?.efetivo?.opm },
                { icon: Settings, label: "Função", value: cartao?.efetivo?.funcao },
                { icon: MapPin, label: "Seção", value: cartao?.efetivo?.secao },
                { icon: Phone, label: "Ramal", value: cartao?.efetivo?.ramal },
                { icon: IdCard, label: "RG", value: cartao?.efetivo?.rg },
                { icon: Hash, label: "CPF", value: cartao?.efetivo?.cpf },
                { icon: FileText, label: "Registro", value: cartao?.efetivo?.pgu },
                { icon: Calendar, label: "Validade CNH", value: formatDate(cartao?.efetivo?.valCnh) }
              ].filter(item => item.value).map((item, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow">
                  <div className="p-1.5 bg-white rounded-md">
                    <item.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dados do Veículo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <div className="p-2 bg-green-100 rounded-lg">
                <Car className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Dados do Veículo</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Car, label: "Modelo", value: cartao.modelo },
                { icon: Palette, label: "Cor", value: cartao.color },
                { icon: Calendar, label: "Ano", value: cartao.ano },
                { icon: MapPin, label: "Município", value: cartao.municipio },
                { icon: MapPin, label: "UF", value: cartao.uf },
                { icon: Hash, label: "Chassi", value: cartao.chassi },
                { icon: Hash, label: "Renavan", value: cartao.renavan },
                { icon: BadgeIcon, label: "RE Fiscalizador", value: cartao.reFiscalizador },
                { icon: MapPin, label: "Local", value: cartao.local },
                { icon: Calendar, label: "Dias", value: cartao.dias }
              ].filter(item => item.value).map((item, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow">
                  <div className="p-1.5 bg-white rounded-md">
                    <item.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Períodos de Acesso */}
          {(cartao.periodo1Entrada || cartao.periodo2Entrada) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Períodos de Acesso</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cartao.periodo1Entrada && (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Período 1
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700">Entrada:</span>
                        <span className="font-bold text-blue-900">{cartao.periodo1Entrada}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700">Saída:</span>
                        <span className="font-bold text-blue-900">{cartao.periodo1Saida}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {cartao.periodo2Entrada && (
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Período 2
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-purple-700">Entrada:</span>
                        <span className="font-bold text-purple-900">{cartao.periodo2Entrada}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-purple-700">Saída:</span>
                        <span className="font-bold text-purple-900">{cartao.periodo2Saida}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-gray-50 border-t px-6 py-4 rounded-b-lg">
          <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={() => setIsRequisicaoModalOpen(true)}
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Visualizar Requisição
            </Button>
            <Button 
              onClick={() => setIsCartaoModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              Visualizar Cartão
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Modal do Cartão */}
      <Dialog open={isCartaoModalOpen} onOpenChange={setIsCartaoModalOpen}>
        <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Visualização do Cartão de Estacionamento
            </DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-auto p-4 bg-gray-50 rounded-md border border-gray-200">
            <Cartao efetivo={dadosImpressao.efetivo} vehicle={dadosImpressao.vehicle} />
          </div>
          <DialogFooter className="border-t pt-4">
            <Button 
              variant="outline"
              onClick={() => setIsCartaoModalOpen(false)}
            >
              Fechar
            </Button>
            <Button 
              onClick={() => handlePrint(<Cartao {...dadosImpressao}/>)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir Cartão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal da Requisição */}
      <Dialog open={isRequisicaoModalOpen} onOpenChange={setIsRequisicaoModalOpen}>
        <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-green-600" />
              Visualização da Requisição de Estacionamento
            </DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-auto p-4 bg-gray-50 rounded-md border border-gray-200">
            <Requisicao efetivo={dadosImpressao.efetivo} vehicle={dadosImpressao.vehicle} />
          </div>
          <DialogFooter className="border-t pt-4">
            <Button 
              variant="outline"
              onClick={() => setIsRequisicaoModalOpen(false)}
            >
              Fechar
            </Button>
            <Button 
              onClick={() => handlePrint(<Requisicao {...dadosImpressao}/>)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir Requisição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    
  );
}
