// approval_flow_frontend/app/request/[id]/page.tsx
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { RequestDetails } from "@/components/request-details"

// La página ahora es un componente de servidor muy simple.
// Solo se encarga de establecer la estructura y pasar el 'id' al componente cliente.
export default function RequestDetailsPage({ params }: { params: { id: string } }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Toda la lógica, incluido el Header, se mueve al componente cliente */}
        <RequestDetails requestId={params.id} />
      </SidebarInset>
    </SidebarProvider>
  )
}