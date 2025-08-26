// approval_flow_frontend/app/new-request/page.tsx

import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { NewRequestForm } from "@/components/new-request-form"

export default function NewRequestPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Nueva Solicitud" breadcrumbs={[{ label: "Nueva Solicitud" }]} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <NewRequestForm />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
