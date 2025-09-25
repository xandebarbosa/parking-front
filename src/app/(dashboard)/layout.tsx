import { Sidebar } from "@/components/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-300 dark:bg-gray-900">
      <Sidebar />
      <main className="pl-2.5 pr-0 sm:ml-64">
        {/* Adiciona um padding no topo para o conteúdo não ficar colado */}
        <TooltipProvider>
          <div className="px-4 pt-1.5! sm:p-8">
            {children}
          </div>
        </TooltipProvider>
      </main>
    </div>
  );
}
