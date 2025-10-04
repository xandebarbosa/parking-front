"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Efetivo } from "@/types"
import { useEffect, useState } from "react"
import { toast } from "sonner";
import TabelaEfetivo from "./components/TabelaEfetivo";
import ModalEdicao from "./components/ModalEdicao";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function UpdateEfetivoPage() {
    const [efetivos, setEfetivos] = useState<Efetivo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEfetivo, setSelectedEfetivo] = useState<Efetivo | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const { token } = useAuth();

    const fetchEfetivo = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            const response = await api.get('/efetivos');
            setEfetivos(response.data);
        } catch (error) {
            toast.error("Não foi possível carregar dados do efetivo.");
        } finally {
            setIsLoading(false);
        }
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        fetchEfetivo();
    },[token]);

    const handleEdit = (efetivo: Efetivo) => {
        setSelectedEfetivo(efetivo);
        setIsEditModalOpen(true);
    }

    const handleDelete = (efetivo: Efetivo) => {
        setSelectedEfetivo(efetivo);
        setIsDeleteAlertOpen(true);
    }

    const confirmDelete = async () => {
        if (!selectedEfetivo) return;

        const promise = api.delete(`/efetivos/${selectedEfetivo.id}`);
        toast.promise(promise, {
            loading: "Excluindo efetivo...",
            success: () => {
                // Atualização
                setEfetivos(prevEfetivos => prevEfetivos.filter(c => c.id !== selectedEfetivo.id ));
                setIsDeleteAlertOpen(false);
                return "Efetivo excluído com sucesso!";
            },
            error: "Erro ao excluir o efetivo.",
        });
    };

  return (
    <div className="container mx-auto py-10">
        <Card className="bg-gradient-to-r from-amber-300 to-amber-500 mb-4 shadow-lg border border-[#14213d]">
            <CardHeader>
                <CardTitle className="text-2xl">Atualizar Efetivo</CardTitle>
                <CardDescription>Edite ou exclua os militares existentes na tabela.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <p>Carregando...</p> :
                    <TabelaEfetivo efetivos={efetivos} onEdit={handleEdit} onDelete={handleDelete} />
                } 
            </CardContent>
        </Card>

        <ModalEdicao
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            efetivo={selectedEfetivo}
            onUpdateSuccess={()=> {
                setIsEditModalOpen(false);
                fetchEfetivo();
            }}
        />

        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza da exclusão?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pose ser desfeita. Isso excluirá permanentemente o militar de RE <strong>{selectedEfetivo?.re}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>Confirmar Exclusão</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}
