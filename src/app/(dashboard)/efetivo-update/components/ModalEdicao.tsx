import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";
import type { Efetivo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Loader2, Phone, Shield, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const editSchema = z.object({
  re: z.string(),
  name: z.string(),
  postoGrad: z.string(),
  rg: z.string(),
  cpf: z.string(),
  opm: z.string(),
  funcao: z.string(),
  secao: z.string(),
  ramal: z.string(),
  pgu: z.string(),
  valCnh: z.string(),
});

type EditFormData = z.infer<typeof editSchema>;

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  efetivo: Efetivo | null;
  onUpdateSuccess: () => void;
};

export default function ModalEdicao({
  isOpen,
  onOpenChange,
  efetivo,
  onUpdateSuccess,
}: Props) {
  const form = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      re: "",
      name: "",
      postoGrad: "",
      rg: "",
      cpf: "",
      opm: "",
      funcao: "",
      secao: "",
      ramal: "",
      pgu: "",
      valCnh: "",
    },
  });

  //Hook para popular o formulário quando um militar é selecionado
  useEffect(() => {
    if (efetivo) {
      const formatteDate = efetivo.valCnh
        ? new Date(efetivo.valCnh).toISOString().split("T")[0]
        : "";
      form.reset({
        re: efetivo.re,
        name: efetivo.name,
        postoGrad: efetivo.postoGrad,
        rg: efetivo.rg,
        cpf: efetivo.cpf,
        opm: efetivo.opm,
        funcao: efetivo.funcao,
        secao: efetivo.secao,
        ramal: efetivo.ramal,
        pgu: efetivo.pgu,
        valCnh: formatteDate,
      });
    }
  }, [efetivo, form]);

  async function onSubmit(values: EditFormData) {
    if (!efetivo) return;

    const promise = api.put(`/efetivos/${efetivo.id}`, values);

    toast.promise(promise, {
      loading: "Atualizando efetivo...",
      success: () => {
        onUpdateSuccess();
        return "Efetivo atualizado com sucesso!";
      },
      error: "Erro ao atulizar o Efetivo.",
    });
  }

  return (
     <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 -mx-6 -mt-6 px-6 pt-6">
          <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            Editar Dados do Efetivo
          </DialogTitle>
          {efetivo && (
            <p className="text-sm text-slate-600 mt-2 ml-13">
              Editando informações de <span className="font-semibold">{efetivo.name}</span>
            </p>
          )}
        </DialogHeader>

        <div className="py-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Seção: Dados Pessoais */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Dados Pessoais</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <FormField
                    name="re"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">
                          RE <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Digite o RE"
                            className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2 lg:col-span-2">
                        <FormLabel className="text-sm font-medium text-slate-700">
                          Nome Completo <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Digite o nome completo"
                            className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="postoGrad"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">
                          Posto/Graduação
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ex: Cap, Ten, Sgt"
                            className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="rg"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">RG</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Digite o RG"
                            className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="cpf"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">CPF</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="000.000.000-00"
                            className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="pgu"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">PGU</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Digite o PGU"
                            className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção: Dados Organizacionais */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Dados Organizacionais</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <FormField
                    name="opm"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">OPM</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Digite a OPM"
                            className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="funcao"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Função</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Digite a função"
                            className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="secao"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Seção</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Digite a seção"
                            className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="ramal"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          Ramal
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ex: 1234"
                            className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção: Outros Dados */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Outros Dados</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    name="valCnh"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">
                          Validade da CNH
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
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
              className="min-w-[140px] h-11 bg-blue-600 hover:bg-blue-700 transition-all duration-200 disabled:opacity-60"
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
