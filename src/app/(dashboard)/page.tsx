import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ListagemCartoesPage from "./listagem/page";

export default function Home() {
  return (
    <>
    <Card className="mb-2">
      <CardHeader>
        <CardTitle className="text-2xl">Bem-vindo ao Dashboard</CardTitle>
        <CardDescription>Selecione uma opção no menu lateral para começar.</CardDescription>
      </CardHeader>    
    </Card>
    <ListagemCartoesPage />
    </>
  );
}
