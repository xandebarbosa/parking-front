import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ListagemCartoesPage from "./listagem/page";
//bg-gradient-to-r from-yellow-300 to-yellow-600
export default function Home() {
  return (
    <>
    <Card className="mb-2 bg-[#14213d] shadow-lg border border-yellow-300">
      <CardHeader>
        <CardTitle className="text-2xl text-yellow-300">Bem-vindo ao Dashboard</CardTitle>
        <CardDescription className="text-white">Selecione uma opção no menu lateral para começar.</CardDescription>
      </CardHeader>    
    </Card>
    <ListagemCartoesPage />
    </>
  );
}
