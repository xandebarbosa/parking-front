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
      <main className="p-4 sm:ml-64">
        {/* Adiciona um padding no topo para o conteúdo não ficar colado */}
        <TooltipProvider>
          <div className="p-4 sm:p-8 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-1">
            {children}
          </div>
        </TooltipProvider>
      </main>
    </div>
  );
}
