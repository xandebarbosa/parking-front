import { api } from "@/services/api";
import type { CartaoEstacionamento } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Calendar, Car, Clock, FileText, Loader2, MapPin, Settings, Shield, User } from "lucide-react";
import { Badge } from "./ui/badge";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const editSchema = z.object({  
  placa: z.string(),
  modelo: z.string(),
  color: z.string(),
  ano: z.string(),
  municipio: z.string(),
  uf: z.string(),
  chassi: z.string(),
  renavan: z.string(),
  reFiscalizador: z.string(),
  periodo1Entrada: z.string(),
  periodo1Saida: z.string(),
  periodo2Entrada: z.string(),
  periodo2Saida: z.string(),
  local: z.string(),
  dias: z.coerce.number({ required_error: "Deve ser um número" }),
  validadeCartao: z.string().min(1, "Validade do cartão é obrigatória"),
});

type EditFormData = z.infer<typeof editSchema>;

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  cartao: CartaoEstacionamento | null;
  onUpdateSuccess: () => void;
};

export function ModalEdicao({
  isOpen,
  onOpenChange,
  cartao,
  onUpdateSuccess,
}: Props) {
  const form = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      placa: "",
      modelo: "",
      color: "",
      ano: "",
      municipio: "",
      uf: "",
      chassi: "",
      renavan: "",
      reFiscalizador: "",
      periodo1Entrada: "",
      periodo1Saida: "",
      periodo2Entrada: "",
      periodo2Saida: "",
      local: "",
      dias: 0,
      validadeCartao: "",
    },
  });

  // Efeito para popular o formulário quando um cartão é selecionado
  useEffect(() => {
    if (cartao) {
      //Formata a data para o formato YYYY-MM-DD que o input type="date" espera
      const formatteDate = cartao.validadeCartao
        ? new Date(cartao.validadeCartao).toISOString().split("T")[0]
        : "";
      form.reset({        
        placa: cartao.placa,
        modelo: cartao.modelo,
        color: cartao.color,
        ano: cartao.ano,
        municipio: cartao.municipio,
        uf: cartao.uf,
        chassi: cartao.chassi,
        renavan: cartao.renavan,
        reFiscalizador: cartao.reFiscalizador,
        periodo1Entrada: cartao.periodo1Entrada,
        periodo1Saida: cartao.periodo1Saida,
        periodo2Entrada: cartao.periodo2Entrada,
        periodo2Saida: cartao.periodo2Saida,
        local: cartao.local,
        dias: cartao.dias,
        validadeCartao: formatteDate,
      });
    }
  }, [cartao, form]);

  async function onSubmit(values: EditFormData) {
    if (!cartao) return;

    const promise = api.put(`/vehicles/${cartao.id}`, values);

    toast.promise(promise, {
      loading: "Atualizando cartão...",
      success: () => {
        onUpdateSuccess(); // Chama a função de sucesso para fechar o modal e recarregar a lista
        return "Cartão atualizado com sucesso!";
      },
      error: "Erro ao atualizar o cartão.",
    });
  }

  const formatPlaca = (placa?: string) => {
    if (!placa) return "N/A";
    return placa.toUpperCase().replace(/(\w{3})(\w{4})/, '$1-$2');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="pb-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 -mx-6 -mt-6 px-6 pt-6">
          <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-emerald-600" />
            </div>
            Editar Cartão de Estacionamento
          </DialogTitle>
          
          {cartao && (
            <div className="mt-4 p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-emerald-200">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Militar Responsável</p>
                    <p className="font-semibold text-slate-800">{cartao.efetivo?.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">RE</p>
                    <Badge variant="outline" className="font-mono">
                      {cartao.efetivo?.re}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Car className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Cartão</p>
                    <Badge variant="default" className="bg-emerald-100 text-emerald-800">
                      #{cartao.card_number}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 py-6 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Seção: Dados do Veículo */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                  <Car className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Dados do Veículo</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <FormField
                    name="placa"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">
                          Placa <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="ABC-1234"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200 font-mono"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="modelo"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Modelo</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ex: Honda Civic"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="color"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Cor</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ex: Branco"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="ano"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Ano</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="2020"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção: Localização */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                  <MapPin className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Localização</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField
                    name="municipio"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-sm font-medium text-slate-700">Município</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ex: São Paulo"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="uf"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">UF</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="SP"
                            maxLength={2}
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200 uppercase"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="local"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Local de Estacionamento</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ex: Pátio A"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção: Documentação */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                  <FileText className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Documentação</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    name="chassi"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Chassi</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Digite o chassi"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200 font-mono text-xs"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="renavan"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Renavan</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Digite o renavan"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200 font-mono"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="reFiscalizador"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          RE Fiscalizador
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Digite o RE"
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção: Períodos de Acesso */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                  <Clock className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Períodos de Acesso</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Período 1 */}
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Período 1
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        name="periodo1Entrada"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">Entrada</FormLabel>
                            <FormControl>
                              <Input 
                                type="time"
                                {...field} 
                                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="periodo1Saida"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">Saída</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                {...field} 
                                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Período 2 */}
                  <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Período 2
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        name="periodo2Entrada"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">Entrada</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                {...field} 
                                className="h-11 border-slate-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="periodo2Saida"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">Saída</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                {...field} 
                                className="h-11 border-slate-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: Configurações */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Configurações</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="dias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Dias de Validade</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 30"
                            {...field}
                            value={field.value === undefined || isNaN(field.value) ? "" : field.value}
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="validadeCartao"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-sm font-medium text-slate-700">
                          Data de Validade do Cartão <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="pt-6 border-t border-slate-200 bg-slate-50 -mx-6 -mb-6 px-6 pb-6">
          <div className="flex gap-3 w-full justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-[100px] h-11 border-slate-300 hover:bg-slate-100 transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
              className="min-w-[140px] h-11 bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 disabled:opacity-60"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
