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
import { AlertCircle, Award, BadgeIcon, Calendar, Car, CheckCircle2, Clock, CreditCard, FileText, Hash, IdCard, MapPin, Palette, Phone, Printer, Settings, User, XCircle } from "lucide-react";
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

  const getValidityStatus = () => {
    if (isExpired(cartao.validadeCartao)) {
      return { 
        color: 'text-red-700 bg-red-50 border-red-300', 
        label: 'Vencido', 
        icon: XCircle,
        iconColor: 'text-red-600'
      };
    }
    if (isExpiringSoon(cartao.validadeCartao)) {
      return { 
        color: 'text-amber-700 bg-amber-50 border-amber-300', 
        label: 'Vence em breve', 
        icon: AlertCircle,
        iconColor: 'text-amber-600'
      };
    }
    return { 
      color: 'text-blue-700 bg-blue-50 border-blue-300', 
      label: 'Válido', 
      icon: CheckCircle2,
      iconColor: 'text-blue-600'
    };
  };

  const validityStatus = getValidityStatus();
  const StatusIcon = validityStatus.icon;

  // Extrai os dados para facilitar o uso nos componentes de impressao
  const dadosImpressao = {
    efetivo: cartao.efetivo,
    vehicle: cartao
  }

  // const getValidityStatus = () => {
  //   if (isExpired(cartao.validadeCartao)) {
  //     return { color: 'text-red-600 bg-red-50 border-red-200', label: 'Vencido', icon: '🔴' };
  //   }
  //   if (isExpiringSoon(cartao.validadeCartao)) {
  //     return { color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Vence em breve', icon: '🟡' };
  //   }
  //   return { color: 'text-green-600 bg-green-50 border-green-200', label: 'Válido', icon: '🟢' };
  // };

  // const validityStatus = getValidityStatus();

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-amber-50/30 min-h-screen">
      {/* Card Principal */}
      <Card className="shadow-lg border-0 bg-white overflow-hidden py-0">
        <CardHeader className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white pb-0 pt-0 relative overflow-hidden">
          {/* Padrão decorativo de fundo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-32 -translate-x-32"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2 mt-6 mb-2.5">
            {/* Informações principais */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                <CreditCard className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold tracking-tight mb-2 drop-shadow-sm">
                  Cartão N° {cartao.card_number}
                </CardTitle>
                <CardDescription className="text-[#14213d] text-lg font-bold flex items-center gap-2">
                   <div className="p-1.5 bg-white/20 rounded-md">
                      <Car className="h-5 w-5" />
                    </div>
                  Placa: {cartao.placa}
                </CardDescription>
                <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                      {cartao.modelo}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                      {cartao.color}
                    </span>
                  </div>
              </div>
            </div>

            {/* Status de validade - destacado */}
            <div className="bg-[#14213d] backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 border-yellow-300 min-w-[200px]">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-yellow-300" />
                  <p className="text-sm font-bold text-yellow-300 uppercase tracking-wide">
                    Validade
                  </p>
                </div>
                <p className="text-xl font-bold text-center text-white mb-3">
                  {formatDate(cartao.validadeCartao)}
                </p>
                <div className={`flex items-center gap-2 px-8 py-1 rounded-lg border-2 ${validityStatus.color}`}>
                  <StatusIcon className={`h-5 w-5 ${validityStatus.iconColor}`} />
                  <span className="font-bold text-sm">
                    {validityStatus.label}
                  </span>
                </div>
              </div>
          </div>
          </div>
          
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* Dados do Militar */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-amber-200">
              <div className="p-2.5 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-md">
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Dados do Militar</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { icon: Award, label: "RE", value: cartao?.efetivo?.re },
                { icon: User, label: "Nome", value: cartao?.efetivo?.name },
                { icon: Award, label: "Posto/Grad", value: cartao?.efetivo?.postoGrad },
                { icon: MapPin, label: "OPM", value: cartao?.efetivo?.opm },
                { icon: Settings, label: "Função", value: cartao?.efetivo?.funcao },
                { icon: MapPin, label: "Seção", value: cartao?.efetivo?.secao },
                { icon: Phone, label: "Ramal", value: cartao?.efetivo?.ramal },
                { icon: CreditCard, label: "RG", value: cartao?.efetivo?.rg },
                { icon: Hash, label: "CPF", value: cartao?.efetivo?.cpf },
                { icon: FileText, label: "Registro", value: cartao?.efetivo?.pgu },
                { icon: Calendar, label: "Validade CNH", value: formatDate(cartao?.efetivo?.valCnh) }
              ].filter(item => item.value).map((item, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <div key={index} className="group flex items-center gap-2 p-2 bg-gradient-to-br from-white to-amber-50/30 rounded-xl border-2 border-gray-100 hover:border-amber-300 hover:shadow-lg transition-all duration-200">
                  <div className="p-1.5 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                    <item.icon className="h-5 w-5 text-amber-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
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
            <div className="flex items-center gap-2 pb-3 border-b-2 border-green-200">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md">
                <Car className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Dados do Veículo</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { icon: Car, label: "Modelo", value: cartao.modelo },
                { icon: Palette, label: "Cor", value: cartao.color },
                { icon: Calendar, label: "Ano", value: cartao.ano },
                { icon: MapPin, label: "Município", value: cartao.municipio },
                { icon: MapPin, label: "UF", value: cartao.uf },
                { icon: Hash, label: "Chassi", value: cartao.chassi },
                { icon: Hash, label: "Renavan", value: cartao.renavan },
                { icon: Award, label: "RE Fiscalizador", value: cartao.reFiscalizador },
                { icon: MapPin, label: "Local", value: cartao.local },
                { icon: Calendar, label: "Dias", value: cartao.dias }
              ].filter(item => item.value).map((item, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <div key={index} className="group flex items-center gap-2 p-2 bg-gradient-to-br from-white to-green-50/30 rounded-xl border-2 border-gray-100 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                  <div className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <item.icon className="h-5 w-5 text-green-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">
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
              <div className="flex items-center gap-2 pb-3 border-b-2 border-purple-200">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg shadow-md">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Períodos de Acesso</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {cartao.periodo1Entrada && (
                  <div className="p-2 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-lg border-2 border-blue-300 shadow-lg">
                    <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-sm">
                      <Clock className="h-5 w-5 text-white" />
                      Período 1
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-white/70 backdrop-blur-sm rounded-lg">
                        <span className="text-sm font-bold text-blue-700 uppercase">Entrada:</span>
                        <span className="font-bold text-lg text-blue-900">{cartao.periodo1Entrada}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/70 backdrop-blur-sm rounded-lg">
                        <span className="text-sm font-bold text-blue-700 uppercase">Saída:</span>
                        <span className="font-bold text-lg text-blue-900">{cartao.periodo1Saida}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {cartao.periodo2Entrada && (
                  <div className="p-2 bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 rounded-lg border-2 border-purple-300 shadow-lg">
                    <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2 text-sm">
                      <Clock className="h-5 w-5 text-white" />
                      Período 2
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-white/70 backdrop-blur-sm rounded-lg">
                        <span className="text-sm font-bold text-purple-700 uppercase">Entrada:</span>
                        <span className="font-bold text-lg text-purple-900">{cartao.periodo2Entrada}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/70 backdrop-blur-sm rounded-lg">
                        <span className="text-sm font-bold text-purple-700 uppercase">Saída:</span>
                        <span className="font-bold text-lg text-purple-900">{cartao.periodo2Saida}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-gradient-to-r from-gray-50 to-amber-50/50 border-t-2 border-amber-100 px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={() => setIsRequisicaoModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-white hover:bg-green-50 border-2 border-gray-300 hover:border-green-400 text-gray-700 hover:text-green-700 transition-all duration-200 hover:shadow-md"
            >
              <FileText className="h-5 w-5" />
              Visualizar Requisição
            </Button>
            <Button 
              onClick={() => setIsCartaoModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold transition-all duration-200 hover:shadow-lg border-0"
            >
              <CreditCard className="h-5 w-5" />
              Visualizar Cartão
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Modal do Cartão */}
      <Dialog open={isCartaoModalOpen} onOpenChange={setIsCartaoModalOpen}>
        <DialogContent className="bg-white rounded-xl sm:max-w-[900px] h-[90vh] flex flex-col overflow-auto">
          <DialogHeader className="border-b pb-4 px-6 pt-6">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="h-5 w-5 text-amber-600" />
              Visualização do Cartão de Estacionamento
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <Cartao efetivo={dadosImpressao.efetivo} vehicle={dadosImpressao.vehicle} />
            </div>            
          </div>
          <DialogFooter className="border-t pt-4 px-6 pb-6 flex gap-2 justify-end">
            <Button 
              variant="outline"
              onClick={() => setIsCartaoModalOpen(false)}
              className="bg-white hover:bg-gray-50 border-2 border-gray-300"
            >
              Fechar
            </Button>
            <Button 
              onClick={() => handlePrint(<Cartao {...dadosImpressao}/>)}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white border-0"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir Cartão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal da Requisição */}
      <Dialog open={isRequisicaoModalOpen} onOpenChange={setIsRequisicaoModalOpen}>
        <DialogContent className="bg-white rounded-xl sm:max-w-[900px] h-[90vh] flex flex-col overflow-auto">
          <DialogHeader className="border-b pb-4 px-6 pt-6">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-green-600" />
              Visualização da Requisição de Estacionamento
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <Requisicao efetivo={dadosImpressao.efetivo} vehicle={dadosImpressao.vehicle} />
          </div>
          </div>
          
          <DialogFooter className="border-t pt-4 px-6 pb-6 flex gap-2 justify-end">
            <Button 
              variant="outline"
              onClick={() => setIsRequisicaoModalOpen(false)}
              className="bg-white hover:bg-gray-50 border-2 border-gray-300"
            >
              Fechar
            </Button>
            <Button 
              onClick={() => handlePrint(<Requisicao {...dadosImpressao}/>)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
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
